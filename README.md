# Morsel

Morsel is a learning-focused ecommerce storefront for dumpling traditions from around the world, built with Next.js, Supabase, and Stripe.

## Capabilities

- Product catalog, details, responsive cart, and optimized product images
- Supabase Postgres, Auth, and Storage
- Stripe Checkout with verified webhook order recording
- Magic-link accounts, order history, and protected admin controls

## Local setup

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and set Supabase and Stripe values.
3. Apply migrations through the project's Supabase workflow.
4. Run `npm run dev`.

For local payment tests, run:

```powershell
stripe listen --events checkout.session.completed --forward-to http://localhost:3000/api/stripe/webhook
```

## Quality checks

Run the same gates GitHub Actions uses on pull requests and pushes to `main`:

```powershell
npm run format:check
npm run lint
npm run build
```

- Prettier enforces wrapping and layout (`npm run format` to apply it).
- ESLint (`eslint-config-next`) catches unused code, React/Next issues, and TypeScript problems.
- `next build` type-checks and compiles the App Router without talking to Supabase or Stripe.

This is CI only. Preview/production deploys stay with the host (typically Vercel for Next.js) until a dedicated CD workflow is added. After the first successful run, mark **Quality checks** as required in GitHub branch protection on `main`.

## Documentation

- [Backlog](./backlog.md)
- [ADRs](./Docs/adr/README.md)
- [Wiki starter](./Docs/wiki/Home.md)
