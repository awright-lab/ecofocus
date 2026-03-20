import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { activatePortalUserByEmail } from "@/lib/portal/provisioning";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/")) return "/portal/home";
  return next;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const nextPath = getSafeNextPath(requestUrl.searchParams.get("next"));
  const redirectUrl = new URL(nextPath, requestUrl.origin);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    redirectUrl.pathname = "/portal/login";
    redirectUrl.searchParams.set("error", "missing_auth_env");
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        response.cookies.delete({ name, ...options });
      },
    },
  });

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

  try {
    if (tokenHash) {
      const candidateTypes = Array.from(new Set(([type, "magiclink"] as Array<EmailOtpType | null>).filter(Boolean))) as EmailOtpType[];
      let lastError: Error | null = null;

      for (const candidateType of candidateTypes) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: candidateType,
        });

        if (!error) {
          lastError = null;
          break;
        }

        lastError = error;
      }

      if (lastError) throw lastError;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const activation = await activatePortalUserByEmail(user?.email);
      if (activation.status === "inactive" || activation.status === "missing") {
        await supabase.auth.signOut();
        const loginUrl = new URL("/portal/login", requestUrl.origin);
        loginUrl.searchParams.set("redirect", nextPath);
        loginUrl.searchParams.set("error", activation.status === "inactive" ? "access_paused" : "not_provisioned");
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const activation = await activatePortalUserByEmail(user?.email);
      if (activation.status === "inactive" || activation.status === "missing") {
        await supabase.auth.signOut();
        const loginUrl = new URL("/portal/login", requestUrl.origin);
        loginUrl.searchParams.set("redirect", nextPath);
        loginUrl.searchParams.set("error", activation.status === "inactive" ? "access_paused" : "not_provisioned");
        return NextResponse.redirect(loginUrl);
      }
      return response;
    }
  } catch (error) {
    console.warn("[auth/confirm] Supabase auth callback failed.", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const loginUrl = new URL("/portal/login", requestUrl.origin);
  loginUrl.searchParams.set("redirect", nextPath);
  loginUrl.searchParams.set("error", "auth_callback_failed");
  return NextResponse.redirect(loginUrl);
}
