import type { Metadata } from "next";
import { Orbitron, Oxanium } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Cerebro",
  description: "AI second brain SAAS",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
    >
      <body className="max-w-dvw max-h-dvh p-5">
        {children}
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
