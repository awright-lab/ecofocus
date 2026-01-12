'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

type Props = {
  code?: string;
  redirect: string;
};

export default function LoginHandler({ code, redirect }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!code) return;
      try {
        const supabase = getBrowserSupabase();
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) throw exchangeError;
        if (!cancelled) {
          router.replace(redirect || "/portal");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Sign-in failed. Please request a new link.");
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [code, redirect, router]);

  if (!code) return null;
  return (
    <div className="mx-auto max-w-xl px-4 pt-4 text-sm text-gray-700">
      {!error ? "Signing you in…" : <span className="text-red-600">{error}</span>}
    </div>
  );
}
