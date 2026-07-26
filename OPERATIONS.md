# Operations Runbook

## Production contact delivery

Set a verified `RESEND_API_KEY`, `RESEND_FROM_DOMAIN`, and either
`CONTACT_ADMIN_KEY` or `CONTACT_ADMIN_SIGNING_SECRET`. Placeholder values are
rejected in production.

Use `CONTACT_STATE_BACKEND=redis` and set `REDIS_URL`. The file backend is only
for local development because it is not shared between production instances.

## Replay worker

`vercel.json` schedules `GET /api/contact/replay/cron` hourly. Set either
`CONTACT_CRON_SECRET` or Vercel's `CRON_SECRET`; Vercel sends the latter as a
Bearer token. Review `/api/health` with an admin credential for detailed queue
and worker diagnostics. Public health responses intentionally contain only a
safe readiness summary.

## Failed deliveries

Failed deliveries use exponential retry and become `dead-letter` entries after
`CONTACT_OUTBOX_MAX_ATTEMPTS` attempts. Inspect the authenticated health
diagnostics before manually resolving the upstream configuration or replaying
messages; do not edit the state store files directly.

## Verification

Before deployment run:

```sh
npm run lint
npm run build
npm run test:smoke
```
