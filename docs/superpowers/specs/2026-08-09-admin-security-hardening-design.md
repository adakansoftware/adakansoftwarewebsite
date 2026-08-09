# Admin security hardening design

## Goal

Harden the admin and managed-content backend without changing any visible page, component, route, or styling.

## Scope

- Admin session cookies expire eight hours after successful login.
- Failed admin login attempts are limited per trusted client IP. A successful login clears that IP's failed-attempt record.
- Managed project links accept only site-relative paths or absolute HTTPS URLs.
- A managed-content database failure continues to serve the current static fallback, while recording the failure and exposing a non-sensitive content-source state to authorized health diagnostics.
- Tests cover session expiry configuration, login limiting, project-link validation, and managed-content fallback diagnostics.

## Design

### Session

The existing signed cookie format and admin API paths remain unchanged. Login sets a `maxAge` of eight hours. Logout continues to clear the same cookie. No client-side UI changes are needed.

### Login throttling

A server-side, in-memory IP-keyed limiter is added alongside the existing proxy burst limiter. It tracks failed admin login attempts within a fixed window and returns the existing generic unauthorized response when limited, so it does not disclose whether an account exists. The limiter uses `getTrustedClientIp` so production trusts Vercel's forwarded-IP header. Successful authentication clears the matching record.

### Content URL validation

`parseContentPayload` validates project `href` values with a dedicated parser. Valid values are either a relative site path beginning with one slash (but not protocol-relative `//`) or an absolute `https:` URL. Any other scheme, including `javascript:`, is rejected before persistence. Image validation remains HTTPS-only.

### Content source diagnostics

Managed content retains static fallback behavior when the database is unavailable or returns no published rows. The data-access layer records a small in-process status object that distinguishes managed, fallback-empty, and fallback-error states without retaining database error details. The public health response remains minimal; authorized health diagnostics include the source state.

## Error handling

- Invalid project links return the current 400 validation response.
- Rate-limited login uses the same 401 payload as invalid credentials.
- Database failures do not alter page rendering; they update the diagnostic state and are logged server-side.

## Verification

- Add focused unit tests for project-link rules and the login limiter.
- Extend route smoke coverage for unauthenticated admin session and login throttling behavior.
- Run lint, TypeScript checking, the focused tests, smoke tests, and production build.

## Non-goals

- No visual or interaction changes to public pages or the admin panel.
- No database schema migration.
- No replacement of the existing single-admin authentication model.
