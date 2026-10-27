# PSC website recognition review

Prepared locally on October 24, 2026. Do not deploy until reviewed and explicitly approved.

## Implemented

- Homepage: PSC is enabled in the existing TrustedBy logo list alongside the six existing organizations, including the mobile ticker. Client-logo permission was explicitly confirmed by the user on October 24, 2026; `PSC_CLIENT_LOGO_APPROVED = true` in `lib/psc.ts`. The desktop grid uses seven equal columns. This is separate from membership recognition.
- Global footer: secondary membership recognition beneath EcoFocus's description, with the requested statement and a link to PSC.
- About: requested membership explanation between Who We Are and Leadership, with official artwork and a PSC link. Existing metadata remains intact.

## Artwork and guidance

The site now uses the user-supplied `public/images/logos/PSC Logo 2016 Transparent-1.png` (1000 × 323, 78.8 KB), added October 24, 2026. Its original colors, transparency, and proportions are preserved; white padding provides contrast and clear space. The compact membership placement renders it at 140 pixels wide.

Previously reviewed official full-color SVG source (replaced by the supplied PNG):
https://9191760.fs1.hubspotusercontent-na1.net/hubfs/9191760/Final%20PSC%20logo%20color%20editions_full%20%281%29%20%281%29.svg

Source: https://petsustainability.org/press/

Public guidelines require clear space, original proportions, original colors, and sharp artwork. The supplied PNG retains its original proportions, with white padding in the membership placements. No accreditation artwork is used. At the user's request, PSC matches the existing desktop client grid treatment: grayscale by default and full color on hover. The source artwork remains unchanged. Membership placements retain full color.

Brand colors reference reviewed:
https://9191760.fs1.hubspotusercontent-na1.net/hubfs/9191760/Accreditation/PSC_Branding_Colors_2020.pdf

The supplied Member Communication Kit URL, https://psc.petsustainability.org/, returned 404. The public press kit and member dashboard were available; no separate member-specific communication kit was accessible. Confirm any additional member-specific requirements before release. Public availability of the artwork does not establish permission to identify PSC as an EcoFocus client.

## Pending review

- Client-logo permission confirmed by the user on October 24, 2026; no further client-logo approval is pending.
- Confirm any additional member communication-kit requirements and membership artwork usage permission before deployment.
- Review local footer and About presentation and explicitly approve production deployment separately.

Membership does not constitute certification, accreditation, recommendation, or endorsement. The site copy only describes membership; the commercial barter arrangement is not published.

## Local validation

- `npm run lint`: passed.
- `npm run lint:strict`: passed.
- Scoped ESLint on the five changed TS/TSX files: passed.
- `npm run build`: passed. Existing environment warns that portal Supabase variables are absent; Browserslist data is old.
- `npm run typecheck` after build: passed. An earlier concurrent run encountered transient missing `.next/types` files while the build regenerated them.
- `node --test tests/*.test.mjs`: 63 passed, 9 failed (72 total). Failures are in existing portal/Displayr coverage: activation inspect, group preparation, Connect OAuth, mailbox authorization, mailbox form, new-user form, activation submission, invitation search, and password recovery. Some browser tests require a Playwright browser version absent from this environment. These failures were not fixed as part of PSC scope.
- Local production-browser checks on `/` and `/about` at 1440, 768, and 390 pixels: passed. Both pages load the membership logo and link, have no horizontal overflow, and the homepage client logo remains absent while approval is false. Screenshots captured under `/tmp/psc-*.png`.
- Production build regenerates PWA artifacts (`public/sw.js` and Workbox files) and TypeScript incremental metadata; these already had workspace changes before this task. No production deployment was performed.

Asset follow-up: switched all PSC placements to the supplied PNG and corrected intrinsic image dimensions. Earlier screenshots and full build validation used the SVG; scoped lint was rerun for the asset substitution. Client-logo approval was subsequently confirmed by the user; the homepage entry is now enabled.

Approval follow-up: enabled PSC client recognition after explicit user confirmation. Scoped ESLint and diff whitespace validation passed. Earlier browser results above describe the prior, disabled state. No deployment performed.
