# ADR 0003: Use Stripe Checkout and verified webhooks

**Status:** Accepted

## Context

The store needs payments without accepting card details and a trustworthy source of completed orders.

## Decision

Use Stripe-hosted Checkout and record orders only after verifying a signed `checkout.session.completed` webhook.

## Consequences

- Card data stays on Stripe's hosted page.
- The success page is not payment proof.
- Local development requires a Stripe CLI listener.
