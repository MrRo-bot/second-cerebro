"use client";

import { useRouter } from "next/navigation";

import Profile from "@/components/settings/profile";

export default function ProfileModalPage() {
  const router = useRouter();
  return <Profile onClose={() => router.push('/dashboard')} />;
}