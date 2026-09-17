# ADR 0002: Use Supabase for data, auth, and storage

**Status:** Accepted

## Context

The app needs relational data, authentication, product images, and authorization without building each service from scratch.

## Decision

Use Supabase Postgres, Auth, and Storage; manage schema changes as committed SQL migrations.

## Consequences

- Migrations are reviewable and reproducible.
- RLS and explicit PostgreSQL grants both matter when adding roles.
- Service-role credentials are server-only.
