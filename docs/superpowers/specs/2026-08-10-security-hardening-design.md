# Security Hardening Design

## Scope

Harden the existing server-side admin and API surfaces without changing any UI component, page markup, styling, or user-visible copy.

## Findings and decisions

1. The admin login route records failed attempts but does not check whether the address is already rate-limited. It will check `isAdminLoginRateLimited` before parsing credentials and return the existing generic `429` response when the limit has been reached.
2. State-changing admin content routes accept cookie-authenticated requests without an explicit origin check or payload bound. They will reject a supplied disallowed `Origin` with `403`, reject missing/non-JSON/oversized payloads with `400`/`413`, and leave their response payloads unchanged on successful requests.
3. A missing `ADMIN_SESSION_SECRET` currently allows deterministic session signatures to be generated with an empty key. Admin authentication will fail closed whenever `ADMIN_EMAIL` or `ADMIN_SESSION_SECRET` is missing or blank; login will also refuse to create a session in that state.

## Architecture

The existing `lib/server/http.ts` origin and content-length helpers will be reused by the admin routes so request-policy rules remain centralized. Admin-session configuration validation will be a small server-only helper in `lib/admin-auth.ts`. No new dependency, browser code, or data-store schema is needed.

## Error handling

Routes return generic JSON errors and `Cache-Control: no-store`; secrets, configuration values, and detailed authentication causes are never returned. The login rate limiter continues to use Redis in production and the in-memory implementation in development.

## Tests

Add route-level tests for blocked login attempts and missing session-secret handling, plus unit coverage for session verification with an empty secret. Run the focused security tests, the project linter, production dependency audit, and production build.

## Constraints

- Do not modify files under `components/`, `app/**/page.tsx`, CSS, or other UI behavior.
- Preserve existing successful API response shapes and admin form interactions.
- Keep runtime dependencies unchanged.
