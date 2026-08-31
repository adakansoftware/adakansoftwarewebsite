# Server Performance Without UI Changes

## Goal

Reduce repeated public-page database work without changing any visitor-visible UI, route, copy, image, or animation behavior.

## Constraints

- Do not edit animation components, Framer Motion usage, timers, scroll handlers, pointer handlers, styles, or UI copy.
- Keep the current route URLs, locale behavior, and content-management refresh behavior.
- Make no change to API authorization, validation, or response contracts.

## Design

Public projects and logo-work reads are shared content, but the root layout reads request headers for locale. That makes those routes dynamic, so route-level `revalidate` does not prevent the direct Neon calls from recurring. Cache the two server-side content reads with Next's `unstable_cache` for 60 seconds and assign one cache tag per content kind.

The existing admin content mutations will invalidate both the relevant route paths and the corresponding data cache tag. Thus an admin update is immediately eligible to populate fresh public content without waiting for the 60-second cache window.

The projects page will start its independent projects and logo-work reads together with `Promise.all`. It keeps the same rendered data and component tree while eliminating its avoidable sequential wait.

## Verification

- Unit-test the cache-tag contract.
- Run the existing security and SEO test suites, lint, production build, and route smoke tests.
- Inspect the final diff to confirm animation and UI files are absent.
