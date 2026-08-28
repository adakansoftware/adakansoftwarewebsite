# Technical SEO Strengthening Design

## Goal

Improve organic-search discovery for Adakan Software without modifying any visual UI, page layout, or customer-facing component styling.

## Scope

- Keep the existing Turkish default routes and English `/en` routes as the canonical public URL model.
- Establish one typed source of truth for indexable routes and their SEO attributes.
- Generate sitemap, `llms.txt`, metadata alternates, and page-level structured data from that source.
- Add truthful, visible-content-aligned structured data only. Do not invent reviews, ratings, physical street addresses, awards, or offers.
- Add executable regression checks for technical SEO outputs.

## Architecture

`lib/public-routes.ts` will own each public route's path, metadata key, sitemap priority/frequency, and AI-index eligibility. Existing metadata generation will continue to create canonical and language alternate metadata, now consuming the shared route model where relevant. `app/sitemap.ts` and `app/llms.txt/route.ts` will use the route model rather than independent arrays.

Site-wide JSON-LD remains emitted from the root layout. A small, server-rendered route schema component will emit `WebPage` and `BreadcrumbList` on public routes, with a genuine `Service`/`OfferCatalog` only on pages whose existing content supports it. This change does not alter rendered visual markup.

## Data Flow

1. A route descriptor defines its stable public path and search attributes.
2. Metadata receives the locale and descriptor path to produce self-referencing canonical URLs and `tr-TR`, `en-US`, and `x-default` alternates.
3. Sitemap emits both localized canonical variants with the same alternate set and a deterministic `lastModified` timestamp based on source-control build information when available.
4. `llms.txt` lists the indexable canonical Turkish routes and states the English route pattern.
5. JSON-LD uses the current locale and public route to generate valid absolute IDs and URLs.

## Crawl and Indexing Rules

- Public marketing pages are indexable and included in the sitemap.
- `/admin/` and `/api/` are disallowed in `robots.txt`; admin pages retain `noindex, nofollow` metadata.
- `robots.txt` permits all other crawlers, including AI search crawlers, without special blanket blocks.
- Legal and empty-content pages remain indexable only if they are explicitly public and listed in the shared route inventory.

## Testing and Verification

- Node test coverage will assert public-route uniqueness, locale URL construction, sitemap alternate completeness, robots policy, `llms.txt` route inclusion, and JSON-LD shape.
- Each production change begins with a failing test, then the smallest implementation required to pass it.
- Each independently reviewable SEO layer is committed separately.
- Final verification runs lint, SEO tests, the existing smoke routes, and a production build.

## Non-goals

- No visual/UI, page-copy, styling, or component hierarchy changes.
- No new marketing pages or blog articles.
- No unverifiable performance, ranking, traffic, or rich-result guarantees.
