# Admin Control Center Design

## Goal

Extend the existing single-admin content panel into a secure control center for portfolio content and contact-request operations without changing the public website's visual design.

## Scope

- Keep the existing signed-cookie admin session, origin checks, rate limits, and server-side payload validation.
- Add a dashboard that summarizes managed content and contact-request states.
- Persist contact submissions in Neon so an administrator can list them, update their status, and add a private note.
- Keep projects and logo works as managed content; public pages continue to use their current fallback data whenever managed content is unavailable.
- Support new, in-progress, and completed contact-request states.

## Non-goals

- No public-site layout or style changes.
- No asset-upload provider, role management, billing, or analytics integration.
- No change to contact email delivery, retry, or replay behavior.

## Architecture

The contact API will write a compact operational record to Neon after accepting a valid request. Admin-only route handlers will query and mutate those records through parameterized SQL, with the existing session and request-boundary guards. The client admin panel will use dedicated dashboard and inbox components, keeping content management isolated from contact operations.

## Data model

`contact_requests` stores the sender identity, project brief, locale, operational status, internal note, and timestamps. Personal data remains accessible only through authenticated admin routes; the public API response remains unchanged.

## Error handling and verification

Database persistence failures must not break the already accepted contact delivery flow; they are logged and exposed through admin diagnostics where appropriate. Route tests cover authentication, validation, listing, and status changes. Smoke tests cover the admin endpoints' unauthenticated boundary.
