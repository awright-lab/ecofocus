import type { PortalUser } from "@/lib/portal/types";

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_SUPPORT_EMAIL = "support@ecofocusresearch.com";

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
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">New portal support ticket</h2>
        <p style="margin-top: 0;">A client submitted a new ticket in the EcoFocus portal.</p>
        <p><strong>Ticket ID:</strong> ${ticketId}<br />
        <strong>Company:</strong> ${companyName}<br />
        <strong>Requester:</strong> ${actor.name} &lt;${actor.email}&gt;<br />
        <strong>Dashboard:</strong> ${dashboardName}<br />
        <strong>Issue type:</strong> ${issueType}<br />
        <strong>Priority:</strong> ${priority}</p>
        <p><strong>Description</strong><br />${description.replace(/\n/g, "<br />")}</p>
        ${safeNotes ? `<p><strong>Environment notes</strong><br />${safeNotes.replace(/\n/g, "<br />")}</p>` : ""}
        <p><a href="${ticketUrl}">Open ticket in portal</a></p>
      </div>
    `,
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
