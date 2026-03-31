"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";

const ToasterClient = () => {
  const { theme } = useTheme();
  return <Toaster richColors theme={theme as "light" | "dark" | "system"} />;
};

export default ToasterClient;
