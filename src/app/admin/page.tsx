import Link from "next/link";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import { formatPrice } from "@/lib/products";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPage() {
  await connection();
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: products }, { data: orders }] = await Promise.all([
    admin.from("products").select("*").order("sort_order"),
    admin
      .from("orders")
      .select("id, customer_email, amount_total, fulfillment_status, order_items(product_name, quantity)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  async function updateProduct(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = Number(formData.get("id"));
    const file = formData.get("image");
    let image_url: string | undefined;
    if (file instanceof File && file.size) {
      if (!file.type.startsWith("image/") || file.size > 5_000_000)
        throw new Error("Use an image file smaller than 5 MB.");
      const extension = file.name.split(".").pop() || "jpg";
      const path = `products/${id}-${Date.now()}.${extension}`;
      const client = createAdminClient();
      const { error: uploadError } = await client.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw new Error(uploadError.message);
      image_url = client.storage.from("product-images").getPublicUrl(path).data.publicUrl;
    }
    const changes = {
      name: String(formData.get("name")),
      price_cents: Math.round(Number(formData.get("price")) * 100),
      is_active: formData.get("is_active") === "on",
      ...(image_url ? { image_url } : {}),
    };
    const { error } = await createAdminClient().from("products").update(changes).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/");
    revalidatePath("/admin");
  }
  async function markFulfilled(formData: FormData) {
    "use server";
    await requireAdmin();
    const { error } = await createAdminClient()
      .from("orders")
      .update({ fulfillment_status: "fulfilled" })
      .eq("id", Number(formData.get("id")));
    if (error) throw new Error(error.message);
    revalidatePath("/admin");
  }
  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-6 text-[#273027]">
      <header className="mx-auto flex max-w-6xl justify-between">
        <Link href="/" className="text-xl font-semibold tracking-[-.06em]">
          morsel
        </Link>
        <p className="text-sm">Admin</p>
      </header>
      <section className="mx-auto mt-14 max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Store management</p>
        <h1 className="mt-4 text-4xl tracking-[-.06em]">Admin dashboard</h1>
        <h2 className="mt-12 text-2xl">Products</h2>
        <div className="mt-4 grid gap-4">
          {products?.map((p) => (
            <form
              key={p.id}
              action={updateProduct}
              className="grid items-end gap-3 border border-[#d8ddd5] p-4 md:grid-cols-5"
            >
              <input type="hidden" name="id" value={p.id} />
              <label className="text-sm">
                Name
                <input name="name" defaultValue={p.name} className="mt-1 w-full border p-2" />
              </label>
              <label className="text-sm">
                Price (USD)
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={(p.price_cents / 100).toFixed(2)}
                  className="mt-1 w-full border p-2"
                />
              </label>
              <label className="text-sm">
                Photo
                <input name="image" type="file" accept="image/*" className="mt-1 block w-full text-xs" />
              </label>
              <label className="flex gap-2 text-sm">
                <input name="is_active" type="checkbox" defaultChecked={p.is_active} /> Visible
              </label>
              <button className="bg-[#243529] px-4 py-2 text-sm text-white">Save</button>
            </form>
          ))}
        </div>
        <h2 className="mt-14 text-2xl">Recent orders</h2>
        <div className="mt-4 divide-y border-y">
          {orders?.length ? (
            orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-medium">
                    Order #{o.id} · {formatPrice(o.amount_total / 100)}
                  </p>
                  <p className="text-sm text-[#687168]">
                    {o.customer_email} · {o.order_items.map((i) => `${i.product_name} × ${i.quantity}`).join(", ")}
                  </p>
                </div>
                {o.fulfillment_status === "fulfilled" ? (
                  <span className="text-sm text-[#5f7b56]">Fulfilled</span>
                ) : (
                  <form action={markFulfilled}>
                    <input type="hidden" name="id" value={o.id} />
                    <button className="border border-[#243529] px-3 py-2 text-sm">Mark fulfilled</button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <p className="py-6">No orders yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
