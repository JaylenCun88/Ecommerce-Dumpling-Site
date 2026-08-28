-- Supabase's publishable key queries as the anonymous role until a user signs in.
-- RLS decides WHICH rows are visible; this grant allows that role to query the table at all.
grant usage on schema public to anon;
grant select on table public.products to anon;
