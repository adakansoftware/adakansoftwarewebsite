# Admin Content Management Design

## Goal

Allow Adakan administrators to add, edit, publish, and remove projects and logo works without editing source files, while preserving the visitor-facing UI exactly.

## Architecture

- Supabase Auth uses email/password sign-in for `/admin/login`.
- Supabase Postgres stores `projects` and `logo_works`; each row includes Turkish and English content, image path, visual metadata, publish state, sort order, and timestamps.
- Supabase Storage keeps project covers and logo files in a public `portfolio-assets` bucket.
- Server-only admin routes perform CRUD after checking the authenticated user. Public data loaders map published Supabase rows into the existing `getProjects` and `getLogoWorks` shapes, with the current static arrays as a fallback until Supabase is configured.

## Admin UI

- `/admin`: compact table/cards for projects and logos with add, edit, publish, and delete actions.
- `/admin/projects/new` and `/admin/logos/new`: forms for bilingual text, category, year, colour, external URL, sort order, and optional image upload.
- `/admin/projects/[id]` and `/admin/logos/[id]`: edit forms using the same components.
- The admin uses existing dark tokens, cards, buttons, inputs, focus styles, and responsive spacing; visitor pages and their animations are not changed.

## Admin Strengthening

- The panel shows totals for published, draft, and archived content.
- Projects and logo works can be searched, filtered by status, and ordered by their existing sort value.
- Image fields show a live preview before save; published records expose a visitor-page preview link.
- Delete becomes archive by default. Archived records are hidden from public data and can be restored or permanently deleted from the panel.
- Admin access is limited to an allowlist of emails configured in `ADMIN_EMAILS`; client-side sessions provide the UI state while server-side mutations validate the allowlist.

## Security

- Browser code uses only the Supabase URL and publishable key.
- CRUD and Storage write operations use authenticated Supabase sessions and RLS policies; service-role credentials remain server-only.
- Public reads are restricted to published rows. Admin write policies require an authenticated user.
- Archive and permanent-delete operations require the configured admin-email allowlist.

## Required Configuration

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS` as a comma-separated allowlist, for example `owner@example.com,editor@example.com`
- An admin email/password user created in Supabase Auth.

## Validation

- Verify unauthenticated admin routes redirect to login.
- Verify CRUD validation and image upload errors are displayed inline.
- Verify public pages render the static fallback with no Supabase configuration and render published Supabase content once configured.
- Run lint, build, and smoke routes.
