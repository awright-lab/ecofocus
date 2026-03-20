"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function ResetPasswordHandler({
  code,
  tokenHash,
  type,
}: {
  code?: string;
  tokenHash?: string;
  type?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (code || tokenHash) {
      const currentPath = window.location.pathname;
      const confirmUrl = new URL("/auth/confirm", window.location.origin);
      if (code) confirmUrl.searchParams.set("code", code);
      if (tokenHash) confirmUrl.searchParams.set("token_hash", tokenHash);
      if (tokenHash) confirmUrl.searchParams.set("type", type || "recovery");
      confirmUrl.searchParams.set("next", currentPath);
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
          const cleanUrl = new URL(window.location.href);
          cleanUrl.hash = "";
          router.replace(cleanUrl.toString());
        }
      } catch {
        if (!cancelled) {
          const forgotPasswordPath = window.location.pathname.startsWith("/portal")
            ? "/portal/forgot-password"
            : "/forgot-password";
          const fallbackUrl = new URL(forgotPasswordPath, window.location.origin);
          fallbackUrl.searchParams.set("error", "reset_callback_failed");
          router.replace(fallbackUrl.toString());
        }
      }
    }

    void completeHashSession();

    return () => {
      cancelled = true;
    };
  }, [code, tokenHash, type, router]);

  if (!code && !tokenHash) return null;

  return (
    <div className="text-sm text-slate-600">
      Verifying your reset link…
    </div>
  );
}
