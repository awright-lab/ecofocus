import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const formPath = '/case-studies/glass-packaging-institute/download';
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex' };

function retry(req: Request, error: string) {
  return new Response(null, { status: 303, headers: { ...headers, Location: new URL(`${formPath}?error=${error}`, req.url).href } });
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin || origin !== new URL(req.url).origin) return new Response('Forbidden', { status: 403, headers });
  if (Number(req.headers.get('content-length')) > 8192) return new Response('Request too large', { status: 413, headers });
  try {
    const body = await req.text();
    if (body.length > 8192) return new Response('Request too large', { status: 413, headers });
    const data = new URLSearchParams(body);
    const firstname = (data.get('firstname') || '').trim();
    const lastname = (data.get('lastname') || '').trim();
    const email = (data.get('email') || '').trim().toLowerCase();
    const validName = (name: string) => name.length > 0 && name.length <= 80 && !/[<>\u0000-\u001f]/.test(name);
    if (data.get('website') || !validName(firstname) || !validName(lastname) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return retry(req, 'invalid');
    const cms = (process.env.PAYLOAD_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL || '').replace(/\/+$/, '');
    const key = process.env.CASE_STUDY_DOWNLOADS_API_KEY;
    if (!cms || !key) return retry(req, 'unavailable');
    // Load before recording a request so a missing deployment asset never counts.
    const file = await readFile(path.join(process.cwd(), 'private/case-studies/EcoFocus_GPI_Case_Study.pdf'));
    const result = await fetch(`${cms}/api/case-study-downloads`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-case-study-download-key': key }, cache: 'no-store', redirect: 'error',
      body: JSON.stringify({ firstName: firstname, lastName: lastname, email, caseStudy: 'glass-packaging-institute-2026' }),
      signal: AbortSignal.timeout(15000),
    });
    if (!result.ok) return retry(req, 'unavailable');
    return new Response(new Uint8Array(file), { headers: { ...headers, 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="EcoFocus_GPI_Case_Study.pdf"' } });
  } catch {
    return retry(req, 'unavailable');
  }
}

export async function GET(req: Request) {
  return new Response(null, { status: 303, headers: { ...headers, Location: new URL(formPath, req.url).href } });
}
