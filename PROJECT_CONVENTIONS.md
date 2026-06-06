# Project Conventions

## Routing

- Unprefixed routes are the default Turkish experience.
- Prefixed locale routes should only be generated for non-default locales such as `/en/...`.
- New marketing pages should exist in both `app/*` and `app/[locale]/*` only when that split is intentional.
- If a route lives under `app/[locale]`, prefer `getPrefixedLocaleStaticParams()` and `getPrefixedRouteLocale()` unless the default locale must also be rendered there.

## Locale and content

- Keep locale logic inside `lib/i18n.ts`, `lib/route-locale.ts`, and `lib/request-locale.ts`.
- Store page copy in typed content modules instead of hardcoding strings in route components.
- When adding localized content, update metadata and sitemap coverage in the same change.

## Server and client boundaries

- Prefer Server Components by default.
- Use Client Components only for interaction, animation state, browser APIs, or form handling that truly needs the client.
- Keep validation on both sides of trust boundaries: client for UX, server for security.

## Forms and APIs

- Validate route-handler payloads with `zod`.
- Keep contact form flows resilient in local development, but harden production paths with spam protection and rate limiting.
- Trim and bound user input before sending it to third-party services.

## Quality gates

- Run `npm run lint` and `npm run build` before shipping significant changes.
- Keep `scripts/test-smoke-routes.mjs` aligned with locale and routing updates.

## SEO and metadata

- New public routes should be added to `lib/route-metadata-content.ts` and use `createRouteMetadata`.
- Keep `app/robots.ts` and `app/sitemap.ts` in sync with public route additions.
