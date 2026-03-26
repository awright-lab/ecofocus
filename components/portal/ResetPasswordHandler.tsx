"use client";

import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState<"idle" | "verifying" | "ready" | "error">(
    code || tokenHash ? "verifying" : "idle",
  );

  useEffect(() => {
    let cancelled = false;

    async function completeRecoverySession() {
      try {
        const supabase = getBrowserSupabase();
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (type as "recovery" | undefined) || "recovery",
          });
          if (error) throw error;
        } else {
          const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
          if (!hash) {
            if (!cancelled) setStatus("idle");
            return;
          }

          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (!accessToken || !refreshToken) {
            if (!cancelled) setStatus("idle");
            return;
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        }

        if (!cancelled) {
          setStatus("ready");
          const cleanUrl = new URL(window.location.href);
          cleanUrl.hash = "";
          cleanUrl.searchParams.delete("code");
          cleanUrl.searchParams.delete("token_hash");
          cleanUrl.searchParams.delete("type");
          router.replace(cleanUrl.toString());
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          const forgotPasswordPath = window.location.pathname.startsWith("/portal")
            ? "/portal/forgot-password"
            : "/forgot-password";
          const fallbackUrl = new URL(forgotPasswordPath, window.location.origin);
          fallbackUrl.searchParams.set("error", "reset_callback_failed");
          router.replace(fallbackUrl.toString());
        }
      }
    }

    void completeRecoverySession();

    return () => {
      cancelled = true;
    };
  }, [code, tokenHash, type, router]);

  if (status === "idle" || status === "ready") return null;

  return (
    <div className="text-sm text-slate-600">
      Verifying your reset link…
    </div>
  );
}
