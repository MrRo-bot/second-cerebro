"use client";

import { useRouter } from "next/navigation";

import ActiveSession from "@/components/settings/activeSession";

export default function SessionsPage() {
  const router = useRouter();
  return <ActiveSession onClose={() => router.push('/dashboard')} />;
}
