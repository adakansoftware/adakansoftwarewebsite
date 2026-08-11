# Security hardening audit design

## Goal

Audit the application for exploitable endpoint, middleware/proxy, configuration,
and dependency weaknesses. Correct only verified risks while preserving the
current public routes and operational workflows.

## Scope

- Inventory every App Router endpoint and its supported methods.
- Verify authentication, authorization, origin/CSRF protections, validation,
  rate limits, response cache directives, and error disclosure.
- Verify middleware matching, locale forwarding, trusted-client-IP handling,
  and API burst protection.
- Review security headers and production configuration.
- Audit production dependencies and run the existing automated checks.

## Approach

1. Establish a baseline with repository status, build/test output, route
   inventory, and dependency audit results.
2. Trace each confirmed finding to its source, compare it with protected
   routes, and add a focused failing regression test.
3. Apply the smallest fix that closes the root cause and preserves the public
   API contract.
4. Re-run the focused test, then project-wide lint, build, and smoke checks.

## Boundaries

- No new external API proxy is introduced: the current application is
  self-contained and has no configured upstream application service.
- Secrets are not added to source control, logged, or exposed through health
  diagnostics.
- Operational cron and contact delivery behavior remain compatible with Vercel
  Cron and the existing worker script.

## Success criteria

- No known high-severity production dependency vulnerabilities remain.
- Every sensitive endpoint enforces its intended authorization and request
  constraints.
- Middleware does not bypass API protections or route a request to an
  unintended locale/handler.
- The relevant regression tests, lint, production build, and smoke tests pass.
