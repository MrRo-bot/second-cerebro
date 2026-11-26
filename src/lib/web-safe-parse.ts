import dns from "node:dns";
import net from "node:net";
import { Agent, fetch as undiciFetch, type Response } from "undici";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const MAX_REDIRECTS = 5;
const WEB_FETCH_TIMEOUT_MS = 8_000;
const WEB_FETCH_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

/* -------------------------------------------------------------------------- */
/*  IP blocklist (net.BlockList handles IPv4-mapped IPv6 like ::ffff:7f00:1)  */
/* -------------------------------------------------------------------------- */

const IPV4_BLOCKED: Array<[string, number]> = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // CGNAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local / cloud metadata
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.0.2.0", 24], // TEST-NET-1
  ["192.88.99.0", 24], // deprecated 6to4 relay
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["198.51.100.0", 24], // TEST-NET-2
  ["203.0.113.0", 24], // TEST-NET-3
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved + broadcast
];

const IPV6_BLOCKED: Array<[string, number]> = [
  ["::", 96], // unspecified, loopback, deprecated IPv4-compatible
  ["64:ff9b::", 96], // NAT64 (embeds IPv4)
  ["2001::", 32], // Teredo
  ["2001:db8::", 32], // documentation
  ["2002::", 16], // 6to4 (embeds IPv4)
  ["fc00::", 7], // unique local
  ["fe80::", 10], // link-local
  ["ff00::", 8], // multicast
];

const blockList = new net.BlockList();
for (const [addr, prefix] of IPV4_BLOCKED) blockList.addSubnet(addr, prefix, "ipv4");
for (const [addr, prefix] of IPV6_BLOCKED) blockList.addSubnet(addr, prefix, "ipv6");

export function isBlockedIp(rawIp: string): boolean {
  const ip = rawIp.split("%")[0]; // strip IPv6 zone id (fe80::1%eth0)
  const family = net.isIP(ip);
  if (family === 0) return true; // not an IP -> fail closed
  return blockList.check(ip, family === 4 ? "ipv4" : "ipv6");
}

/* -------------------------------------------------------------------------- */
/*  Connect-time DNS guard (closes the resolve-then-connect TOCTOU window)    */
/* -------------------------------------------------------------------------- */

class BlockedAddressError extends Error {
  constructor(message = "URL resolves to a blocked or internal IP address") {
    super(message);
    this.name = "BlockedAddressError";
  }
}

const guardedLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "", 0);

    if (!addresses || addresses.length === 0) {
      return callback(new Error("Unable to resolve hostname"), "", 0);
    }

    // The exact addresses the socket will use are validated here,
    // so a second DNS answer can't swap in an internal IP.
    const blocked = addresses.find((a) => isBlockedIp(a.address));
    if (blocked) {
      // Only reveal the address in dev; never leak resolution details in prod.
      const detail =
        process.env.NODE_ENV !== "production"
          ? `URL resolves to a blocked or internal IP address (${blocked.address})`
          : undefined;
      return callback(new BlockedAddressError(detail), "", 0);
    }

    if (options.all) return callback(null, addresses);
    return callback(null, addresses[0].address, addresses[0].family);
  });
};

const safeAgent = new Agent({ connect: { lookup: guardedLookup } });

function toError(error: unknown): Error {
  const cause = (error as { cause?: unknown } | null)?.cause;
  if (cause instanceof BlockedAddressError) return cause;
  if (error instanceof Error && error.name === "TimeoutError") {
    return new Error("Request timed out");
  }
  return error instanceof Error ? error : new Error(String(error));
}

/* -------------------------------------------------------------------------- */
/*  URL validation                                                            */
/* -------------------------------------------------------------------------- */

async function validateTargetUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Invalid URL format");
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  if (!parsed.hostname) {
    throw new Error("URL must include a hostname");
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, "");

  // IP literals skip DNS entirely, so they must be checked here.
  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) {
      throw new Error("Access to private or internal IP addresses is blocked");
    }
  }

  // Hostnames are validated at connect time by guardedLookup.
  return parsed;
}

/* -------------------------------------------------------------------------- */
/*  Size-limited body reader                                                  */
/* -------------------------------------------------------------------------- */

async function readBodyWithByteLimit(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    await response.body?.cancel().catch(() => {});
    throw new Error("Response exceeds maximum allowed size");
  }

  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let html = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel("Response byte limit exceeded");
      throw new Error("Response exceeds maximum allowed size");
    }

    html += decoder.decode(value, { stream: true });
  }

  html += decoder.decode();
  return html;
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

export async function fetchSafeWebPageHtml(initialUrl: string): Promise<{
  finalUrl: string;
  html: string;
}> {
  let currentUrl = initialUrl;
  let redirectCount = 0;

  // One deadline for the whole chain (all redirects + body), not per hop.
  const signal = AbortSignal.timeout(WEB_FETCH_TIMEOUT_MS);

  while (true) {
    const validatedUrl = await validateTargetUrl(currentUrl);

    let response: Response;
    try {
      response = await undiciFetch(validatedUrl.toString(), {
        method: "GET",
        redirect: "manual",
        signal,
        dispatcher: safeAgent,
      });
    } catch (error) {
      throw toError(error);
    }

    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel().catch(() => {}); // free the socket

      const location = response.headers.get("location");
      if (!location) {
        throw new Error("Redirect missing Location header");
      }

      redirectCount += 1;
      if (redirectCount > MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }

      try {
        currentUrl = new URL(location, validatedUrl).toString();
      } catch {
        throw new Error("Invalid redirect URL");
      }
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      throw new Error(`Failed to fetch web page: HTTP ${response.status}`);
    }

    try {
      const html = await readBodyWithByteLimit(response, WEB_FETCH_MAX_BYTES);
      return { finalUrl: validatedUrl.toString(), html };
    } catch (error) {
      throw toError(error);
    }
  }
}