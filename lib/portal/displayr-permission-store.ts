import { getServiceSupabase } from "@/lib/supabase/server";
import {
  permissionPlan,
  permissionStatus,
  type DisplayrSnapshot,
} from "./displayr-permissions";

export async function getDisplayrPermissionPlan(userId: string) {
  const { data, error } = await getServiceSupabase().rpc(
    "portal_displayr_permission_snapshot",
    { p_user_id: userId },
  );
  if (error || !data)
    throw new Error("Displayr permission storage is unavailable.");
  return permissionPlan(data as DisplayrSnapshot);
}
export async function getDisplayrPermissionState(userId: string) {
  const { data, error } = await getServiceSupabase()
    .from("portal_displayr_permission_sync")
    .select("revision,status,reason,checked_at,viewer_key")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error("Displayr permission storage is unavailable.");
  return data;
}
export async function managedDisplayrTarget(
  userId: string,
  companyId: string,
  dashboardSlug: string,
) {
  const [plan, state] = await Promise.all([
    getDisplayrPermissionPlan(userId),
    getDisplayrPermissionState(userId),
  ]);
  const status = permissionStatus(plan, state);
  if (status.status !== "verified" || !state?.viewer_key) return null;
  const binding = plan.assignments.find(
    (a) => a.companyId === companyId && a.dashboardSlug === dashboardSlug,
  )?.binding;
  if (!binding) return null;
  return {
    dashboardPath: `/Dashboard?project_id=${binding.projectId}`,
    documentIds: [binding.projectId],
    viewerKey: state.viewer_key,
  };
}
