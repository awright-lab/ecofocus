import { getServiceSupabase } from '@/lib/supabase/server';
import { mailboxConfig } from './displayr-mailbox';
import { MAILBOX_EMAIL, decryptMailboxSecret } from './displayr-mailbox-crypto';
import { createProvisioningMailboxReader, MailboxReadError } from './displayr-gmail';

export async function getProvisioningMailboxReader() {
  const { data, error } = await getServiceSupabase().from('portal_displayr_mailbox_connection')
    .select('refresh_token_ciphertext').eq('mailbox', MAILBOX_EMAIL).maybeSingle();
  if (error) throw new MailboxReadError('unavailable');
  if (!data) throw new MailboxReadError('reconnect');
  const { clientId, clientSecret, key } = mailboxConfig();
  let refreshToken: string;
  try { refreshToken = decryptMailboxSecret(data.refresh_token_ciphertext, key, 'refresh'); }
  catch { throw new MailboxReadError('reconnect'); }
  return createProvisioningMailboxReader({ clientId, clientSecret, refreshToken });
}
