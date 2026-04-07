import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.157"],
  /* might have some issues with turbopack (because of importig node built ins) */
  serverExternalPackages: ["jsdom", "isomorphic-dompurify"],
};

export default nextConfig;
