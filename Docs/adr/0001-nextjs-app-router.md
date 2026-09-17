# ADR 0001: Use Next.js App Router

**Status:** Accepted

## Context

Morsel needs server-rendered catalog pages, secure server endpoints, and a straightforward deployment path.

## Decision

Use Next.js, TypeScript, and the App Router. Keep pages server-rendered by default and isolate interactivity in client components.

## Consequences

- Server credentials stay out of browser code.
- Contributors must understand the server/client component boundary.
