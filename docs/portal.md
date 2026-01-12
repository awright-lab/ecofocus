## Portal overview
- Location: `/portal` (with subpages `/dashboard`, `/questions`, `/crosstabs`).
- Access: Supabase session required; unauthenticated users are redirected to `/login?redirect=/portal`.

## Auth
- Middleware checks Supabase session cookies using `SUPABASE_URL` + `SUPABASE_ANON_KEY`.
- All `/portal` pages and `/api/portal/*` routes enforce auth. Requests without a session receive a redirect (pages) or 401 (APIs).
- Server components also double-check session in `app/portal/layout.tsx`.

## Non-indexing
- `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` is set by middleware for `/portal` and `/api/portal/*`.
- `app/portal/layout.tsx` sets `robots` metadata to noindex/nofollow (+ googlebot equivalent).
- `app/robots.ts` disallows `/portal`.
- No portal URLs are added to the sitemap.

## APIs
- `GET /api/portal/questions/search?q=` → searches `question_lookup.question_text` (top 50).
- `POST /api/portal/crosstabs` → body `{ rowVar, colVar, filters? }`; validates vars against `question_lookup.db_column`, queries `responses_2025_all` (or falls back to `responses_2025_core`), returns counts + percents.
- Both APIs require auth and never interpolate raw column names; only allowlisted columns are used.

## Env vars (required)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used server-side for data queries; still requires user session)

## Data tables
- Uses `question_lookup` for variable allowlists and search.
- Prefers `responses_2025_all`; falls back to `responses_2025_core` if the view/table is missing.
