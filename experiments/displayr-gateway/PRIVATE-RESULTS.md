# Private Displayr viewer results — September 10, 2026

The authorized private viewer renders through the local gateway. Explore table creation, a filtered and weighted crosstab, a bar visualization, saving and reopening personal work, and native Excel/PowerPoint/PDF exports have succeeded. **Full parity is not established:** broader options and two-user isolation remain unverified. The gateway uses a supplied viewer session; EcoFocus authentication and automatic upstream session renewal are not implemented.

## Scope and dashboard identity

- The user supplied a dedicated test viewer. Sign-in succeeded. No credentials, cookie values or browser storage state are included in this document.
- The originally supplied `/Dashboard?project_id=-1189662` returns a message that the account is not in a group with write access, both directly at Displayr and through the gateway. This result does not establish access to that original document.
- The account's MyReports lists **2024 Dashboard - INTERNAL USE**, with the published viewer path `/Dashboard?project_id=1208434`. The private checks below concern this published viewer.
- Its native HTML reports `canExplore=true` and `canSaveExplore=true`. An anonymous request to this published viewer returns HTTP 302 to `/Login`.
- An authenticated gateway session renders the published viewer using a private temporary cookie seed. This verifies transport with an existing Displayr session, not sign-in through EcoFocus. Enterprise SSO is not enabled.
- Testing uses one upstream viewer. Two personal test analyses were created under **Test Viewer - Exploration** and belong to that dedicated viewer. No account settings or original report publication settings were changed.

## Verified so far

| Check | Observation | Limit |
| --- | --- | --- |
| Private viewer access | Published viewer renders through the authenticated gateway; anonymous direct access redirects to login | Existing authorized session supplied manually |
| Default table | Native and gateway Gender tables both show 49% Male, 51% Female, sample 4,002 | Comparison of this table only |
| Explore table creation | Gateway **Create Table** works | Other Explore workflows remain to be exercised |
| Crosstab | Adding **Age Cohorts** as the second question produces a crosstab | Broader question and table combinations untested |
| Filtering | Applying **Northeast** gives sample 734 | Other filters and filter combinations untested |
| Weighting | Applying `weightvar` works and the table shows **Weighted data** | Broader weighted-result parity untested |
| Cell statistics | **Count** was enabled alongside **Column %** in the gateway table | Both were observed before switching to chart mode; counts have not yet been rechecked after that switch |
| Chart | **Bar Crosstab** visualization renders weighted, filtered bars through the gateway | Other visualization options untested |
| Save and rename | Final label **EcoFocus gateway test 2026-09-10** committed, with observed HTTP 200 POST responses for `SetItemState` and `SaveExploreTabs` | A plain programmatic input fill did not commit the name; native keyboard events did |
| Reopen after gateway restart | After restarting the gateway process and creating a new opaque session, the saved item reopened under its then-generated label **Gender by Age Cohorts**, preserving questions, filter, weight and chart | This restart check preceded the final rename; cell statistics were not rechecked |
| Reopen final item in fresh native context | A separate native Displayr browser context opened **EcoFocus gateway test 2026-09-10** and confirmed **Gender** / **Age Cohorts**, `weightvar`, **Northeast** checked, **Weighted data**, sample 734 and chart mode | Authorized account cookies were supplied, with no reused local storage; this is one viewer's persistence check, not silent authentication or multi-user isolation |
| Private Excel export | Selected Explore item downloaded through the gateway; valid ZIP/XML, one worksheet, 6,948 bytes; includes the saved label, Northeast/weighted/sample-734 caption and numeric chart data matching displayed percentages | One selected chart and export configuration |
| Private PowerPoint export | Selected Explore item downloaded through the gateway; valid ZIP/XML, one slide, 50,458 bytes; includes the saved label and Northeast/weighted/sample-734 caption | This export contains rendered graphics and no native PowerPoint chart parts or embedded workbooks; editable-chart parity is not established |
| Private PDF export | Selected Explore item downloaded through the gateway; strict PDF parsing succeeds, one page, 273,946 bytes; extracted chart percentages and the Northeast/weighted/sample-734 caption match the viewer | One selected chart and export configuration |
| Live gateway revocation | The authenticated private dashboard returns 200 before the lab revoke action and 403 afterward; a copied gateway URL in an anonymous context returns 401 | Lab authorization callback only; production EcoFocus entitlements are not integrated |

The native comparison item is labeled **EcoFocus gateway baseline 2026-09-10**. Both items are personal test analyses belonging to the dedicated viewer; these actions did not edit the original report publication.

Export scope was **The selected explore item**. All three browser download events reported the local gateway origin and no download failure. Temporary export files and screenshots are outside the repository in the private `/tmp/ecofocus-displayr-private` directory. The PDF percentages (54/42, 42/58, 54/46, 55/45, 63/37 by cohort) match the chart, and the Excel numeric proportions round to those values. File-format validation does not replace Office rendering checks or testing every existing export option.

After testing, the private lab process and both authenticated test browsers were closed, and the temporary cookie seed was removed. Exports, screenshots and the two personal test analyses were retained for review. Credentials were not written to the repository.

## Remaining acceptance checks

1. Recheck **Count** and **Column %** after switching back from chart mode and reopening saved work. Exercise other required statistics and chart options and compare recognizable results against the native baseline.
2. Record the saved-item route and any document identifier changes, and exercise any additional required save/reopen workflows. The gateway restart and fresh native context checks above establish persistence for this tested personal analysis, not every saved-work navigation path.
3. Expand the successful private Excel, PowerPoint and PDF tests to every required export option and existing report layout. Check Office rendering and editable charts where the native viewer supports them. The private selected-chart checks above and public examples in [RESULTS.md](RESULTS.md) are a representative sample, not complete export parity.
4. Observe Explore, save, reopen and export requests for blocked paths, unsupported methods, origin/CSRF rejection, external navigation or dependencies. Verify app data and downloads remain mediated.
5. Repeat with a second separately authorized Displayr viewer in a separate browser context. Confirm each user can save and restore their own work without exposing the other's private analyses. Two lab identities sharing one upstream account do not prove this.
6. Establish a supported way to create and renew viewer sessions through EcoFocus. Cookie seeding does not establish silent sign-in, renewal or migration of existing personal work.
7. Verify revocation and expiry with the actual portal authentication and entitlements once integrated, and complete the required Firefox, Safari and Chrome/Edge coverage. The present lab does not provide those production integrations or the actual support workflow.

## Cookie adapter and transport caveats

- The private file must map lab identities to cookie arrays; an unmodified browser storage-state file is not accepted. Use a private local file with mode `0600`, outside the repository, as described in [README.md](README.md#private-upstream-sessions).
- Cookie expiry values are Unix timestamps in **milliseconds**, or date strings. Browser exports commonly use seconds: convert positive second timestamps to milliseconds. Omit `expires` for session cookies, including browser exports that represent session expiry as `-1`; otherwise those cookies are treated as expired.
- The lab reads the cookie file at startup and copies the original seed into each new gateway session. Updating the file requires restarting the lab. Upstream cookie rotations are retained only in that gateway session's in-memory jar and are not copied into later launches. This can affect reopen testing independently of saved-analysis persistence.
- Use separate browser contexts for independent viewers and concurrent lab instances. Cookies are scoped to the hostname, not its port; fixed lab/gateway cookie names on `127.0.0.1` collide across port pairs. Switching the lab identity in one context can also change the gateway identity used by already open frames.
- Trusted document aliases authorize recognized API selectors, but `/Dashboard` navigation must retain the configured dashboard selectors exactly. A saved analysis that opens another project ID, or changes from a numeric project selector to a UUID selector, may be rejected even when an API alias is configured. Capture the route and verify the authorization relationship before changing this restriction.
- The gateway accepts only GET, HEAD and POST. Account and `/Edit` routes are blocked. It forwards the viewer's exact `X-Requested-With: XMLHttpRequest` marker, but not arbitrary custom headers; POST retains the gateway Origin. Save failures involving another method, custom CSRF headers or these paths must be recorded as compatibility findings.
- Gateway sessions expire after a fixed 15 minutes. Requests have a 30-second upstream timeout, a 2 MiB request-body limit and a 128 MiB binary-response limit. Distinguish gateway HTTP 401 expiry from an upstream authentication-required response, and distinguish size/time limits from application failures.
- WebSockets and service workers remain unsupported. Known selector checks do not provide complete document authorization for undocumented or opaque API payloads; each upstream viewer still needs its intended Displayr permissions.

These private transport and Explore checks used the existing gateway implementation; no compatibility code changes were needed for the tested private flow. This does not establish full Explore/export parity or completion of production integration.
