// components/AuthGate.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/register");
  }, [user, loading, router]);

  if (loading) return <div>Loading…</div>;
  if (!user) return null; // redirecting
  return <>{children}</>;
}