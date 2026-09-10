# Observed results — September 10, 2026

This records the initial public-example test. A subsequent authorized viewer test verified private Explore, saved-work persistence and exports; see [PRIVATE-RESULTS.md](PRIVATE-RESULTS.md) for the current findings and remaining limitations.

The public Displayr viewer works through this gateway, including a recalculating selection control and native Excel, PowerPoint and PDF downloads. **The required private EcoFocus experience is not yet proven:** silent authentication, full Explore and saved personal work remain untested.

## Scope

- Local Node 24 lab in Chromium 153, using test identities Alice and Bob. No production portal routes, Supabase configuration, support tickets or Displayr account settings were changed.
- Real Displayr example: [Reach Simulator](https://app.displayr.com/Dashboard?id=02874c16-960c-486a-b493-3ae3e81dd8aa), trusted internal project ID `441160`.
- User-supplied test link: `https://app.displayr.com/Dashboard?project_id=-1189662`. An anonymous request redirected to Displayr login; the gateway displayed a controlled authentication-required message inside the lab. This is not successful authentication and does not establish whether a separate published URL is public.
- The account owner confirmed Enterprise SSO is not enabled. No Displayr credentials or authenticated viewer session were available for private testing.

## Verified

| Check | Evidence | Limit |
| --- | --- | --- |
| Real viewer embedded in the lab | Toolbar, report images and Venn chart render through the gateway | Public example only; separate lab shell, not production EcoFocus authentication |
| Interactive recalculation | Ctrl-clicking Grape changes Reach from 92% to 86% | A published selection control, not Explore mode |
| Native Excel export | `Reach Simulator.xlsx`, 23,985 bytes, valid ZIP, all XML parses, one worksheet | Default export options; no Office visual comparison |
| Native PowerPoint export | `Reach Simulator.pptx`, 297,290 bytes, valid ZIP, all XML parses, one slide | Default export options; editable-chart parity not established |
| Native PDF export | `Reach Simulator.pdf`, 855,243 bytes; strict PDF parsing succeeds, one page, expected report text extracted | Default export options; no full visual comparison |
| Private local fixture | Alice's save action and CSV download work in the browser; revoke control removes the viewer | Synthetic upstream, not Displayr Explore |
| Gateway regressions | 28 tests pass; covers one-use grants, separate cookie jars, expiration, observed revocation, trusted project aliases, rejected destinations, CSP, binary/text attachments and authorization during buffering | Local HTTP fixtures; not a production security audit |

The browser stayed on the local EcoFocus lab while the real exports were generated and downloaded. Files were checked in `/tmp` and are not committed. The rendered public viewer screenshot is `/tmp/ef-gateway-public.png` for this workspace session.

## Compatibility changes supported by the live test

- Route Displayr's observed application CDN, image CDN and widget CDN through fixed asset adapters without viewer cookies.
- Rewrite root-relative CDN module imports and CSS resources while retaining document-relative API requests.
- Accommodate the observed 17,337,844-byte JavaScript module with a 24 MiB text-response limit.
- Map the published UUID to its trusted numeric API project ID. Unknown browser-supplied project IDs still fail.
- Preserve the viewer's exact `X-Requested-With: XMLHttpRequest` header. Displayr's data request returned HTTP 400 before this fix and succeeded afterward. The gateway's POST Origin policy was unchanged.
- Preserve native export forms' same-origin referrer behavior and attachment bytes.

Some telemetry and Flagsmith feature-flag requests remain blocked by the restrictive CSP, producing console errors. The tested chart and exports worked despite those errors; this does not establish that every dashboard can function without these dependencies. WebSockets and service workers are not supported.

## Remaining acceptance work

1. Securely supply an authorized dedicated test viewer session for the supplied dashboard using the private local cookie adapter described in [README.md](README.md#private-upstream-sessions). This enables a transport test only; it does not solve automatic customer sign-in.
2. Verify full Explore, saving and restoring analyses, two independent users, and every required export option on that dashboard. The public example has `canExplore=false` and `canSaveExplore=false`; several other checked Displayr gallery examples also disable them. [Displayr's Explore documentation](https://help.displayr.com/hc/en-us/articles/360004043956-How-to-Use-Explore-Mode) describes the separate publishing and viewer permissions involved.
3. Establish supported viewer-session creation and renewal. [Displayr's documented SSO setup](https://help.displayr.com/hc/en-us/articles/4403876728207-How-to-Enable-Single-Sign-On-in-Displayr) uses Enterprise SAML. This experiment has not established an alternative supported silent session API. A remotely hosted browser would still need authentication and renewal.
4. Integrate real EcoFocus authentication and dashboard entitlements, explicit session invalidation, separate production hostnames, persistent session storage, and the actual support workflow. Check Firefox and Safari as well as Chromium.
5. Verify the **published** Displayr origin itself requires authorization. A gateway cannot make an otherwise public upstream dashboard private. Known request-selector checks are not complete authorization for Displayr's undocumented APIs; each upstream viewer must have only its intended permissions.

Binary downloads already streaming are not stopped mid-transfer by an entitlement change. The boolean lab adapter records revocation only when a request observes denied access; production needs explicit invalidation or entitlement generations. These limits are described in [README.md](README.md#boundaries).

## Reproduce

Run the public-example command in [README.md](README.md#run), choose Alice, wait for the chart to load, and Ctrl-click a selected flavor while leaving at least two selected. Use the viewer's download icon to export Excel, PowerPoint and PDF with the default options. A successful public run does not satisfy the private-session acceptance checks above.
