import { NextRequest, NextResponse } from 'next/server';
import { getRequestHost } from '@/lib/portal/host';
import { MAILBOX_CALLBACK } from '@/lib/portal/displayr-mailbox-crypto';
import { mailboxAdministrator } from '@/lib/portal/displayr-mailbox';
import { getProvisioningMailboxReader } from '@/lib/portal/displayr-mailbox-reader';
import { MailboxReadError } from '@/lib/portal/displayr-gmail';
const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };
export async function POST(req: NextRequest) {
  const canonical = new URL(MAILBOX_CALLBACK);
  if (getRequestHost(req.headers).toLowerCase() !== canonical.host || req.headers.get('origin') !== canonical.origin || !/^application\/json(?:;|$)/i.test(req.headers.get('content-type') || '')) return NextResponse.json({ reason: 'request-denied' }, { status: 403, headers });
  try {
    if (!(await mailboxAdministrator())) return NextResponse.json({ reason: 'admin-session' }, { status: 403, headers });
    return NextResponse.json(await (await getProvisioningMailboxReader()).checkAccess(), { headers });
  } catch (error) {
    return NextResponse.json({ reason: error instanceof MailboxReadError ? error.reason : 'unavailable' }, { status: 503, headers });
  }
}
