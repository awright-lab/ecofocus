import { createHmac, timingSafeEqual } from "node:crypto";
import { getPortalOrigin } from "@/lib/portal/host";
import { getServiceSupabase } from "@/lib/supabase/server";

type PasswordResetTokenPayload = {
  email: string;
  exp: number;
};

function normalizeEmail(value?: string | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

type AuthUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

function getPasswordResetSecret() {
  return (
    process.env.PORTAL_PASSWORD_RESET_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "local-portal-password-reset-secret"
  );
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
  return createHmac("sha256", getPasswordResetSecret()).update(encodedPayload).digest("base64url");
}

function verifySignature(encodedPayload: string, signature: string) {
  const expectedSignature = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function buildPortalPasswordResetToken(email: string, expiresInMinutes = 60) {
  const payload: PasswordResetTokenPayload = {
    email: normalizeEmail(email),
    exp: Date.now() + expiresInMinutes * 60 * 1000,
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

export function verifyPortalPasswordResetToken(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;
  if (!verifySignature(encodedPayload, signature)) return null;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as PasswordResetTokenPayload;
    if (!payload.email || !payload.exp) return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getPortalResettableUser(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!email) return null;

  try {
    const admin = getServiceSupabase();
    const { data, error } = await admin
      .from("portal_users")
      .select("id, name, email, status")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      return null;
    }

    if (data && data.status !== "inactive") {
      return {
        id: data.id as string,
        name: data.name as string,
        email: data.email as string,
        status: data.status as string,
      };
    }

    const authUser = await findAuthUserByEmail(admin, email);
    if (!authUser) {
      return null;
    }

    const bootstrappedUser = await bootstrapPortalUserFromAuth(admin, authUser);
    if (!bootstrappedUser || bootstrappedUser.status === "inactive") {
      return null;
    }

    return bootstrappedUser;
  } catch {
    return null;
  }
}

export function buildPortalPasswordResetUrl(email: string, requestUrl?: string | null) {
  const token = buildPortalPasswordResetToken(email);
  const resetUrl = new URL("/reset-password", getPortalOrigin(requestUrl));
  resetUrl.searchParams.set("token", token);
  resetUrl.searchParams.set("email", email);
  return resetUrl.toString();
}

async function findAuthUserByEmail(admin: ReturnType<typeof getServiceSupabase>, email: string): Promise<AuthUserLike | null> {
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(error.message);
    }

    const matchedUser = (data?.users || []).find((user) => normalizeEmail(user.email) === email);
    if (matchedUser) {
      return matchedUser as AuthUserLike;
    }

    if ((data?.users || []).length < perPage) {
      break;
    }

    page += 1;
  }

  return null;
}

async function bootstrapPortalUserFromAuth(admin: ReturnType<typeof getServiceSupabase>, authUser: AuthUserLike) {
  const email = normalizeEmail(authUser.email);
  if (!email) return null;

  const metadata = authUser.user_metadata || {};
  const roleValue = typeof metadata.portal_role === "string" ? metadata.portal_role : typeof metadata.role === "string" ? metadata.role : "";
  const companyId =
    typeof metadata.portal_company_id === "string"
      ? metadata.portal_company_id
      : typeof metadata.company_id === "string"
        ? metadata.company_id
        : "";
  const portalUserId =
    typeof metadata.portal_user_id === "string" && metadata.portal_user_id.trim()
      ? metadata.portal_user_id.trim()
      : authUser.id;
  const name =
    typeof metadata.name === "string" && metadata.name.trim()
      ? metadata.name.trim()
      : email.split("@")[0] || "EcoFocus User";

  if (roleValue !== "client_user" && roleValue !== "client_admin" && roleValue !== "support_admin") {
    return null;
  }

  if (!companyId) {
    return null;
  }

  const { error: upsertError } = await admin.from("portal_users").upsert(
    {
      id: portalUserId,
      name,
      email,
      company_id: companyId,
      role: roleValue,
      status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  const { data, error } = await admin
    .from("portal_users")
    .select("id, name, email, status")
    .eq("id", portalUserId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id as string,
    name: data.name as string,
    email: data.email as string,
    status: data.status as string,
  };
}
