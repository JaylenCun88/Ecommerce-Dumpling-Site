-- The service role bypasses RLS, but Postgres still requires GRANT privileges
-- before PostgREST can read or insert rows. Without this, the Stripe webhook
-- returns 500 and no orders are recorded.
grant all on table public.orders to service_role;
grant all on table public.order_items to service_role;
grant usage, select on sequence public.orders_id_seq to service_role;
grant usage, select on sequence public.order_items_id_seq to service_role;
