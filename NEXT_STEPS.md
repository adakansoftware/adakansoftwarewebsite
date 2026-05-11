# Next Steps

## High Priority

1. Migrate i18n routing to a real locale segment architecture
- Move from duplicated `app/*` and `app/en/*` pages to a shared `app/[locale]/...` structure.
- Set `html lang` dynamically from the active locale.
- Centralize locale-specific metadata, navigation labels, and static page copy behind a typed locale layer.

2. Finish metadata and boundary rollout
- Push the new `loading`, `error`, `not-found`, `robots`, `sitemap`, and metadata helper changes.
- Verify all routes export correct localized metadata.
- Add route-specific titles/descriptions for any remaining pages if new routes are introduced.

3. Normalize content encoding
- Fix mojibake / broken Turkish characters in legacy text content.
- Ensure all content files are saved and rendered consistently as UTF-8.

## Architecture

4. Introduce domain-oriented content modules
- Split large content maps into focused modules such as `lib/content/home.ts`, `lib/content/legal.ts`, `lib/content/marketing.ts`.
- Keep UI composition separate from content definitions and route wiring.

5. Reduce client component surface further
- Audit `Navbar`, `Footer`, and homepage motion sections for pieces that can be split into server wrappers plus smaller client islands.
- Keep animation logic client-side only where interaction or scroll state is actually needed.

6. Add route groups and shared page shells
- Consider route groups for marketing/legal pages.
- Extract reusable static section shells for legal, blog, and careers pages to avoid drift.

## Performance

7. Optimize animated background strategy
- Consider dynamic import or viewport-aware throttling for the canvas background.
- Profile mobile GPU cost and reduce particle work when offscreen or under constrained devices.

8. Optimize image and asset strategy
- Audit logo and future media assets for exact sizing, format choice, and preload rules.
- Add blur/data placeholder strategy only if future real imagery is introduced.

9. Add better cache strategy documentation
- Define which routes are fully static, which can be ISR later, and where revalidation would live once CMS/data enters the system.

## UX / Accessibility

10. Improve global accessibility pass
- Review heading hierarchy page by page.
- Check focus order and visible focus states for mobile menu, language switcher, CTA buttons, and floating actions.
- Add any missing `aria-label` / landmark improvements where needed.

11. Review motion accessibility policy
- Decide final brand policy for `prefers-reduced-motion`.
- Keep premium feel while still offering a reduced-motion mode for users who need it.

12. Refine legal / empty-state page UX
- Blog and careers currently act as premium placeholder pages.
- Decide whether to keep them as lead-gen placeholders or convert them into structured content modules.

## Security / Hardening

13. Prepare server action / form layer properly
- When a real contact form is added, use `zod` validation, server actions or route handlers, rate limiting, spam protection, and output sanitization.
- Avoid client-only submission logic.

14. Prepare data layer standards before Prisma integration
- If PostgreSQL/Prisma is added, define repository boundaries, schema ownership, DTO validation, and caching rules before coding features.

15. Add headers / platform hardening later
- If deployment stack allows, add CSP, security headers, and image/domain policy review.

## Dev Experience

16. Add project conventions doc
- Document route strategy, locale strategy, content ownership, animation rules, and server/client boundaries.

17. Add lightweight quality gates
- Consider a small CI pipeline for `lint` + `build`.
- Optionally add bundle inspection and Lighthouse checks later.

## Current State Before Continuing

- UI direction should remain intact.
- Focus on architecture, performance, SEO, resilience, and maintainability.
- Avoid visual simplification unless a bug forces a targeted UI adjustment.
