import { hkdfSync, randomBytes } from "node:crypto";
import { getServiceSupabase } from "@/lib/supabase/server";
import { isAutomaticDisplayrUser } from "./displayr-gateway-config";
import { getDisplayrPermissionPlan } from "./displayr-permission-store";
import { displayrViewerAlias } from "./displayr-gmail";
import {
  encryptViewerCredential,
  decryptViewerCredential,
} from "../../services/displayr-gateway/viewer-credential-store.mjs";
function key() {
  const base = process.env.DISPLAYR_MAILBOX_ENCRYPTION_KEY || "";
  if (!/^[a-f0-9]{64}$/i.test(base))
    throw Error("Viewer encryption unavailable");
  return Buffer.from(
    hkdfSync(
      "sha256",
      Buffer.from(base, "hex"),
      "ecofocus",
      "displayr-viewer-credentials-v1",
      32,
    ),
  ).toString("hex");
}
export function provisioningEnabled() {
  return process.env.DISPLAYR_PROVISIONING_ENABLED === "true";
}
export function provisioningEnrolled(userId: string) {
  const ids = (process.env.DISPLAYR_PROVISIONING_USER_IDS || "")
    .split(",")
    .map((x) => x.trim());
  return provisioningEnabled() && (ids.includes("*") || ids.includes(userId));
}
export async function provisioningEligible(userId: string) {
  if (
    !provisioningEnrolled(userId) ||
    !isAutomaticDisplayrUser(userId) ||
    process.env.DISPLAYR_GATEWAY_ENABLED !== "true"
  )
    return false;
  const db = getServiceSupabase();
  const { data, error } = await db
    .from("portal_users")
    .select("status,role")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw Error("User lookup unavailable");
  if (data?.status !== "active" || data.role === "support_admin") return false;
  const plan = await getDisplayrPermissionPlan(userId);
  return (
    !plan.blocked && plan.assignments.length > 0 && plan.groupIds.length > 0
  );
}
export async function ensureProvisioning(userId: string) {
  const credential = {
    email: displayrViewerAlias(userId),
    password: "Ef!" + randomBytes(32).toString("base64url"),
  };
  const ciphertext = encryptViewerCredential(userId, credential, key());
  const { error } = await getServiceSupabase()
    .from("portal_displayr_provisioning")
    .upsert(
      {
        user_id: userId,
        email: credential.email,
        credential_ciphertext: ciphertext,
      },
      { onConflict: "user_id", ignoreDuplicates: true },
    );
  if (error) throw Error("Credential persistence unavailable");
}
export function openProvisioningCredential(row: {
  user_id: string;
  credential_ciphertext: string;
}) {
  return decryptViewerCredential(row.user_id, row.credential_ciphertext, key());
}
