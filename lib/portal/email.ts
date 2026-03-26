type SendPortalEmailResult = {
  emailSent: boolean;
  emailWarning: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendWithResend({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<SendPortalEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PORTAL_FROM_EMAIL || process.env.FROM_EMAIL;

  if (!apiKey || !from) {
    return {
      emailSent: false,
      emailWarning: "Email delivery provider is not configured. Add RESEND_API_KEY and PORTAL_FROM_EMAIL to send branded EcoFocus emails.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    return {
      emailSent: false,
      emailWarning: body || "Branded email delivery failed.",
    };
  }

  return {
    emailSent: true,
    emailWarning: null,
  };
}

export async function sendPortalPasswordResetEmail({
  to,
  recipientName,
  resetUrl,
}: {
  to: string;
  recipientName?: string | null;
  resetUrl: string;
}) {
  const safeName = recipientName ? escapeHtml(recipientName) : "there";
  const safeUrl = escapeHtml(resetUrl);
  const subject = "Reset your EcoFocus Portal password";
  const html = `
    <div style="font-family:Arial,sans-serif;background:#f4f8f6;padding:32px;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #dbe6df;">
        <div style="padding:32px;background:linear-gradient(135deg,#0f766e 0%,#064e3b 45%,#0f172a 100%);color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#a7f3d0;font-weight:700;">EcoFocus Portal</div>
          <h1 style="margin:16px 0 0;font-size:30px;line-height:1.2;">Reset your password</h1>
          <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d1fae5;">Use the secure link below to choose a new password for your EcoFocus Portal account.</p>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Hi ${safeName},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">We received a request to reset your EcoFocus Portal password. This link will expire automatically.</p>
          <p style="margin:0 0 24px;">
            <a href="${safeUrl}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#059669;color:#ffffff;text-decoration:none;font-weight:700;">Reset password</a>
          </p>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#475569;">If the button does not work, copy and paste this link into your browser:</p>
          <p style="margin:0;font-size:13px;line-height:1.7;word-break:break-word;color:#0f172a;">${safeUrl}</p>
        </div>
      </div>
    </div>
  `;
  const text = [
    "EcoFocus Portal password reset",
    "",
    `Hi ${recipientName || "there"},`,
    "",
    "We received a request to reset your EcoFocus Portal password.",
    `Use this secure link to choose a new password: ${resetUrl}`,
  ].join("\n");

  return sendWithResend({
    to,
    subject,
    html,
    text,
  });
}
