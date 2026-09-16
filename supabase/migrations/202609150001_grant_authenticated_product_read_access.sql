-- Product listings are public: both guests (anon) and signed-in shoppers
-- need read-only access to active products.
grant usage on schema public to authenticated;
grant select on table public.products to authenticated;

create policy "Signed-in shoppers can read active products"
on public.products
for select
to authenticated
using (is_active = true);
