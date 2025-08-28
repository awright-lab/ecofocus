// app/api/inquiry/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let payload: Record<string, string> = {};

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    // Honeypot caught upstream, but double-check:
    if (form.get('website')) return NextResponse.json({ ok: true }, { status: 200 });

    payload = {
      inquiryType: String(form.get('inquiryType') || ''),
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      company: String(form.get('company') || ''),
      notes: String(form.get('notes') || ''),
      context: String(form.get('context') || ''),
      ua: req.headers.get('user-agent') || '',
      ts: new Date().toISOString(),
    };
  } else {
    payload = await req.json().catch(() => ({}));
  }

  // TODO: Replace with your integration (examples):
  // await fetch(process.env.ZAPIER_WEBHOOK_URL!, { method: 'POST', body: JSON.stringify(payload) });
  // await resend.emails.send({ ... });
  // await hubspot.contacts.createOrUpdate(payload.email, { ...payload });

  console.log('[Inquiry]', payload); // remove in prod or route to a logger

  return NextResponse.json({ ok: true });
}
