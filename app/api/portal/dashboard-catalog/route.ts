import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
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
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
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
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    return asJson({ ok: true, slug });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Dashboard catalog storage unavailable.",
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
    const { error: deleteConfigsError } = await admin
      .from("portal_dashboard_configs")
      .delete()
      .eq("dashboard_slug", slug);

    if (deleteConfigsError) {
      return asJson({ error: deleteConfigsError.message }, 500);
    }

    const { error } = await admin.from("portal_dashboards").delete().eq("slug", slug);
    if (error) {
      return asJson({ error: error.message }, 500);
    }

    return asJson({ ok: true });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Dashboard catalog storage unavailable.",
      },
      503,
    );
  }
}
