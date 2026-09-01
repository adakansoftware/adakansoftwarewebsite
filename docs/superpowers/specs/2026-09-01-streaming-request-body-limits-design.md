# Streaming Request Body Limits Design

## Goal

Prevent oversized, chunked admin API requests from being fully buffered in memory before the configured body-size limit is enforced. The change must not alter any user interface.

## Scope

- Server-only request parsing for admin login and admin content mutations.
- Existing `8 KiB` login and `32 KiB` content limits remain unchanged.
- Existing JSON validation, status codes, and route contracts remain unchanged.
- No page, component, client-side, or CSS file changes.

## Design

Introduce a small server helper that reads a request body through its `ReadableStream` reader, counts received bytes, and cancels/rejects once the configured maximum is exceeded. It returns decoded text only when the whole body is within the limit.

Both `readAdminLoginCredentials` and `readBoundedJsonObject` will use this helper. `Content-Length` validation stays as an inexpensive early rejection; the streaming limit is the authoritative protection for missing, wrong, or chunked length headers.

## Testing

Tests will use a real `ReadableStream` request body without `Content-Length`. They will verify that an oversized stream returns `413` before all chunks are read, and that a valid JSON stream is still parsed normally. The tests will first fail with the current whole-body implementation.

## Risks and Compatibility

The helper uses standard Web `ReadableStream` and `TextDecoder` APIs available to Next.js Route Handlers. No endpoint URLs, response schemas, UI behavior, or configured size limits change.
