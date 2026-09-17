# ADR 0004: Run quality checks in GitHub Actions

**Status:** Accepted

## Context

The project needs a repeatable gate on `main` and pull requests so formatting, lint, and production builds do not depend on one developer’s machine. Automated tests and deployments are planned later.

## Decision

Use a single GitHub Actions workflow that installs with `npm ci`, then runs Prettier, ESLint, and `next build`. Do not deploy from Actions yet. Keep CI free of live Supabase and Stripe secrets.

## Consequences

- Pull requests show a single required-style check once GitHub branch protection is enabled.
- Contributors must pass `npm run format:check`, `npm run lint`, and `npm run build` locally.
- Unit and end-to-end tests can be added as extra steps or jobs without changing the trigger model.
- Hosting (for example Vercel) remains the deployment path until a dedicated CD workflow is needed.
