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
    // Fixed diagnostic identity; callers cannot search arbitrary recipients.
    const result = await (await getProvisioningMailboxReader()).findInvitationCandidates(
      'displayr-provisioning-test-2024-v1', new Date('2026-09-14T00:00:00Z'),
    );
    return NextResponse.json({ count: result.candidates.length, complete: result.complete }, { headers });
  } catch (error) {
    return NextResponse.json({ reason: error instanceof MailboxReadError ? error.reason : 'unavailable' }, { status: 503, headers });
  }
}
