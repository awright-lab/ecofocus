'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

type Props = {
  code?: string;
  tokenHash?: string;
  type?: string;
  redirect: string;
  remember?: boolean;
};

export default function LoginHandler({ code, tokenHash, type, redirect, remember = false }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (code || tokenHash) {
      const confirmUrl = new URL("/auth/confirm", window.location.origin);
      if (code) confirmUrl.searchParams.set("code", code);
      if (tokenHash) confirmUrl.searchParams.set("token_hash", tokenHash);
      if (tokenHash) confirmUrl.searchParams.set("type", type || "magiclink");
      confirmUrl.searchParams.set("next", redirect || "/portal");
      if (remember) confirmUrl.searchParams.set("remember", "1");
      router.replace(confirmUrl.toString());
      return;
    }

    const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) return;
    const resolvedAccessToken = accessToken;
    const resolvedRefreshToken = refreshToken;

    let cancelled = false;

    async function completeHashSession() {
      try {
        const supabase = getBrowserSupabase();
        const { error } = await supabase.auth.setSession({
          access_token: resolvedAccessToken,
          refresh_token: resolvedRefreshToken,
        });
        if (error) throw error;
        if (!cancelled) {
          router.replace(redirect || "/portal");
        }
      } catch {
        if (!cancelled) {
          const loginUrl = new URL(window.location.href);
          loginUrl.hash = "";
          loginUrl.searchParams.set("error", "auth_callback_failed");
          router.replace(loginUrl.toString());
        }
      }
    }

    void completeHashSession();

    return () => {
      cancelled = true;
    };
  }, [code, tokenHash, type, redirect, remember, router]);

  if (!code && !tokenHash) return null;
  return (
    <div className="mx-auto max-w-xl px-4 pt-4 text-sm text-gray-700">
      Signing you in…
    </div>
  );
}
