# Displayr gateway feasibility lab

An isolated, loopback-only experiment for keeping the real Displayr viewer inside an EcoFocus page. It does **not** alter the production portal, provision Displayr accounts, implement SAML, or make a public Displayr URL private.

See [private viewer test results](PRIVATE-RESULTS.md) for successful authenticated Explore, saved-work, export and revocation checks, and [public example results](RESULTS.md) for the original transport test. Automatic viewer authentication and renewal through EcoFocus remain outstanding.

## Run

Requires Node 24 (no added packages).

```bash
node --test experiments/displayr-gateway/gateway.test.mjs
node experiments/displayr-gateway/lab.mjs
```

Open `http://127.0.0.1:4310`. Select Alice or Bob to exercise the **local test identity adapter**, private upstream cookie isolation, saved fixture state and CSV download. The identity selector is deliberately not production authentication. The support panel is a placeholder; it does not create tickets.

Run against Displayr's published public example to investigate viewer transport:

```bash
node experiments/displayr-gateway/lab.mjs --target 'https://app.displayr.com/Dashboard?id=02874c16-960c-486a-b493-3ae3e81dd8aa' --project-id 441160
```

The supplied EcoFocus dashboard link can be tested with:

```bash
node experiments/displayr-gateway/lab.mjs --target 'https://app.displayr.com/Dashboard?project_id=-1189662'
```

The dedicated test viewer could not use that link: Displayr requires write access there. Its available published viewer was **2024 Dashboard - INTERNAL USE**, with `project_id=1208434`. After obtaining an authorized test session, its successful private transport test used:

```bash
node experiments/displayr-gateway/lab.mjs --port 4340 --gateway-port 4341 --target 'https://app.displayr.com/Dashboard?project_id=1208434' --cookie-file /absolute/path/outside/repository/viewer-cookies.json
```

Use `--port 4320 --gateway-port 4321` to run a second instance. All listeners bind to `127.0.0.1`. **Do not publish this lab or forward its ports publicly:** anyone who reaches the identity selector can choose a test viewer. Its test authorization is not Supabase authorization.

The public example uses a published UUID in its URL but numeric project ID `441160` in its API calls. `--project-id` supplies that trusted server-side alias; arbitrary browser-supplied project IDs remain blocked. Obtain the matching alias from trusted dashboard configuration before testing another published UUID.

## Private upstream sessions

The gateway intentionally stops login redirects rather than displaying a Displayr login page. Silent authentication and renewal are **not implemented**. The real link provided on September 10, 2026 redirected an unauthenticated HTTP request to `/Login`; this does not by itself establish the account's publishing settings. The account owner confirmed that Enterprise SSO is **not enabled**.

Displayr's [documented SSO setup](https://help.displayr.com/hc/en-us/articles/4403876728207-How-to-Enable-Single-Sign-On-in-Displayr) requires an Enterprise account and SAML identity provider. No alternative supported silent viewer-session API has been established by this experiment. A gateway or remotely hosted browser still needs an authorized upstream identity and a working renewal mechanism.

For an authorized transport experiment, the lab can seed separately obtained viewer cookies from a private local file using `--cookie-file /absolute/path/outside/repository/viewer-cookies.json`. The file must have mode `0600` and map test identities to their own cookie arrays:

```json
{
  "alice": [{ "name": "COOKIE_NAME", "value": "REDACTED", "domain": "app.displayr.com", "path": "/", "secure": true }],
  "bob": [{ "name": "COOKIE_NAME", "value": "REDACTED", "domain": "app.displayr.com", "path": "/", "secure": true }]
}
```

This is the lab's cookie format, not an unmodified browser storage-state file. Omit `expires` for a session cookie; when supplied, it is a Unix timestamp in **milliseconds** or a date string. Do not paste credentials in chat or commit this file. Seeded cookies let us test transport only; they do not prove portal-based authentication, renewal or migration of saved Explore work. Each identity must have only its intended upstream dashboard permissions.

## Boundaries

- `lab.mjs` supplies the test identity and authorization callbacks. Production Supabase login, workspace entitlements, billing and logout are not connected.
- `gateway.mjs` issues opaque, one-use launch grants and opaque browser session cookies, holds per-session upstream cookies on the server, checks authorization on every HTTP request, and proxies a configured upstream origin.
- A separate gateway origin keeps Displayr JavaScript outside the portal's origin. Production would need separate hostnames and secure host-only cookies; the local ports are only an origin-isolation experiment.
- The gateway confines known dashboard navigation identifiers. This is **not** complete authorization for Displayr's undocumented application API payloads. Private, individually authorized Displayr identities remain necessary.
- Only explicitly configured static asset origins may be routed through the asset adapter. Unknown origins, login flows and WebSocket upgrades fail closed. Such failures are compatibility findings to investigate, not permission to turn protections off.
- Browser-supplied cookies and authorization headers are never forwarded to Displayr. Upstream session cookies are never returned to the browser.
- Request/response size limits, timeouts and disabled caching bound this experiment. In-memory grants and cookie jars are discarded at restart. It is a single-process spike, not a deployment architecture.
- Authorization is checked before requests, after upstream headers, and after buffering text. Binary downloads already streaming are not continuously rechecked. Once a session observes revocation it stays revoked; a revoke/restore cycle with no intervening request is not recorded by the boolean test adapter. Production needs explicit session invalidation or entitlement generations.
- Attachments bypass text rewriting to preserve downloaded bytes. HTML, JavaScript, CSS and other inline text responses use narrow URL rewriting; this is not a complete JavaScript parser or a guarantee that every generated URL is mediated.

## Required acceptance before production integration

1. Fresh login and session renewal happen through the EcoFocus identity, without Displayr UI, extra tabs or storage-access prompts.
2. Two users have separate Explore work, saved and restored after returning.
3. Full question selection, filters, weights, statistics and chart options work on the actual licensed dashboard.
4. Every required Excel, PowerPoint (including editable charts where currently supported) and PDF export is delivered intact.
5. All app data requests, redirects, downloads and persistent connections stay mediated.
6. Revocation blocks both existing and new sessions; login expiry and failed callbacks fail closed.
7. Copied upstream URLs require Displayr authorization, and copied gateway URLs require current portal access.
8. Browser tests cover Safari, Chrome/Edge and Firefox; support ticket workflows remain available.

The remaining identity requirement is creating and renewing authorized Displayr viewer sessions automatically from EcoFocus. Successful private transport with a seeded session does not satisfy that requirement.
