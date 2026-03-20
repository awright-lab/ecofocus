import { getPortalOrigin } from "@/lib/portal/host";
import { getInviteSupabase } from "@/lib/supabase/server";

export async function sendPortalInviteEmail(email: string, requestUrl?: string) {
  const supabase = getInviteSupabase();
  const callbackUrl = new URL("/auth/confirm", getPortalOrigin(requestUrl));
  callbackUrl.searchParams.set("next", "/home");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl.toString(),
    },
  });

  return {
    emailSent: !error,
    emailWarning: error?.message || null,
  };
}
