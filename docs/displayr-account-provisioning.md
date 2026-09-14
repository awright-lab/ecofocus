# Displayr viewer provisioning investigation

Status: September 14, 2026. The dedicated mailbox is connected. No account-creation automation has been enabled.

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

The New User form and standard email activation have now been tested manually: creating a viewer sends an invitation, and its activation page accepts a new password. The dedicated mailbox is now connected. Next, verify the administrator automation interface and workspace group assignment before building the provisioning worker. Activation must follow the invitation flow; it is not skipped.

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


## Mailbox reader and access check

The administrator page now offers **Check mailbox access**. This exchanges the saved, encrypted refresh token for a short-lived access token, verifies the dedicated Gmail profile, and tests read access with a narrowly filtered messages list. It returns only a success flag and timestamp. A revoked grant asks the administrator to reconnect. This action sends, deletes and activates nothing.

`lib/portal/displayr-gmail.ts` also provides bounded invitation candidate discovery for a stable per-user plus address. It queries mail from `support@displayr.com` to that exact alias after the requested time and checks metadata for sender, recipient, invitation subject and receipt time. It caps pagination and reports incomplete discovery explicitly. These are **candidates**, not authenticated activation instructions: no message body or link is followed. Before implementing activation, inspect an actual invitation's link format and validate its destination, recipient binding and trustworthy message provenance. Do not automatically visit arbitrary email URLs or treat a From header as proof of authenticity.

`displayrViewerAlias(userId)` derives a stable alias from the portal user ID, so changing company membership does not create a new Displayr identity. Existing pilot credentials and activated test addresses are unchanged; reconciliation must precede any future invitation to avoid duplicates.

Remaining prerequisites for viewer creation: identify the Displayr administrator account, configure its credentials privately for an isolated worker, inspect the live user-management interface, and record the view-only groups associated with each workspace/dashboard. No administrative Displayr credential has been requested in chat or committed. The invitation reader is not wired to customer signup yet.

Reader tests: `node --test tests/displayr-gmail.test.mjs tests/displayr-mailbox-check.test.mjs`. Google API references: [messages.list](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list) and [messages.get](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/get). No database changes or new environment variables are needed for this step.

## Administrator inspection

A password-based administrator account has been identified. Supply its email locally using `DISPLAYR_INSPECTION_EMAIL`; the utility does not embed the address. Run `node tools/displayr-admin-inspect.mjs` from an interactive terminal in the checkout. It uses the gateway's installed Playwright dependency and asks for the password without echo. Set `DISPLAYR_INSPECTION_CHROME_PATH` if a custom Chromium executable is needed.

The inspection uses an isolated browser, permits one login POST, and blocks other write requests and external top-level navigation. It reports only same-origin management paths, omitting query strings, page contents, cookies and credentials. It does not click management links or create users. Successful login alone does not verify user-management permissions; inspect the reported management page before implementing mutations.

Cancel with Ctrl+C. Never put the administrator password in a shell command, chat, screenshot or repository file. No browser session is saved. A future provisioning worker still needs its own private credential configuration.

Validation: `node --test tests/displayr-admin-inspect.test.mjs`. Tests cover the request restrictions, target identity, browser cleanup, output shape and sanitized failures. The hidden terminal prompt and cancellation were checked without attempting a real administrator login.

If administrator login does not reach a recognized report library, the inspection returns a diagnostic report with login response status, a restricted landing path, login-form visibility, credential/challenge/rate-limit flags, and blocked-request counts. It does not claim an unknown landing page is authenticated. Raw text and URL queries are excluded. The hidden password prompt uses standard readline editing to handle paste and cursor keys without echo.

The administrator successfully completed the initial login probe; its only management link was `/MyAccount`. The probe now opens that discovered page with GET and reports management-related paths plus a fixed allowlist of control labels such as Users and User groups. It does not report profile values or submit account forms. The account page being available is not yet proof of viewer-creation permission.

The New User page was confirmed manually at `/User?company_id=...`. Supply `DISPLAYR_INSPECTION_COMPANY_ID` to inspect that form directly after login. The probe reports form action paths, query parameter names, input names/types, and group option labels/IDs. It waits for the Save control to be visible but never clicks it. It omits all entered and hidden field values, including anti-forgery tokens. Group labels are discovery data, not proof of permissions; the provisioning worker must use explicitly verified view-only groups. A Chromium fixture test checks extraction, hidden-value exclusion and absence of form submissions.

## Verified dashboard groups and invitation preparation

On September 14, 2026, the EcoFocus administrator confirmed that Displayr company `984256` group `2954016` (2024 Dashboard) grants view-only access to the 2024 dashboard. `tools/displayr-dashboard-groups.mjs` records this mapping for portal dashboard `interactive-dashboard-2024`. Discovered 2025 and 2026 groups remain unverified and are not enabled by their names alone.

Group membership is a list: a viewer may belong to multiple dashboard groups. Resolve the union of server-authorized dashboard assignments across the user's active workspaces and deduplicate the corresponding verified groups. Every authorized member of a workspace receives its dashboard assignments through their own Displayr viewer identity. Individual user overrides remain a future release requirement. Unknown mappings stop preparation rather than silently omitting requested access. This resolver is not yet wired into signup.

`tools/displayr-invitation-form.mjs` prepares the inspected `/User/AjaxNewUser` form without submitting it. It validates company, fields and exact group choices, replaces the selected groups with the complete requested list, preserves hidden fields, and returns a sanitized draft. Browser fixture tests verify multiple groups can be selected together and removed from a subsequent prepared selection. The fixture's additional group is synthetic, not a production permission approval. No invitation has been sent by this adapter.

## Controlled invitation lookup

The administrator verified live mailbox refresh/read access and reports sending the controlled test invitation. The admin mailbox page now includes Find test invitation, backed by an administrator-only POST route with the same public-host and Origin checks as the mailbox health check. It searches only the stable alias for `displayr-provisioning-test-2024-v1`, starting September 14, 2026. It returns a count and search-completeness flag, never message IDs, contents, or activation URLs. Zero, one, multiple, and incomplete results have distinct UI messages. This is candidate discovery only; it does not authenticate an invitation or activate the account.

Validation: the route/client browser fixture, TypeScript checking, and focused ESLint pass. Live invitation discovery still needs the administrator to click the new button after deployment.
