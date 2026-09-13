# Portal dashboard access model

Decision recorded September 13, 2026.

## Current release

Dashboard assignments belong to the company workspace. Users with full dashboard access to that workspace see the same assigned dashboards. Do not add individual dashboard grants or exclusions in this release.

Workspace membership, active user/session, subscription, and dashboard availability checks continue to apply. Sharing a workspace's dashboard assignments does not grant access to another workspace or elevate restricted support visibility.

Displayr identity is separate from dashboard assignment. Each portal user maps to a distinct Displayr viewer account; do not use one shared Displayr login for a company or for all customers. Provision each viewer with the private reports corresponding to their authorized workspace assignments. Users sign in through EcoFocus, while the gateway keeps Displayr credentials and sessions server-side.

The isolated pilot currently maps one portal user to one Displayr viewer and private test report. Multi-user provisioning and identity isolation still require verification before broader rollout.

## Future release requirement

Support different dashboard permissions for individual users within the same company workspace. This is a recorded requirement, not an implemented feature.

Retain workspace assignments as the company-level boundary. Before implementation, decide how individual restrictions or grants interact with workspace defaults, administrator roles, membership changes, and revocation. User-specific rules must be enforced in server authorization as well as dashboard listings and synchronized with Displayr viewer permissions. Adding a user rule must never grant access outside the authorized workspace.

## Related follow-up

Background gateway renewal is implemented for the isolated pilot. It revalidates the current portal session, workspace membership, and dashboard authorization every three minutes, refreshes the portal token when nearing expiry, and renews the existing gateway session through a separate iframe. The report and viewer cookie jar are preserved. Renewal is bound to the same user, workspace, dashboard, and portal login session. It cannot revive revoked or expired gateway sessions and never replays saves or exports. A suspended browser or failed authorization may still require an explicit reload. This does not implement reauthentication after Displayr itself expires its upstream session. Live long-session verification remains pending.

Account provisioning is the next work item: company signup does not yet create or map Displayr viewer accounts.
