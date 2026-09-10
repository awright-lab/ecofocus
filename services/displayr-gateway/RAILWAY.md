# Railway isolated pilot

Build configuration is ready locally. No Railway deployment, GitHub push, database setup, or live portal activation is performed by these files.

## Service settings

Use the existing `displayr-gateway` service. After these files are available on the selected GitHub branch:

1. Keep **Root Directory** `/`.
2. Set **Settings → Config-as-code → Railway Config File** to `/services/displayr-gateway/railway.json`.
3. Connect the repository and select the branch containing the pilot code. Disable automatic deployment until variables are set.
4. Generate a Railway domain, targeting port `8080`. Use its HTTPS origin for `DISPLAYR_GATEWAY_PUBLIC_ORIGIN`.
5. Configure the variables below before deploying. Keep one replica and disable Serverless/sleep: sessions are currently held in process memory.

The Dockerfile installs pinned Node/Playwright and Chromium, copies only gateway code, and runs as the non-root `node` user. Its adjacent Docker ignore file excludes portal code, git history, environment files and local secrets. `/healthz` checks that both internal listeners have started; it does not claim that Displayr or portal authorization is healthy.

## Railway variables

| Name | Value |
| --- | --- |
| `PORT` | `8080` |
| `DISPLAYR_GATEWAY_PUBLIC_ORIGIN` | Exact HTTPS Railway domain origin, no path |
| `DISPLAYR_PORTAL_ORIGIN` | Exact HTTPS origin hosting the EcoFocus portal |
| `DISPLAYR_AUTHORIZATION_URL` | Portal origin + `/api/internal/displayr/authorize` |
| `DISPLAYR_CONTROL_SECRET` | Independently generated random secret, at least 32 characters; match portal setting |
| `DISPLAYR_AUTHORIZATION_SECRET` | A different random secret, at least 32 characters; match portal setting |
| `DISPLAYR_VIEWER_SECRETS_JSON` | Private runtime variable with the JSON shape below |

Viewer JSON shape (replace placeholders directly in Railway Variables, not in this file):

```json
{"viewers":{"user-arif":{"email":"DISPLAYR_TEST_VIEWER_EMAIL","password":"DISPLAYR_TEST_VIEWER_PASSWORD"}}}
```

The JSON is parsed at runtime into memory and removed from the child-process environment before Chromium starts. It is never used as a Docker build argument or written to a file. Do not enable variable sharing with unrelated services. Alternatively, the original private external secret-file provider remains supported; configure only one source.

## Portal settings

Use `portal.env.example`. For Railway, set **both** `DISPLAYR_GATEWAY_PUBLIC_ORIGIN` and `DISPLAYR_GATEWAY_CONTROL_ORIGIN` to the same generated HTTPS gateway origin. The helper automatically uses `/__control/launch` in this case. That endpoint is internet-reachable and protected by the control secret; browser Origin requests are rejected, and every accepted launch still requires live portal authorization. It is not a private cross-provider network. Other control routes and gateway diagnostics are not exposed. The actual internal listeners bind only to loopback.

Apply `docs/portal_displayr_gateway.sql` in the selected environment and deploy the portal code before enabling the pilot. Set `DISPLAYR_GATEWAY_USE_PRIVATE_TEST_COPY=true` and `DISPLAYR_GATEWAY_PILOT_USER_IDS=user-arif`; keep `DISPLAYR_GATEWAY_ENABLED=false` until setup is verified. The source workspace entitlement remains required and the existing live Displayr mapping stays unchanged.

## Acceptance and limits

Use the Railway trial for measured single-user testing; no subscription upgrade is required by this configuration. Check peak memory during sign-in and exports. The service is single-instance: restart/redeploy loses gateway sessions and requires reopening the report. In-flight browser authentication is not durable. Active session renewal, multiple real viewer isolation, cross-browser behavior and full portal login/logout flows still require verification before customer rollout.

Local checks:

```bash
docker build -f services/displayr-gateway/Dockerfile -t ecofocus-displayr-pilot:local .
npm --prefix services/displayr-gateway test
```

Verified locally September 10, 2026: Docker image builds (about 511 MB as reported by Docker), non-root container starts, health returns 200, anonymous dashboard and control requests return 401, all 37 gateway tests pass, Railway schema validation passes, and root TypeScript/targeted ESLint checks pass. Chromium loaded the live Displayr login page in a container capped at 512 MiB; the cgroup reported a peak around 513 MiB, leaving no comfortable margin. Use the trial's 1 GB allowance for initial testing. This was a login-page smoke test, not a measured full Explore/export or multi-user workload.

Railway references: [Dockerfiles](https://docs.railway.com/builds/dockerfiles), [Config as code](https://docs.railway.com/config-as-code/reference), [Health checks](https://docs.railway.com/deployments/healthchecks).
