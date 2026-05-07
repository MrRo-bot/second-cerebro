import type { Metadata } from "next";
import { Orbitron, Oxanium } from "next/font/google";
import { Suspense } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import "./globals.css";

import AuthToast from "@/components/toast/AuthToast";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ToasterClient from "@/components/toast/ToasterClient";
// import ConnectivityProvider from "@/components/ConnectivityProvider";

import { cn } from "@/lib/utils";

import { PROJECT_NAME } from "@/lib/constants";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: PROJECT_NAME,
  description: "AI second brain SAAS",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // TODO: OPTIONAL
  // preloadEmbeddingModel().catch(console.error);
  gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        oxanium.variable,
        orbitron.variable,
      )}
      ml-update="aware"
      suppressHydrationWarning
    >
      <body className="w-screen min-h-screen overflow-x-hidden overflow-y-auto bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* connectivity provider */}
          {/* //todo: enable this in production */}
          {/* <ConnectivityProvider>
          {children}
          </ConnectivityProvider> */}
          {children}

          {/* making toaster client component for using useTheme() */}
          <ToasterClient />
          {/* explicitly created toast for auth related routes */}
          <Suspense fallback={null}>
            <AuthToast />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
