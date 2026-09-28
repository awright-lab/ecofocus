# Workspace-managed Displayr permissions

The portal remains the source of workspace assignments. Every member has a separate Displayr viewer; permissions are the union of that member's active, entitled workspace dashboards. Individual overrides remain deferred.

## Implemented

- The dashboard editor saves its workspace configuration and entitlement in one database transaction. Disabling/hiding removes the entitlement; the gateway still checks the live portal user, subscription and session on every authorization.
- The Displayr panel maps each workspace report to a numeric project ID and restricted group IDs. The administrator must confirm that those groups grant only the intended viewing access. Generic View Documents, editor and administrator groups are refused.
- Mappings are tied to the exact saved publish URL. Changing it invalidates the mapping until an administrator reconfirms it. Managed launches use the mapped numeric project, not the fixed private test copy.
- A persistent per-user reconciliation record tracks pending, syncing, verified and needs-attention states. A database lease prevents concurrent workers. A stale completion cannot authorize changed assignments. Verification expires after five hours; unchanged permissions are rechecked after four hours.
- The worker replaces the viewer's complete group list, including an empty list for removal, and opens the edit form again to verify the actual selected groups. It never creates a user or changes a privileged account. Credentials stay in Railway, and verification is bound to the configured viewer identity.
- Missing mappings, missing viewer credentials, failed writes and failed readback never produce a verified status. Portal access is denied while the current assignment revision is unverified. Existing unmanaged pilot behavior stays available until each user is explicitly enrolled.

## Deployment

1. Apply `docs/portal_displayr_permissions.sql` to the EcoFocus Supabase project. It adds two private RLS tables and service-role-only functions, without changing existing assignment rows. Publish the portal and Railway code together. Railway currently watches its pilot branch, separately from the portal's main branch.
2. On Netlify, set `DISPLAYR_GATEWAY_MANAGED_USER_IDS` to the portal IDs selected for rollout. Start with the dedicated test viewer. Existing pilot lists need not be changed. Set `DISPLAYR_PERMISSION_SYNC_SECRET` to a fresh random secret of at least 32 characters.
3. On Railway, set that **same** `DISPLAYR_PERMISSION_SYNC_SECRET`, `DISPLAYR_SYNC_ADMIN_EMAIL`, `DISPLAYR_SYNC_ADMIN_PASSWORD`, and `DISPLAYR_SYNC_COMPANY_ID`. Supply administrator credentials only through the private variable editor. Keep the administrator separate from all viewer entries.
4. Existing per-user viewer credentials remain in `DISPLAYR_VIEWER_SECRETS_JSON`; do not replace them with administrator credentials. Set `DISPLAYR_PERMISSION_SYNC_ENABLED=true` only after those entries and the report mappings are reviewed. A restart is still required when changing this startup-only viewer credential source.
5. In the dashboard editor save the intended workspace URL and enabled state, then reopen the card. Enter the numeric report/group mapping, confirm restricted viewing access, and save. Refresh the status after a worker cycle (30-second poll, one user per cycle). An unenrolled user is explicitly identified in the panel.
6. Verify with the test account: assigned report opens, unrelated report is denied, filter/export state remains personal, disabling access stops gateway requests and removes the upstream group after reconciliation. Confirm a second workspace retains a shared group after removal from the first.
7. Once every required viewer is provisioned and the live tests pass, `DISPLAYR_GATEWAY_MANAGED_USER_IDS=*` enrolls current and future portal users. A user without a configured Displayr identity reports needs-attention; automated account creation/activation and a durable runtime credential provider are still separate work.

Do not remove a viewer's credential entry before its access-removal job has completed: the worker needs that identity to locate the Displayr account. Previously enrolled identities remain in the reconciliation set after portal-user deletion so their groups can be cleared. Removing an ID from the rollout environment list does not erase its reconciliation record; disable the portal assignment or membership to revoke access.

## Live adapter limitations

Displayr documents editing group membership via Account Settings → Users → the viewer → User Group Membership → Save. The adapter locates the exact viewer email row, validates the live company/email/form controls and a same-origin existing-user action, submits at most one guarded POST, and independently reloads the form. It fails closed if the UI has changed. Browser fixture tests exercise this contract; a live administrator test is required before declaring this integration operational. “Verified” means group membership was read back, not that every dashboard interaction was tested.

Reference: https://help.displayr.com/hc/en-us/articles/4403868947599-How-to-Manage-User-Groups-and-Permissions-in-Displayr

## Validation

- `node --test tests/displayr-permissions.test.mjs tests/displayr-permission-routes.test.mjs tests/displayr-private-test-users.test.mjs services/displayr-gateway/test/permission-worker.test.mjs`
- `node services/displayr-gateway/test/permissions-database.mjs`
- `TEST_CHROME_PATH=/path/to/chromium node services/displayr-gateway/test/group-updater-browser.mjs`
- TypeScript, focused ESLint, and existing gateway service tests.

No actual Displayr group changes are made by these tests.
