import type { PortalUser } from "@/lib/portal/types";

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_SUPPORT_EMAIL = "support@ecofocusresearch.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPortalEmailFrame({
  eyebrow,
  title,
  intro,
  body,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
}) {
  return `
    <div style="margin:0; background:#edf4f3; padding:32px 16px; font-family:Arial, sans-serif; color:#0f172a;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border:1px solid #dbe4e7; border-radius:28px; overflow:hidden;">
        <div style="padding:24px 28px; background:linear-gradient(135deg, #0b5d4e 0%, #0f172a 100%); color:#ffffff;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.28em; text-transform:uppercase; color:#9fe5cf;">${escapeHtml(eyebrow)}</div>
          <div style="margin-top:12px; font-size:30px; font-weight:700; line-height:1.15;">EcoFocus Portal</div>
          <div style="margin-top:10px; font-size:20px; font-weight:700; line-height:1.3;">${escapeHtml(title)}</div>
          <div style="margin-top:8px; font-size:14px; line-height:1.6; color:#d7efe8;">${escapeHtml(intro)}</div>
        </div>
        <div style="padding:28px;">
          ${body}
        </div>
      </div>
    </div>
  `;
}

function getPortalSiteUrl(fallbackOrigin?: string) {
  return process.env.NEXT_PUBLIC_SITE_URL || fallbackOrigin || "https://ecofocusresearch.com";
}

async function sendPortalEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.PORTAL_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn("[portal/email] Email delivery skipped because RESEND_API_KEY or PORTAL_FROM_EMAIL is not configured.", {
      subject,
      to,
    });
    return { sent: false as const };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Email delivery failed (${response.status}): ${details}`);
  }

  return { sent: true as const };
}

export async function sendPortalPasswordResetEmail({
  to,
  recipientName,
  resetUrl,
}: {
  to: string;
  recipientName: string;
  resetUrl: string;
}) {
  try {
    const delivery = await sendPortalEmail({
      to,
      subject: "Reset your EcoFocus portal password",
      text: [
        `Hello ${recipientName},`,
        ``,
        `Use the link below to reset your EcoFocus portal password:`,
        resetUrl,
        ``,
        `If you didn't request this, you can ignore this email.`,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <p>Hello ${recipientName},</p>
          <p>Use the link below to reset your EcoFocus portal password.</p>
          <p><a href="${resetUrl}">Reset password</a></p>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return {
      emailSent: delivery.sent,
      emailWarning: delivery.sent ? null : "Email delivery is not configured, so a direct reset link must be used instead.",
    };
  } catch (error) {
    return {
      emailSent: false,
      emailWarning: error instanceof Error ? error.message : "Email delivery failed.",
    };
  }
}

export async function sendPortalAccessSetupEmail({
  accessMode,
  companyName,
  deliveryKind = "initial",
  planName,
  setupUrl,
  to,
  recipientName,
}: {
  accessMode: "demo" | "paid";
  companyName: string;
  deliveryKind?: "initial" | "resend";
  planName: string;
  setupUrl: string;
  to: string;
  recipientName: string;
}) {
  const modeLabel = accessMode === "demo" ? "demo portal access" : "portal access";
  const isResend = deliveryKind === "resend";
  const title = isResend
    ? accessMode === "demo"
      ? "Replacement EcoFocus demo portal setup link"
      : "Replacement EcoFocus portal setup link"
    : accessMode === "demo"
      ? "Your EcoFocus demo portal is ready"
      : "Your EcoFocus portal access is ready";
  const intro =
    isResend
      ? "EcoFocus generated a new portal setup link for you. This link replaces any earlier setup links."
      : accessMode === "demo"
      ? "EcoFocus has prepared a demo workspace so your team can explore the portal experience."
      : "EcoFocus has prepared your private workspace so your team can access licensed dashboards and support tools.";
  const escapedSetupUrl = escapeHtml(setupUrl);
  const body = `
    <div style="display:grid; gap:18px;">
      ${
        isResend
          ? `<div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:20px; padding:16px; color:#9a3412; font-size:14px; line-height:1.6;">
              <strong>This is a replacement setup link.</strong><br />
              Use this newest link to create your password. Any earlier EcoFocus portal setup links should be ignored.
            </div>`
          : ""
      }
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:16px;">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Workspace</div>
        <div style="margin-top:8px; font-size:18px; font-weight:700; color:#0f172a;">${escapeHtml(companyName)}</div>
        <div style="margin-top:6px; font-size:13px; color:#475569;">${escapeHtml(planName)} - ${escapeHtml(modeLabel)}</div>
      </div>
      <div style="font-size:14px; line-height:1.7; color:#334155;">
        Hello ${escapeHtml(recipientName)},<br /><br />
        ${
          isResend
            ? "Use the button below to create your EcoFocus portal password with this replacement link. Older setup links will no longer work."
            : "Use the button below to create your EcoFocus portal password. After that, you can sign in with your work email and password."
        }
      </div>
      <div>
        <a
          href="${escapedSetupUrl}"
          style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px; padding:14px 20px; border-radius:14px;"
        >
          Create portal password
        </a>
      </div>
      <div style="font-size:12px; line-height:1.6; color:#64748b;">
        If the button does not work, copy and paste this link into your browser:<br />
        <a href="${escapedSetupUrl}" style="color:#0f766e;">${escapedSetupUrl}</a>
      </div>
    </div>
  `;

  try {
    const delivery = await sendPortalEmail({
      to,
      subject: title,
      text: [
        `Hello ${recipientName},`,
        ``,
        isResend
          ? `EcoFocus generated a replacement setup link for ${modeLabel} for ${companyName}.`
          : `EcoFocus has prepared ${modeLabel} for ${companyName}.`,
        `Plan: ${planName}`,
        ``,
        ...(isResend ? [`This newest link replaces any earlier EcoFocus portal setup links.`, ``] : []),
        `Create your portal password:`,
        setupUrl,
      ].join("\n"),
      html: renderPortalEmailFrame({
        eyebrow: accessMode === "demo" ? "Demo access" : "Portal access",
        title,
        intro,
        body,
      }),
    });

    return {
      emailSent: delivery.sent,
      emailWarning: delivery.sent ? null : "Email delivery is not configured, so copy the setup link manually.",
    };
  } catch (error) {
    return {
      emailSent: false,
      emailWarning: error instanceof Error ? error.message : "Email delivery failed.",
    };
  }
}

export async function sendPortalTeamInviteEmail({
  companyName,
  deliveryKind = "initial",
  inviteUrl,
  invitedByName,
  recipientName,
  roleLabel,
  to,
}: {
  companyName: string;
  deliveryKind?: "initial" | "resend";
  inviteUrl: string;
  invitedByName: string;
  recipientName: string;
  roleLabel: string;
  to: string;
}) {
  const isResend = deliveryKind === "resend";
  const title = isResend ? "Replacement EcoFocus team invite" : "You're invited to the EcoFocus portal";
  const intro = isResend
    ? "A new team invite link was generated for you. This link replaces any earlier setup links."
    : `${invitedByName} invited you to join ${companyName} in the EcoFocus portal.`;
  const escapedInviteUrl = escapeHtml(inviteUrl);
  const body = `
    <div style="display:grid; gap:18px;">
      ${
        isResend
          ? `<div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:20px; padding:16px; color:#9a3412; font-size:14px; line-height:1.6;">
              <strong>This is a replacement invite link.</strong><br />
              Use this newest link to create your password. Any earlier EcoFocus portal invite links should be ignored.
            </div>`
          : ""
      }
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:16px;">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Workspace</div>
        <div style="margin-top:8px; font-size:18px; font-weight:700; color:#0f172a;">${escapeHtml(companyName)}</div>
        <div style="margin-top:6px; font-size:13px; color:#475569;">Role: ${escapeHtml(roleLabel)}</div>
      </div>
      <div style="font-size:14px; line-height:1.7; color:#334155;">
        Hello ${escapeHtml(recipientName)},<br /><br />
        ${
          isResend
            ? "Use the button below to create your EcoFocus portal password with this replacement invite link. Older invite links will no longer work."
            : `${escapeHtml(invitedByName)} invited you to join the EcoFocus portal. Use the button below to create your password and activate your seat.`
        }
      </div>
      <div>
        <a
          href="${escapedInviteUrl}"
          style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px; padding:14px 20px; border-radius:14px;"
        >
          Accept invite
        </a>
      </div>
      <div style="font-size:12px; line-height:1.6; color:#64748b;">
        If the button does not work, copy and paste this link into your browser:<br />
        <a href="${escapedInviteUrl}" style="color:#0f766e;">${escapedInviteUrl}</a>
      </div>
    </div>
  `;

  try {
    const delivery = await sendPortalEmail({
      to,
      subject: title,
      text: [
        `Hello ${recipientName},`,
        ``,
        isResend
          ? `EcoFocus generated a replacement team invite link for ${companyName}.`
          : `${invitedByName} invited you to join ${companyName} in the EcoFocus portal.`,
        `Role: ${roleLabel}`,
        ``,
        ...(isResend ? [`This newest link replaces any earlier EcoFocus portal invite links.`, ``] : []),
        `Accept your invite:`,
        inviteUrl,
      ].join("\n"),
      html: renderPortalEmailFrame({
        eyebrow: isResend ? "Replacement invite" : "Team invite",
        title,
        intro,
        body,
      }),
    });

    return {
      emailSent: delivery.sent,
      emailWarning: delivery.sent ? null : "Email delivery is not configured, so copy the invite link manually.",
    };
  } catch (error) {
    return {
      emailSent: false,
      emailWarning: error instanceof Error ? error.message : "Email delivery failed.",
    };
  }
}

export async function notifySupportOfPortalTicket({
  actor,
  companyName,
  dashboardName,
  description,
  issueType,
  notes,
  origin,
  priority,
  ticketId,
}: {
  actor: PortalUser;
  companyName: string;
  dashboardName: string;
  description: string;
  issueType: string;
  notes?: string;
  origin?: string;
  priority: "low" | "medium" | "high" | "urgent";
  ticketId: string;
}) {
  const siteUrl = getPortalSiteUrl(origin);
  const ticketUrl = `${siteUrl}/portal/support/tickets/${ticketId}`;
  const subject = `[Portal Ticket] ${companyName}: ${issueType} - ${dashboardName}`;
  const safeNotes = notes?.trim();
  const priorityTone =
    priority === "urgent"
      ? { bg: "#fff1f2", border: "#fecdd3", text: "#be123c" }
      : priority === "high"
        ? { bg: "#fff7ed", border: "#fdba74", text: "#c2410c" }
        : priority === "medium"
          ? { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8" }
          : { bg: "#f8fafc", border: "#cbd5e1", text: "#475569" };
  const body = `
    <div style="display:grid; gap:20px;">
      <div style="display:grid; gap:12px; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:16px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Ticket</div>
          <div style="margin-top:8px; font-size:18px; font-weight:700; color:#0f172a;">${escapeHtml(ticketId)}</div>
          <div style="margin-top:6px; font-size:13px; color:#475569;">${escapeHtml(issueType)}</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:20px; padding:16px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Company</div>
          <div style="margin-top:8px; font-size:18px; font-weight:700; color:#0f172a;">${escapeHtml(companyName)}</div>
          <div style="margin-top:6px; font-size:13px; color:#475569;">${escapeHtml(dashboardName)}</div>
        </div>
        <div style="background:${priorityTone.bg}; border:1px solid ${priorityTone.border}; border-radius:20px; padding:16px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Priority</div>
          <div style="margin-top:8px; font-size:18px; font-weight:700; color:${priorityTone.text}; text-transform:capitalize;">${escapeHtml(priority)}</div>
          <div style="margin-top:6px; font-size:13px; color:#475569;">Review and triage in the support queue.</div>
        </div>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:20px;">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Requester</div>
        <div style="margin-top:10px; font-size:16px; font-weight:700; color:#0f172a;">${escapeHtml(actor.name)}</div>
        <div style="margin-top:4px; font-size:14px; color:#2563eb;">
          <a href="mailto:${escapeHtml(actor.email)}" style="color:#2563eb; text-decoration:none;">${escapeHtml(actor.email)}</a>
        </div>
      </div>

      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:20px;">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Description</div>
        <div style="margin-top:12px; font-size:14px; line-height:1.7; color:#334155;">${escapeHtml(description).replace(/\n/g, "<br />")}</div>
      </div>

      ${
        safeNotes
          ? `<div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:24px; padding:20px;">
              <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#64748b;">Environment notes</div>
              <div style="margin-top:12px; font-size:14px; line-height:1.7; color:#334155;">${escapeHtml(safeNotes).replace(/\n/g, "<br />")}</div>
            </div>`
          : ""
      }

      <div style="padding-top:4px;">
        <a
          href="${ticketUrl}"
          style="display:inline-block; background:#0f172a; color:#ffffff; text-decoration:none; font-weight:700; font-size:14px; padding:14px 20px; border-radius:14px;"
        >
          Open ticket in portal
        </a>
      </div>
    </div>
  `;

  return sendPortalEmail({
    to: DEFAULT_SUPPORT_EMAIL,
    subject,
    text: [
      `A client submitted a new portal support ticket.`,
      ``,
      `Ticket ID: ${ticketId}`,
      `Company: ${companyName}`,
      `Requester: ${actor.name} <${actor.email}>`,
      `Dashboard: ${dashboardName}`,
      `Issue type: ${issueType}`,
      `Priority: ${priority}`,
      ``,
      `Description:`,
      description,
      safeNotes ? `\nEnvironment notes:\n${safeNotes}` : "",
      ``,
      `Open ticket: ${ticketUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: renderPortalEmailFrame({
      eyebrow: "Support alert",
      title: "New portal support ticket",
      intro: "A client just opened a new request in the EcoFocus portal. Review the details below and jump into the ticket to respond.",
      body,
    }),
  });
}

export async function notifyClientOfPortalTicketUpdate({
  actionLabel,
  actor,
  dashboardName,
  message,
  origin,
  requester,
  statusLabel,
  ticketId,
  ticketSubject,
}: {
  actionLabel: string;
  actor: PortalUser;
  dashboardName: string;
  message?: string;
  origin?: string;
  requester: PortalUser;
  statusLabel?: string;
  ticketId: string;
  ticketSubject: string;
}) {
  const siteUrl = getPortalSiteUrl(origin);
  const ticketUrl = `${siteUrl}/portal/support/tickets/${ticketId}`;
  const subject = `[EcoFocus Support] Update on ${ticketSubject}`;
  const safeMessage = message?.trim();

  return sendPortalEmail({
    to: requester.email,
    subject,
    text: [
      `Hello ${requester.name},`,
      ``,
      `EcoFocus Support updated your ticket: ${ticketSubject}`,
      `Ticket ID: ${ticketId}`,
      `Dashboard: ${dashboardName}`,
      `Updated by: ${actor.name}`,
      statusLabel ? `Current status: ${statusLabel}` : "",
      `Update type: ${actionLabel}`,
      safeMessage ? `\nMessage:\n${safeMessage}` : "",
      ``,
      `View ticket: ${ticketUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <p>Hello ${requester.name},</p>
        <p>EcoFocus Support updated your ticket <strong>${ticketSubject}</strong>.</p>
        <p><strong>Ticket ID:</strong> ${ticketId}<br />
        <strong>Dashboard:</strong> ${dashboardName}<br />
        <strong>Updated by:</strong> ${actor.name}<br />
        ${statusLabel ? `<strong>Current status:</strong> ${statusLabel}<br />` : ""}
        <strong>Update type:</strong> ${actionLabel}</p>
        ${safeMessage ? `<p><strong>Message</strong><br />${safeMessage.replace(/\n/g, "<br />")}</p>` : ""}
        <p><a href="${ticketUrl}">View ticket in portal</a></p>
      </div>
    `,
  });
}
