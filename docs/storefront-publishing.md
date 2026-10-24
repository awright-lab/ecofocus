# Report storefront and Payload publishing

Implementation spans this website and the local checkout of `awright-lab/ecofocus-cms` at `/workspaces/ecofocus-cms`. CMS commit `6a965b250b58f3ffc7735519e11891e8975e03f0` is deployed on Render. The website storefront is maintained in `awright-lab/ecofocus` and deployed separately on Netlify. No Stripe products or paid reports were created during development.

## Editor workflow

1. Open Payload → Store → Reports → Create (also available as Add a Report on the dashboard).
2. Enter title, unique lowercase slug, description, year, report type, and optional detailed overview, topic, tags, page count and sample URL.
3. Upload a cover to public Media.
4. For a paid report, choose Premium, enter a USD price of at least $0.50 (at most two decimals), and upload its PDF or ZIP to private Report Files. For a free report, choose Free and supply its public download URL.
5. Save Draft while preparing. Publish to synchronize the product with Stripe and make it appear at `/reports`. Stripe IDs and last sync time appear in the sidebar automatically. Stripe errors prevent publication and display an explanation.
6. Later price changes create/reuse a matching Stripe Price; previous prices remain available for existing orders. The website rejects carts containing prices that are no longer current. Saving a draft does not change the published Stripe price.

USD and one-time payments are supported in this first implementation. Report licensing and tax treatment should be specified in the product copy before launch. Automatic tax is not configured here. Verified buyers download from their private order confirmation link; sharing that link shares download access. Transactional report emails use Resend, send only after confirmed payment, and include this same private order link. The confirmation page reports email success only after the provider accepts the message. Refund-based revocation and customer account libraries are future work.

## Cloudflare storage provisioned

The connected EcoFocus Cloudflare account now contains `ecofocus-reports-private`, separate from the existing `ecofocus-media` bucket. Cloudflare API checks confirmed that its r2.dev public endpoint is disabled and that it has no custom domains attached. No report files have been uploaded.

CMS configuration values:

```text
REPORTS_S3_BUCKET=ecofocus-reports-private
S3_ENDPOINT=https://ad2a08f58d550b78a54ff618b8db6537.r2.cloudflarestorage.com
S3_REGION=auto
```

[Open the private bucket in Cloudflare](https://dash.cloudflare.com/ad2a08f58d550b78a54ff618b8db6537/r2/default/buckets/ecofocus-reports-private).

The existing CMS S3 credentials still need to be checked for access to this new bucket. These nonsecret values have been recorded here; they have not been applied to the deployed CMS. Cloudflare plugin access does not itself configure the CMS hosting environment.

## Confirmed Render deployment

The `ecofocus-cms` service is live at https://ecofocus-cms.onrender.com on commit `6a965b250b58f3ffc7735519e11891e8975e03f0`. Its build command already runs `npm run payload:migrate` before building. Read-only database checks confirmed that migration `20261023_200440_storefront` completed in batch 11 and that `reports`, `report_files`, and `_reports_v` exist. No manual rerun of this migration is needed.

## Deployment configuration

CMS:

- `STRIPE_SECRET_KEY`: secret from the same Stripe account and mode as the website. Use a test key during acceptance testing.
- `REPORTS_S3_BUCKET`: a **separate private** S3/R2 bucket, without a public domain or anonymous read access. Uploads are blocked if this is absent or matches the public media bucket.
- Existing `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`: credentials must have access to both buckets. Paid files use Payload's authenticated file handler. Do not set `disablePayloadAccessControl` for Report Files.
- Run the scoped `20261023_200440_storefront` migration with the CMS's normal migration command. It adds reports, draft versions, protected files, document lock relationships and user API key fields. The migration was tested up/down against PostgreSQL via PGlite, not the production database. Take the normal database backup before a production migration.
- Create a dedicated CMS editor user, enable its API key through Users, and store that key only on the website server. Use the built-in Users API key, not the older custom ApiKeys collection.

Website:

- `PAYLOAD_BASE_URL`: deployed CMS origin (falls back to `NEXT_PUBLIC_CMS_URL`).
- `REPORTS_API_KEY`: dedicated CMS user API key; required for paid file fulfillment. Never expose it as a NEXT_PUBLIC variable.
- `STRIPE_SECRET_KEY`: same account and mode as the CMS.
- `RESEND_API_KEY`: the existing Resend credential used for transactional mail.
- `REPORTS_FROM_EMAIL`: a verified Resend sender for report orders; falls back to existing `PORTAL_FROM_EMAIL`. Set this only on the website server.
- `REPORTS_BACKEND=payload` (default). Mock data requires explicit `REPORTS_BACKEND=mock` and is unavailable in production. CMS errors never substitute sample products.

Deploy CMS and run its migration before deploying the website. Public cover images remain in Media. Paid report files must never be uploaded to the existing public media bucket.

## Acceptance checks

- Publish a test-mode report in Payload; confirm one Stripe product and one correct USD price. Republish and confirm no duplicate product/price. Change price and confirm the new price without changing the original.
- Confirm drafts and private file metadata are inaccessible anonymously, and direct bucket URLs deny anonymous reads.
- Browse `/reports` on desktop/mobile, follow its slug detail link, add to cart, reload and purchase with a Stripe test card.
- Confirm the paid order page provides a working PDF/ZIP download. An unpaid session and a report outside the purchased order must fail.
- Test Stripe failure during publish, unavailable catalog, outdated cart price, and canceled checkout.

Automated checks: website `node --test tests/report-store.test.mjs`; CMS `node --test tests/report-stripe.test.mjs`; both repositories `npx tsc --noEmit`. Browser fixtures verify the application against a local CMS-shaped response; they do not prove live CMS, bucket or Stripe connectivity.


## Order confirmation and email delivery

The confirmation page shows payment status, the actual amount paid, an order reference, purchased report covers/formats, and short download buttons. It removes only the purchased cart quantities, once per order, so revisiting an old order does not clear new purchases.

The Stripe webhook sends the private order link to the email address recorded at checkout on `checkout.session.completed` (when paid) and `checkout.session.async_payment_succeeded`. Enable these events for the website webhook endpoint `/api/stripe/webhook`. Pending payments do not send a download email.

The confirmation page also requests delivery through `/api/reports/order-email`, allowing delivery when a webhook is delayed or missed. This endpoint accepts only the order session token; a caller cannot choose an email recipient. Resend's idempotency key prevents duplicate requests during concurrent delivery, and Stripe session metadata records accepted sends for later visits. If the provider rejects a request, the page keeps its download buttons, explains the email failure, and offers a retry.

Use the checkout email's inbox (including spam) to confirm final delivery. Provider acceptance is not a guarantee that the recipient's mail server accepted or displayed the message.


## Pending payments and return URLs

A completed checkout is not sufficient proof of payment. The website checks Stripe's payment status before allowing downloads, clearing purchased cart items, or sending the download email. Pending payments show a processing page with an order reference, automatic checks every five seconds for one visible minute, a manual check button, and a private-link copy button. Failed, expired, and incomplete checkouts show separate messages. API/verification errors are not treated as pending payments.

Production checkout return URLs and email links default to `https://ecofocusresearch.com`, regardless of Netlify's internal request hostname. Existing order links on `*.netlify.app` redirect to the primary report origin with their session token preserved. Optional `REPORTS_SITE_URL` overrides the report origin for a deliberately configured HTTPS preview environment; it is separate from portal/site settings.
