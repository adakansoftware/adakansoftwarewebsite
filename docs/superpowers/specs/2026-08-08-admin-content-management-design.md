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

## Security

- Browser code uses only the Supabase URL and publishable key.
- CRUD and Storage write operations use authenticated Supabase sessions and RLS policies; service-role credentials remain server-only.
- Public reads are restricted to published rows. Admin write policies require an authenticated user.

## Required Configuration

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- An admin email/password user created in Supabase Auth.

## Validation

- Verify unauthenticated admin routes redirect to login.
- Verify CRUD validation and image upload errors are displayed inline.
- Verify public pages render the static fallback with no Supabase configuration and render published Supabase content once configured.
- Run lint, build, and smoke routes.
