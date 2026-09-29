# Automatic Displayr onboarding

An eligible customer signs into EcoFocus. Railway creates and activates a separate
Displayr viewer, retrieves the invitation through the connected Gmail mailbox,
loads the generated credentials at runtime, and synchronizes the workspace's
viewing groups. Customers do not need a separate Displayr signup. Normal
onboarding does not require per-user secrets or a Railway restart.

## Implementation and verification

The pipeline is implemented behind rollout flags. Local tests cover the worker,
database leases and one-use permits, credential encryption and runtime refresh,
Gmail invitation validation, guarded browser creation and activation, and private
API authorization. Earlier live tests verified the mailbox, manual test activation,
individual viewer sign-in, permission changes and session renewal separately.
**A new live account has not yet traversed this combined pipeline.**

Stages shown to EcoFocus admins in Dashboard Access:
`queued` -> `invitation_pending` -> `activation_pending` ->
`credentials_verified` -> `ready`, or `needs_attention`.
“Ready” requires permission readback for the current assignment revision and the
same viewer identity. Permission status remains separate and can become pending
or denied after assignments change.

## Runtime design

- The portal discovers active, non-support-admin users with valid dashboard/group
  mappings. Invited/inactive users and users without assigned reports are excluded.
- The portal saves a deterministic mailbox alias and generated password before any
  Displayr write. Passwords use AES-256-GCM with the portal user ID as associated
  data. A separate HKDF key derives from `DISPLAYR_MAILBOX_ENCRYPTION_KEY`.
  Rotating that base key requires re-encrypting both mailbox and viewer records.
- Private worker calls require `DISPLAYR_PERMISSION_SYNC_SECRET`; browser-origin
  requests are rejected. Browsers cannot read jobs or encrypted credentials.
- Jobs have five-minute leases and durable one-use invitation/activation permits.
  Lost responses never trigger blind re-submission. Retries wait at least one
  minute; unfinished jobs move to attention after one day when released.
- Existing accounts are located at `/MyAccount?company_id=984256&tab=company` by
  exact email. Missing or incomplete lists stop creation. New accounts start with
  no viewing groups. The hidden user-type default is preserved from Displayr's
  observed form; confirm its behavior during the controlled live test.
- Invitation bodies must match the generated recipient, job creation time,
  Displayr sender, Google authentication results, company and activation URL.
  Unverified or ambiguous invitations cannot activate a viewer.
- Successful login is independently verified and the numeric Displayr user ID is
  saved before runtime credentials are installed. The permission worker uses that
  ID and rechecks the email before changing groups.
- Existing startup-configured viewers are retained. New automatic users cannot
  overwrite their credentials. Failed credential refreshes leave the previous
  runtime snapshot intact. Normal portal authorization still applies to every
  dashboard request, including suspended users.

## Deployment order

1. Apply `supabase/migrations/20260929192356_displayr_automatic_provisioning.sql`.
   It adds the private table and service-only lease/transition functions.
2. Deploy the portal and Railway gateway code with automatic provisioning disabled.
   Railway's build must include `lib/portal/displayr-invitation-link.ts` as specified
   in the Dockerfile.
3. Verify the existing mailbox, admin credentials and permission worker settings.
4. Set Netlify `DISPLAYR_SYNC_COMPANY_ID=984256` (also present on Railway).
   Set `DISPLAYR_PROVISIONING_ENABLED=true` on both services. Start Netlify
   `DISPLAYR_PROVISIONING_USER_IDS` with one approved test portal user ID.
   Keep the existing mailbox encryption key and synchronization secret.
5. Run the controlled live checks below. After they pass, change Netlify
   `DISPLAYR_PROVISIONING_USER_IDS=*` to include future eligible users automatically.
   Explicit legacy pilot IDs remain excluded from new automatic enrollment.

Railway also needs its existing `DISPLAYR_PERMISSION_SYNC_ENABLED=true`,
`DISPLAYR_SYNC_ADMIN_EMAIL`, `DISPLAYR_SYNC_ADMIN_PASSWORD`,
`DISPLAYR_SYNC_COMPANY_ID`, portal origin and shared synchronization secret.
Netlify needs `DISPLAYR_GATEWAY_ENABLED=true`, mailbox OAuth credentials, saved
mailbox connection and encryption key, and the shared synchronization secret.
There is no new password/key to distribute per viewer.

## Controlled live checks before beta

- Activate one isolated test portal user with a mapped workspace assignment.
- Confirm exactly one Displayr viewer/invitation, correct viewer role, and no
  editing or broader group access. Confirm actual Gmail authentication headers
  satisfy the parser and that the live company directory is complete.
- Confirm activation, numeric identity, runtime credentials and current permission
  readback, then open the assigned dashboard from that portal account.
- Restart Railway; confirm the viewer is loaded from saved encrypted credentials
  without another invitation or activation.
- Remove/re-enable the workspace assignment and suspend/reactivate the portal
  user; confirm denied access and correct group reconciliation.
- Check interrupted jobs, expired leases and delayed invitations. Inspect attention
  cases before intervening; do not clear a one-use permit merely to retry a POST.

## Work that remains a deliberate admin decision

EcoFocus still defines which dashboards each workspace is entitled to use and
confirms the Displayr report-to-view-only-group mapping when publishing a report.
Once mapped and assigned, account creation, invitation retrieval, activation,
credential loading and membership synchronization run automatically. Exceptional
upstream form changes, ambiguous existing accounts or failed activation require
review; the system does not guess or create another account.
