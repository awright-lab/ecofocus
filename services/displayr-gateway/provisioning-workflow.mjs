// Effects are provided by authenticated server/worker adapters. The durable store
// must fence every transition with the job's unexpired lease. No secrets returned.
export const provisioningStages = new Set([
  'queued', 'invitation_pending', 'activation_pending', 'credentials_verified',
  'ready', 'needs_attention',
]);
export async function advanceProvisioning(job, effects) {
  const { store, inspectAccount, invite, findInvitation, activate, verifyLogin,
    synchronize, eligible } = effects;
  if (!job || !provisioningStages.has(job.stage) || !job.userId || !job.leaseId)
    throw new Error('Invalid provisioning job');
  const transition = async (stage, reason = null) => {
    const accepted = await store.transition(job, { stage, reason });
    if (!accepted) throw new Error('Provisioning lease lost');
    job = { ...job, stage };
  };
  const attention = async reason => {
    await transition('needs_attention', reason);
    return { status: 'needs_attention', reason };
  };
  if (job.stage === 'ready' || job.stage === 'needs_attention')
    return { status: job.stage };
  if (!(await eligible(job.userId))) return { status: 'paused' };

  if (job.stage === 'queued') {
    // Persist generated credentials BEFORE creating an account. Creation can
    // succeed even when its response is lost. Never replace a saved password.
    const credential = await store.ensureCredentials(job);
    const account = await inspectAccount(credential.email);
    if (!['absent', 'invited', 'active'].includes(account.status))
      return attention('account_lookup_ambiguous');
    if (account.status === 'active') {
      if (!(await verifyLogin(credential))) return attention('existing_account_credentials');
      await transition('credentials_verified');
    } else {
      // This is a write-ahead marker, not a claim that an invitation was sent.
      await transition('invitation_pending');
      if (account.status === 'absent') {
        if (!(await eligible(job.userId))) return { status: 'paused' };
        // A durable one-use permit prevents a retry or overlapping lease from
        // submitting a second invitation. Unknown outcomes await reconciliation.
        if (!(await store.consumePermit(job, 'invite'))) return { status: 'waiting' };
        try { await invite(credential); }
        catch { return { status: 'waiting', reason: 'invitation_outcome_unknown' }; }
      }
      return { status: 'waiting' };
    }
  }
  if (job.stage === 'invitation_pending') {
    const credential = await store.credentials(job);
    const invitation = await findInvitation({ email: credential.email, userId: job.userId, since: job.createdAt });
    if (invitation.status === 'none') return { status: 'waiting' };
    if (invitation.status !== 'verified') return attention('invitation_not_verified');
    // Recipient/provenance/company/destination validation belongs to the mailbox
    // adapter. Its validated URL is never persisted in public job status/logs.
    await transition('activation_pending');
    if (!(await eligible(job.userId))) return { status: 'paused' };
    if (!(await store.consumePermit(job, 'activate'))) return { status: 'waiting' };
    try { await activate({ ...credential, invitation: invitation.link }); }
    catch { /* Login verification resolves ambiguous activation responses. */ }
  }
  if (job.stage === 'activation_pending') {
    const credential = await store.credentials(job);
    if (!(await verifyLogin(credential))) return attention('activation_requires_review');
    await transition('credentials_verified');
  }
  if (job.stage === 'credentials_verified') {
    if (!(await eligible(job.userId))) return { status: 'paused' };
    // Must read the CURRENT assignment revision and verify complete readback.
    // No account is ready just because its password was accepted.
    const result = await synchronize(job.userId);
    if (!result.verified) return { status: 'waiting', reason: 'permissions_pending' };
    await transition('ready');
    return { status: 'ready' };
  }
  return { status: 'waiting' };
}
