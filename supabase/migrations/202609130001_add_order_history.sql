alter table public.orders add column user_id uuid references auth.users(id) on delete set null;
create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
grant usage on schema public to authenticated;
grant select on public.orders to authenticated;
grant select on public.order_items to authenticated;
create policy "Customers can view their own orders" on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy "Customers can view their own order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = (select auth.uid())));
