// app/api/report-download/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Add new free reports here as you publish them:
// id -> file URL (can be signed URL)
const FREE_FILE_MAP: Record<string, string> = {
  'sir-2024': '/downloads/sir-2024.pdf',
  'sr-2024-1': '/downloads/sr-2024-1.pdf',
  // add more as they become free…
};

export async function POST(req: NextRequest) {
  const ct = req.headers.get('content-type') || '';
  if (!ct.includes('multipart/form-data')) return NextResponse.json({ ok:false }, { status: 400 });

  const form = await req.formData();
  if (form.get('website')) return NextResponse.json({ ok:true }); // honeypot

  const id = String(form.get('reportId') || '');
  const url = FREE_FILE_MAP[id];
  if (!url) return NextResponse.json({ ok:false, error:'Unknown report' }, { status: 404 });

  // TODO: send to CRM
  // console.log('[Report Download]', { id, name: form.get('name'), email: form.get('email'), ... });

  return NextResponse.json({ ok:true, url });
}

