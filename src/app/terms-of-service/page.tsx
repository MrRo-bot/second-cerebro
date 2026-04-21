import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            <p className="text-accent-foreground/50 text-center text-sm mt-2">
              Below you can find details of our terms of service.
            </p>
          </div>
          <p className="text-muted-foreground mr-auto my-5 text-sm">
            Last updated:
            <span> 21/04/2026</span>
          </p>
          <p className="text-sm text-accent-foreground/80">
            Welcome to Second Cerebro! These Terms of Service (“Terms”) govern
            your use of Second Cerebro&apos;s website, browser extension, and
            services (collectively, the “Service”). By using Second Cerebro, you
            agree to comply with these Terms. If you do not agree, please do not
            use the Service.
          </p>
          {/* OVERVIEW */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Overview of Second Cerebro
          </h2>
          <p className="text-sm text-accent-foreground/80">
            Second Cerebro provides AI-powered tools to help users organize,
            summarize, and second Cerebro knowledge efficiently. Our services
            are designed for personal and professional use, subject to
            reasonable limits outlined in our <strong>Fair Use Policy</strong>.
          </p>
          {/* ACCOUNT REGISTRATION */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Account Registration & Responsibilities
          </h2>
          <ul className="m-5 mt-2 list-disc text-accent-foreground/80">
            <li className="mb-3">
              You must provide accurate, up-to-date information when creating an
              account.
            </li>
            <li className="mb-3">
              Second Cerebro accounts are{" "}
              <strong> intended for individual use only </strong>. Sharing,
              reselling, or redistributing access is prohibited.
            </li>
            <li>
              Excessive usage across multiple{" "}
              <strong>browser instances or devices</strong> may cause technical
              issues, although it is optimized for a multiple instances.
            </li>
          </ul>
          {/* FAIR USE POLICY */}
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />
          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Fair Use Policy
          </h2>

          <p className="text-sm text-accent-foreground/80">
            To ensure a high-quality experience for all users, Second Cerebro
            enforces a <strong>Fair Use Policy</strong>:
          </p>
          <ul className="m-5 list-disc text-accent-foreground/80">
            {/* <li className="mb-4">
              <strong>Unlimited Plans Have Limits</strong>: Our unlimited plan
              provides generous access, but extreme usage that results in
              excessive operational costs beyond reasonable thresholds may
              require review.
            </li> */}
            <li className="mb-3">
              <strong>Prohibited Activities</strong>:
              <ul className="list-[circle] m-5 text-accent-foreground/80">
                <li className="mb-2">
                  Using scripts, bots, or automation to artificially generate
                  excessive usage.
                </li>
                <li className="mb-2">
                  Exploiting the system to incur extreme costs beyond normal
                  usage patterns.
                </li>
                <li>
                  Sharing, reselling, or redistributing account access to
                  others.
                </li>
              </ul>
            </li>
            <li>
              <strong>Enforcement</strong>: If we determine a user exceeds fair
              usage, we may: Contact the user to discuss
              {/* alternative plans or
              adjustments. Temporarily pause or modify the subscription for
              review. Recommend a tailored usage plan to align with service
              costs */}
              .
            </li>
          </ul>
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />

          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            User Content & Privacy
          </h2>

          <ul className="m-5 mt-2 list-disc text-accent-foreground/80">
            <li className="mb-2">
              You retain ownership of any content you upload or create using
              Second Cerebro.
            </li>
            <li className="mb-2">
              We are committed to protecting your privacy. Our{" "}
              <Link className="underline" href="terms-of-service">
                Privacy Policy
              </Link>{" "}
              outlines how we handle user data.
            </li>
          </ul>
          <Separator className="h-1px! bg-accent-foreground/50! my-8" />

          <h2 className="scroll-m-20 text-left text-xl font-semibold font-heading tracking-wide text-balance py-2">
            Contact Information
          </h2>

          <p className="text-sm text-accent-foreground/80">
            If you have any questions about these Terms, contact us at{" "}
            <Link className="underline" href="terms-of-service">
              support@getrecall.ai
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
