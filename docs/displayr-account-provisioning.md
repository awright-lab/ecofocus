# Displayr viewer provisioning investigation

Status: September 13, 2026. No account-creation automation has been implemented or enabled.

## Required outcome

Company signup creates an EcoFocus workspace. Each authorized portal user needs a distinct Displayr viewer identity, assigned to that workspace's private reports. Additional team members receive their own viewer identities with the same workspace-level dashboard assignments. The customer must not need to visit Displayr to activate an account or choose a second password.

## Current implementation

- `lib/portal/provisioning.ts` provisions portal users, company records, memberships, subscriptions and dashboard mappings. It does not create Displayr users.
- `services/displayr-gateway/login.mjs` reads preconfigured credentials keyed by portal user ID and rejects duplicate Displayr emails. Railway supplies these through its private viewer JSON variable.
- Automatic signup would also need a durable secret provider: adding users to the current startup-only JSON requires a configuration update and process restart. Provisioning must not restart active dashboard sessions for each new user.
- Keep the successfully tested pilot viewer and private test report unchanged while evaluating provisioning.

## Verified public documentation

Sources checked September 13, 2026:

- [Displayr API reference](https://app.displayr.com/API/Reference): documents file uploads, report creation from scripts/archive packs, data updates, scripts, publishing and deletion. No user-creation or user-group-management endpoint is documented in this reference. This does not prove that no additional supported API exists.
- [Getting started with the API](https://help.displayr.com/hc/en-us/articles/360004069595-How-to-Get-Started-with-the-Displayr-API): lists an Enterprise license and a company secret obtained from support as requirements. A document API key alone must not be assumed to provide user administration.
- [Inviting users](https://help.displayr.com/hc/en-us/articles/4405178205839-How-to-Invite-New-Users-to-Your-Displayr-Account): documents individual invitations and bulk CSV import with name, email and groups. The standard invitation requires the recipient to activate the account and choose a password.

## Next verification

The New User form and standard email activation have now been tested manually: creating a viewer sends an invitation, and its activation page accepts a new password. Next, connect the dedicated mailbox and verify the administrator automation interface and workspace group assignment before building the provisioning worker. Activation must follow the invitation flow; it is not skipped.

Questions for Displayr support, if required (draft only; not sent):

> We embed private Displayr reports in our EcoFocus customer portal. Each portal user needs a distinct viewer identity, with report access managed by company workspace. Does our account support an API for creating, activating, disabling viewers and managing user groups? Can we provision administrator-managed viewer credentials without sending customers a Displayr invitation or requiring a separate signup? If available, please provide the API documentation, required account plan and credential setup. We currently do not have Enterprise SSO enabled.

## Implementation once the provisioning method is verified

1. Add a durable provisioning job after authorized workspace/user activation, covering initial company signup and later team additions. Portal signup and support access should not depend on Displayr availability.
2. Use a stable portal user ID for identity mapping and deduplication. Reuse the identity for a user joining additional workspaces; calculate report access from all current authorized memberships.
3. Store generated viewer credentials in a server-only secret store. Store only the mapping and provisioning status in administrator-facing records. Never reuse portal passwords or expose Displayr passwords to browsers, logs or notifications.
4. Create or locate the viewer, apply the correct view-only workspace groups, and verify access to assigned private reports before marking provisioning ready. Do not grant editor or administrator access.
5. Retry transient failures without duplicating accounts. Reconcile uncertain creation results before retrying account creation. Surface an actionable administrator status when activation or an account challenge requires intervention.
6. Synchronize access removal and membership changes. Portal authorization must deny access immediately even if Displayr permission synchronization is delayed. Retain per-user identity isolation for saved Explore work.
7. Verify two separate users and two workspaces, repeated jobs, partial failures, membership removal, and independent saved explorations before enabling automatic provisioning for customers.

User-level dashboard overrides remain a future release requirement, as recorded in `portal-dashboard-access-model.md`.

## Mailbox connection implementation

The administrator manually verified the standard invitation and activation flow using an EcoFocus plus address. The dedicated mailbox `displayr-provisioning@ecofocusworldwide.com` has been created and plus-address delivery tested. Gmail API and a Web application OAuth client have been configured in Google Cloud. No Google credential is stored in this repository.

The portal now includes a mailbox connection page at `/admin/displayr`. It requires a real support administrator session and rejects preview mode. The callback binds a ten-minute, single-use state to the administrator's Auth login session and a secure HttpOnly cookie, uses PKCE, checks the Gmail profile address, and encrypts refresh tokens with AES-256-GCM. The page does not read invitation messages or provision Displayr accounts yet.

Deployment setup:

1. Apply `docs/portal_displayr_mailbox.sql` to the portal database. Both tables deny access to browser roles; only the service role is granted access.
2. Configure these private environment variables on the Netlify portal server: `DISPLAYR_MAILBOX_GOOGLE_CLIENT_ID`, `DISPLAYR_MAILBOX_GOOGLE_CLIENT_SECRET`, and `DISPLAYR_MAILBOX_ENCRYPTION_KEY`. The encryption key must be a fresh random 32-byte value encoded as 64 hexadecimal characters (for example, generate locally with `openssl rand -hex 32`). Store it securely; replacing it requires reconnecting the mailbox. Never use a `NEXT_PUBLIC_` prefix.
3. The Google Web application client's authorized redirect URI must be exactly `https://portal.ecofocusresearch.com/api/portal/admin/displayr/mailbox/callback`. The requested scope is `https://www.googleapis.com/auth/gmail.readonly`; use the organization's Internal audience. JavaScript origins are not required for this server flow.
4. Deploy the portal, sign in as a support administrator, visit `https://portal.ecofocusresearch.com/admin/displayr`, and click Connect provisioning mailbox. Select the dedicated mailbox at Google and approve read-only access. A different Google mailbox is rejected without storing its token.
5. Verify the connection confirmation. A saved connection is not a continuous token-health check. Account creation, invitation processing, credential delivery to the gateway, and workspace group assignment remain separate implementation steps.

Validation: `node --test tests/displayr-mailbox*.test.mjs`, `node --test services/displayr-gateway/test/mailbox-database.test.mjs`, TypeScript checking, and focused ESLint checks. Live consent requires the administrator's private Google credentials and mailbox selection.
