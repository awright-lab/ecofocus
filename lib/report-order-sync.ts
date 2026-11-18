import 'server-only';
import { getStripeServer } from '@/lib/stripe';

export async function recordReportOrder(sessionId: string) {
  const base = (process.env.PAYLOAD_BASE_URL || process.env.NEXT_PUBLIC_CMS_URL || '').replace(/\/$/, '');
  const key = process.env.REPORTS_API_KEY;
  if (!base || !key) throw new Error('Report order recording is not configured.');
  const response = await fetch(`${base}/api/report-orders/sync`, {
    method: 'POST', headers: { Authorization: `users API-Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }), cache: 'no-store', signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`Report order could not be recorded (${response.status}).`);
  return response.json();
}

export async function recordReportRefund(paymentIntentId: string) {
  const sessions = await getStripeServer().checkout.sessions.list({ payment_intent: paymentIntentId, limit: 100 });
  if (sessions.has_more) throw new Error('Could not resolve all refunded report orders.');
  for (const session of sessions.data) {
    if (session.metadata?.source === 'report-store' && session.payment_status === 'paid') await recordReportOrder(session.id);
  }
}
