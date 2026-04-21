import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <main className="size-screen">
      <div className="flex flex-col items-center justify-center gap-1.5 relative w-screen h-screen overflow-hidden">
        {/* background gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_var(--border)_1px, transparent 1px),linear-gradient(to_bottom,_var(--border)_1px,_transparent_1px)] bg-size-[40px_40px] opacity-60 pointer-events-auto size-screen" />

        {/* background mask */}
        <div
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent 20%, black)",
          }}
          className=" absolute inset-0 flex items-center justify-center bg-background pointer-events-none"
        />

        {/* corner decorations */}
        <div className=" absolute -top-0.5 -left-0.5 size-8 border-t-4 border-l-4 border-solid border-(--corner-border)" />
        <div className=" absolute -top-0.5 -right-0.5 size-8 border-t-4 border-r-4 border-solid border-(--corner-border)" />
        <div className=" absolute -bottom-0.5 -left-0.5 size-8 border-b-4 border-l-4 border-solid border-(--corner-border)" />
        <div className=" absolute -bottom-0.5 -right-0.5 size-8 border-b-4 border-r-4 border-solid border-(--corner-border)" />

        {/* privacy policy content */}
        <div className="relative z-10 border-solid border-2 border-border bg-background m-10 p-6 max-w-3xl size-full overflow-y-auto">
          <div className="mb-15">
            <h1 className="text-center text-4xl font-heading tracking-widest text-balance">
              Privacy Policy
            </h1>
            <p className="text-accent-foreground/50 text-center text-sm mt-2">
              Below you can find details of our privacy policy.
            </p>
          </div>
          <p className="text-muted-foreground mr-auto my-5 text-sm">
            Last updated:
            <span> 20/04/2026</span>
          </p>
          <p className="text-sm text-accent-foreground/80">
            We believe your data should always be{" "}
            <strong>secure, private, and fully under your control</strong>. This
            Privacy Policy outlines how we safeguard your information when you
            use our Service. However, no system is 100% secure, so we encourage
            users to also take steps to safeguard their credentials.
          </p>
          {/* LOGS DATA */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Logs Data
          </h2>
          <p className="text-sm text-accent-foreground/80">
            When you use the Service, we may collect standard diagnostic
            information your browser sends to us called{" "}
            <strong>Log Data</strong>. This can include details like your{" "}
            <strong>IP address, Browser type and Version</strong>. We use the
            information to simply create user base, all user data is saved in
            secure database.
          </p>
          <p className="text-sm mt-4 text-accent-foreground/80">
            Importantly, features like{" "}
            <strong> Augmented Browsing are local-first </strong>: all
            processing happens on your device, and{" "}
            <strong>no browsing data leaves your computer</strong>. We do not
            track your browsing activity across websites, and we do not store
            any browsing history on our servers.
          </p>
          {/* COOKIES */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Cookies
          </h2>
          <p className="text-sm text-accent-foreground/80">
            Cookies are small data files sent to your browser from websites you
            visit.
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;- Keep you logged in
            <br />
            &nbsp;&nbsp;&nbsp;- Remember your preferences
            <br />
            <br />
            You can disable cookies through your browser settings, though it may
            affect how the app works.
          </p>
          {/* YOUR RIGHTS */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Your Rights (GDPR, CCPA, and similar laws)
          </h2>
          <p className="text-sm text-accent-foreground/80">
            Depending on your location, you may have rights under applicable
            data protection laws, such as:
          </p>
          <ul className="m-5 list-disc text-accent-foreground/80">
            <li>
              <strong>
                {" "}
                Right to access (
                <span className="text-sm text-accent-foreground/50 font-medium">
                  upcoming feature
                </span>
                )
              </strong>{" "}
              – You can request a copy of the personal data we hold about you.
            </li>
            <li>
              <strong> Right to erasure (“Right to be forgotten”)</strong> – You
              can request that we delete your data.
            </li>
            <li>
              <strong>
                {" "}
                Right to data portability (
                <span className="text-sm text-accent-foreground/50 font-medium">
                  upcoming feature
                </span>
                )
              </strong>{" "}
              – You can export your data in a machine-readable format.
            </li>
          </ul>
          <p className="text-sm text-accent-foreground/80">
            To exercise any of these rights, email us at{" "}
            <a className="underline" href="mailto:chhavimanichoubey@outlook.in">
              chhavimanichoubey@outlook.in
            </a>
            . We&apos;ll respond within 30 days.
          </p>
          {/* SERVICE PROVIDERS */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Service Providers
          </h2>
          <p className="text-sm text-accent-foreground/80">
            We use trusted third-party services to support our operations:
          </p>
          <ul className="m-5 list-disc text-accent-foreground/80">
            <li>
              <strong> Google Cloud</strong> – Cloud auth service for google
              login -{" "}
              <a className="underline" href="https://cloud.google.com/">
                Google cloud website
              </a>
            </li>
            <li>
              <strong>Better Auth</strong> – Base authentication platform -
              <a className="underline" href="https://better-auth.com/">
                {" "}
                Better auth website
              </a>
            </li>
            <li>
              <strong>Vercel</strong> – App hosting platform -
              <a className="underline" href="https://vercel.com/">
                {" "}
                Vercel website
              </a>
            </li>
          </ul>
          {/* LINKS TO OTHER SITES */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Links to Other Sites
          </h2>
          <p className="text-sm text-accent-foreground/80">
            Our Service may contain links to external sites
            <strong> (notes can contain links to external site)</strong>. We do
            not control and are not responsible for the privacy practices or
            content of those sites. We encourage you to review their privacy
            policies if you visit them.
          </p>
          {/* CONTACT US */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Contact Us
          </h2>
          <p className="text-sm text-accent-foreground/80">
            If you have any questions, concerns, or requests related to your
            data or this Privacy Policy, please contact us at{" "}
            <a className="underline" href="mailto:chhavimanichoubey@outlook.in">
              chhavimanichoubey@outlook.in
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
