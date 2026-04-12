import { NextRequest, NextResponse } from "next/server";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getPortalOrigin } from "@/lib/portal/host";
import { sendPortalAccessSetupEmail } from "@/lib/portal/email";
import { createPortalPasswordSetupToken } from "@/lib/portal/provisioning";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type AccessEmailBody = {
  deliveryKind?: "initial" | "resend";
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function buildSetupUrl(req: NextRequest, email: string, token: string) {
  const setupUrl = new URL("/set-password", getPortalOrigin(req.url));
  setupUrl.searchParams.set("email", email);
  setupUrl.searchParams.set("invite", "1");
  setupUrl.searchParams.set("token", token);
  return setupUrl.toString();
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to send access email." }, 403);
  }

  const { companyId } = await params;
  const targetCompanyId = String(companyId || "").trim();
  if (!targetCompanyId) {
    return asJson({ error: "Company id is required." }, 400);
  }
  let body: AccessEmailBody = {};
  try {
    body = (await req.json()) as AccessEmailBody;
  } catch {
    body = {};
  }
  const deliveryKind = body.deliveryKind === "resend" ? "resend" : "initial";

  try {
    const admin = getServiceSupabase();
    const { data: company, error: companyError } = await admin
      .from("portal_companies")
      .select("id, name, subscriber_type, subscription_id")
      .eq("id", targetCompanyId)
      .maybeSingle();

    if (companyError) return asJson({ error: companyError.message }, 500);
    if (!company) return asJson({ error: "Workspace not found." }, 404);
    if (company.subscriber_type === "internal") {
      return asJson({ error: "Internal EcoFocus workspaces do not use client access setup emails." }, 400);
    }

    const { data: subscription, error: subscriptionError } = await admin
      .from("portal_subscriptions")
      .select("id, plan_name, billing_status")
      .eq("id", String(company.subscription_id))
      .maybeSingle();

    if (subscriptionError) return asJson({ error: subscriptionError.message }, 500);
    if (!subscription) return asJson({ error: "Subscription not found." }, 404);

    const planName = String(subscription.plan_name || "");
    const isDemoSuite = planName === "Demo Suite";
    const billingStatus = String(subscription.billing_status || "not_invoiced");
    if (!isDemoSuite && billingStatus !== "paid") {
      return asJson(
        {
          error: "Paid client access setup can only be sent after billing status is paid. Use Demo Suite for demo access.",
        },
        400,
      );
    }

    const adminRoles = company.subscriber_type === "agency" ? ["agency_admin"] : ["client_admin"];
    const { data: users, error: usersError } = await admin
      .from("portal_users")
      .select("id, name, email, role, status")
      .eq("company_id", targetCompanyId)
      .in("role", adminRoles)
      .neq("status", "inactive")
      .order("created_at", { ascending: true })
      .limit(1);

    if (usersError) return asJson({ error: usersError.message }, 500);
    const clientAdmin = users?.[0] || null;
    if (!clientAdmin) {
      return asJson({ error: "No active company admin user is available for this workspace." }, 404);
    }

    const setupToken = await createPortalPasswordSetupToken({
      createdByUserId: access.user.id,
      email: String(clientAdmin.email),
      userId: String(clientAdmin.id),
    });
    const setupUrl = buildSetupUrl(req, String(clientAdmin.email), setupToken.token);
    const delivery = await sendPortalAccessSetupEmail({
      accessMode: isDemoSuite ? "demo" : "paid",
      companyName: String(company.name),
      deliveryKind,
      planName,
      recipientName: String(clientAdmin.name),
      setupUrl,
      to: String(clientAdmin.email),
    });
    const sentAt = new Date().toISOString();

    await logPortalAdminAuditEvent({
      access,
      action: "portal_access_email_sent",
      title: String(company.name),
      companyId: targetCompanyId,
      entityId: `workspace-access-email:${targetCompanyId}`,
      notes: delivery.emailSent
        ? `Portal access setup email sent to ${String(clientAdmin.email)}.`
        : `Portal access setup link generated for ${String(clientAdmin.email)}.`,
      metadata: {
        accessMode: isDemoSuite ? "demo" : "paid",
        billingStatus,
        deliveryKind,
        emailSent: delivery.emailSent,
        planName,
        recipientEmail: String(clientAdmin.email),
        recipientName: String(clientAdmin.name),
        sentAt,
        tokenExpiresAt: setupToken.expiresAt,
      },
    });

    return asJson({
      ok: true,
      email: clientAdmin.email,
      emailSent: delivery.emailSent,
      emailWarning: delivery.emailWarning,
      sentAt,
      tokenExpiresAt: setupToken.expiresAt,
      setupUrl: delivery.emailSent ? null : setupUrl,
      accessMode: isDemoSuite ? "demo" : "paid",
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Unable to send access setup email.",
      },
      500,
    );
  }
}
