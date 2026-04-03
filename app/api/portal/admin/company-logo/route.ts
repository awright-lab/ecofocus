import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { getServiceSupabase } from "@/lib/supabase/server";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const LOGO_BUCKET = process.env.PORTAL_COMPANY_LOGO_BUCKET || "portal-company-logos";
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

function slugifyCompanyName(companyName: string) {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "client-company";
}

function normalizeFileExtension(fileName: string, contentType: string) {
  const directExtension = fileName.split(".").pop()?.toLowerCase();
  if (directExtension && ["png", "jpg", "jpeg", "svg", "webp"].includes(directExtension)) {
    return directExtension === "jpeg" ? "jpg" : directExtension;
  }

  if (contentType === "image/png") return "png";
  if (contentType === "image/svg+xml") return "svg";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to upload logos." }, 403);
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return asJson({ error: "Invalid form data" }, 400);
  }

  const companyName = String(formData.get("companyName") || "").trim();
  const file = formData.get("file");

  if (!companyName) {
    return asJson({ error: "Company name is required before uploading a logo." }, 400);
  }

  if (!(file instanceof File)) {
    return asJson({ error: "Logo file is required." }, 400);
  }

  if (!file.type.startsWith("image/")) {
    return asJson({ error: "Only image files can be uploaded as company logos." }, 400);
  }

  if (file.size > MAX_FILE_BYTES) {
    return asJson({ error: "Logo files must be 5 MB or smaller." }, 400);
  }

  const companySlug = slugifyCompanyName(companyName);
  const extension = normalizeFileExtension(file.name, file.type);
  const path = `companies/${companySlug}/logo-${Date.now()}.${extension}`;

  try {
    const admin = getServiceSupabase();
    const arrayBuffer = await file.arrayBuffer();
    const { error } = await admin.storage
      .from(LOGO_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      return asJson({ error: error.message }, 500);
    }

    const { data } = admin.storage.from(LOGO_BUCKET).getPublicUrl(path);
    return asJson({
      ok: true,
      logoUrl: data.publicUrl,
      path,
      bucket: LOGO_BUCKET,
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Logo upload failed.",
      },
      500,
    );
  }
}
