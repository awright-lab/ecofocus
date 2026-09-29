# Automatic Displayr onboarding

The intended product is automatic onboarding. A customer signs into EcoFocus;
there is no second Displayr signup, password, manual per-user environment change,
or Railway restart. Dashboard-to-viewing-group mappings remain explicit admin
configuration because those mappings express which reports a workspace may use.

## Verified foundation

- Connected provisioning mailbox and invitation discovery through Gmail API.
- Controlled activation succeeded in the earlier live test.
- Railway authenticates separate viewers and synchronizes viewing groups.
- Live add/remove/re-enable permissions and session renewal were tested.

## Work added September 29 (not enabled in production)

- `provisioning-workflow.mjs`: coordinator with write-ahead transitions, lease
  checks, one-use side-effect permits, existing-account reconciliation, eligibility
  checks and login/permission verification. Uncertain invitation outcomes wait
  for evidence instead of creating a duplicate. Uncertain activation outcomes
  are verified by login instead of replaying the activation POST.
- `viewer-credential-store.mjs`: user-bound AES-256-GCM credential envelope and
  atomic runtime viewer-map installation, including session invalidation on
  rotation/removal. Legacy identities cannot be silently replaced.
- Tests cover ordinary progression, unknown creation/activation responses,
  stale leases, disabled users, identity collisions and authenticated encryption.

These are tested components, not a deployed onboarding pipeline. Remaining:

1. Durable server-side jobs/leases/one-use permits and encrypted credential storage.
2. Discovery of eligible portal users after activation, without provisioning
   inactive users or bypassing workspace entitlements.
3. Live existing-user/invitation lookup, plus guarded creation adapter using the
   observed Displayr form. The prior MyAccount table lookup failed in production;
   confirm the Users-list navigation before relying on it for deduplication.
4. Gmail message-body reader with recipient/time/company/link checks and trusted
   mail authentication evidence. Candidate sender headers alone are insufficient.
5. Connect the tested activation code to the job coordinator with generated,
   persisted credentials. Never retain raw activation URLs in public statuses.
6. Authenticated internal endpoints and Railway scheduling, then runtime credential
   refresh before permission reconciliation. Failures must not erase valid mappings.
7. Administrator-visible stages and actionable failures; bounded retry/backoff.
8. Controlled live test: new portal user -> one viewer -> one invitation ->
   activation -> runtime credentials -> verified permissions -> dashboard load.
   Repeat after restarts and simulated partial failures before wider enrollment.

Do not enable account creation merely because mailbox access is connected or
these component tests pass. Missing/ambiguous upstream identity evidence must
stop creation, rather than replacing an existing viewer or making a duplicate.
