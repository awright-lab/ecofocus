import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { getPortalDashboardCatalog } from "@/lib/portal/data";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

type DashboardCatalogBody = {
  slug?: string;
  name?: string;
  description?: string;
  accessTag?: string;
  embedAccess?: "public_link" | "displayr_login_required";
  availableToAll?: boolean;
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function normalizeCatalogStorageError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("portal_dashboards") || message.includes("available_to_all")) {
    return "Dashboard catalog storage is not ready yet. Apply docs/portal_dashboards.sql in Supabase first.";
  }
  return message;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function requireSupportAdmin() {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return { error: asJson({ error: "Unauthorized" }, 401) };
  }
  if (access.isPreviewMode) {
    return {
      error: asJson(
        { error: "Support preview mode is read-only. Exit preview mode to change the dashboard catalog." },
        403,
      ),
    };
  }

  return { access };
}

export async function POST(req: NextRequest) {
  const auth = await requireSupportAdmin();
  if (auth.error) return auth.error;

  let body: DashboardCatalogBody;
  try {
    body = (await req.json()) as DashboardCatalogBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const accessTag = String(body.accessTag || "").trim();
  const embedAccess =
    body.embedAccess === "displayr_login_required" ? "displayr_login_required" : "public_link";
  const availableToAll = Boolean(body.availableToAll);

  if (!name || !description || !accessTag) {
    return asJson({ error: "Name, description, and category are required." }, 400);
  }

  const slug = slugify(body.slug || name);
  if (!slug) {
    return asJson({ error: "A valid dashboard slug could not be generated." }, 400);
  }

  const existingCatalog = await getPortalDashboardCatalog();
  const existing = existingCatalog.find((dashboard) => dashboard.slug === slug);
  const id = existing?.id || `dashboard-${slug}`;

  try {
    const admin = getServiceSupabase();
    const { error } = await admin.from("portal_dashboards").upsert(
      {
        id,
        slug,
        name,
        description,
        access_tag: accessTag,
        embed_access: embedAccess,
        available_to_all: availableToAll,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );

    if (error) {
      return asJson({ error: normalizeCatalogStorageError(error.message) }, 500);
    }

    await logPortalAdminAuditEvent({
      access: auth.access,
      action: existing ? "dashboard_catalog_updated" : "dashboard_catalog_created",
      title: name,
      entityId: slug,
      notes: existing
        ? `Dashboard catalog details updated for ${slug}.`
        : `Dashboard added to the shared catalog as ${slug}.`,
      metadata: {
        slug,
        accessTag,
        availableToAll,
        embedAccess,
      },
    });

    return asJson({ ok: true, slug });
  } catch (error) {
    return asJson(
      {
        error: normalizeCatalogStorageError(error),
      },
      503,
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireSupportAdmin();
  if (auth.error) return auth.error;

  const slug = String(req.nextUrl.searchParams.get("slug") || "").trim();
  if (!slug) {
    return asJson({ error: "slug is required." }, 400);
  }

  try {
    const admin = getServiceSupabase();
    const dashboard = (await getPortalDashboardCatalog()).find((item) => item.slug === slug) || null;
    const { error: deleteConfigsError } = await admin
      .from("portal_dashboard_configs")
      .delete()
      .eq("dashboard_slug", slug);

    if (deleteConfigsError) {
      return asJson({ error: normalizeCatalogStorageError(deleteConfigsError.message) }, 500);
    }

    const { error } = await admin.from("portal_dashboards").delete().eq("slug", slug);
    if (error) {
      return asJson({ error: normalizeCatalogStorageError(error.message) }, 500);
    }

    await logPortalAdminAuditEvent({
      access: auth.access,
      action: "dashboard_catalog_deleted",
      title: dashboard?.name || slug,
      entityId: slug,
      notes: "Dashboard removed from the shared catalog and workspace access mappings were deleted.",
      metadata: {
        slug,
      },
    });

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: normalizeCatalogStorageError(error),
      },
      503,
    );
  }
}
