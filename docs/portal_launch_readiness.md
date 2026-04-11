# EcoFocus Portal Launch Readiness

Use this checklist before moving from friendly/internal portal testing to paid seat licensing.

## Already Confirmed

- Supabase SQL migrations have been applied in the target project.
- `npm run build` completes successfully locally.
- Portal authentication, support, dashboard access, admin workspace management, and billing routes are present in the app.

## Friendly Testing Checklist

- Create a new client workspace from the EcoFocus admin workspace.
- Add billing contact details, seat count, renewal date, and dashboard entitlements.
- Assign at least one company-specific Displayr dashboard URL.
- Invite a client admin and a client user.
- Confirm invited users can set a password, log in, log out, and reset a password from EcoFocus-branded email.
- Confirm client users only see client-facing dashboard/support/account navigation.
- Confirm EcoFocus support admins can access all dashboards through the internal dashboard library without counting against client usage.
- Confirm client dashboard views log usage against the client company.
- Confirm EcoFocus support/admin views do not count against client usage.
- Create a support ticket with and without an attachment.
- Reply to the ticket from the admin inbox and confirm the client sees the reply.
- Adjust purchased/used seats and confirm invite limits behave as expected.
- Export or review audit/usage records for the test workspace.

## Billing And Provisioning Checklist

- Confirm `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set in production.
- Send Stripe test webhook events for checkout completion and invoice status changes.
- Confirm checkout provisioning creates or updates the portal company, subscription, user, and dashboard config.
- Confirm invoice events update `portal_subscriptions.billing_status` and latest invoice fields.
- Confirm Stripe subscription created/updated/deleted events update the portal subscription status and billing status.
- Confirm failed webhook processing returns a non-2xx response so Stripe can retry.
- Confirm billing recovery controls can correct Stripe customer/subscription IDs, billing contact details, subscription status, billing status, and renewal date after a partial failure.

## Displayr Public URL Controls

- Use company-specific Displayr publish URLs for each client dashboard.
- Rotate any dashboard URL if exposure is suspected.
- Add visible dashboard watermarks in Displayr where practical.
- Treat public Displayr URLs as bearer links: portal controls access and auditability, but cannot fully protect a copied public URL once a technical user extracts it.

## Sell-Ready Recommendation

Start with internal and friendly-client testing first. Move to paid seat licensing after the checklist above passes against production Supabase, production email sending, and Stripe test mode end-to-end.
