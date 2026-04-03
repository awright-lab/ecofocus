import { NextRequest, NextResponse } from "next/server";
import { getPortalAccessContext } from "@/lib/portal/auth";
import { logPortalAdminAuditEvent } from "@/lib/portal/admin-audit";
import { createPortalInvoiceForCompany } from "@/lib/portal/billing";

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

function asJson(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

type InvoiceBody = {
  companyId?: string;
  amountUsd?: number;
  description?: string;
  memo?: string;
  daysUntilDue?: number;
};

export async function POST(req: NextRequest) {
  const access = await getPortalAccessContext();
  if (!access || access.user.role !== "support_admin") {
    return asJson({ error: "Unauthorized" }, 401);
  }
  if (access.isPreviewMode) {
    return asJson({ error: "Support preview mode is read-only. Exit preview mode to create invoices." }, 403);
  }

  let body: InvoiceBody;
  try {
    body = (await req.json()) as InvoiceBody;
  } catch {
    return asJson({ error: "Invalid body" }, 400);
  }

  const companyId = String(body.companyId || "").trim();
  const description = String(body.description || "").trim();
  const amountUsd = Number(body.amountUsd);
  const daysUntilDue = Number(body.daysUntilDue);

  if (!companyId || !description || !Number.isFinite(amountUsd) || amountUsd <= 0) {
    return asJson({ error: "companyId, amountUsd, and description are required." }, 400);
  }

  try {
    const invoice = await createPortalInvoiceForCompany({
      companyId,
      amountUsd,
      description,
      memo: body.memo || "",
      daysUntilDue: Number.isFinite(daysUntilDue) ? daysUntilDue : 30,
    });

    await logPortalAdminAuditEvent({
      access,
      action: "invoice_created",
      title: description,
      companyId,
      entityId: `invoice:${invoice.id}`,
      notes: `Invoice created for $${amountUsd.toFixed(2)} and sent from Stripe.`,
      metadata: {
        amountUsd,
        dueInDays: Number.isFinite(daysUntilDue) ? daysUntilDue : 30,
        status: invoice.status,
      },
    });

    return asJson({
      ok: true,
      invoice,
    });
  } catch (error) {
    return asJson(
      {
        error: error instanceof Error ? error.message : "Invoice creation failed.",
      },
      500,
    );
  }
}
