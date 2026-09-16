import { NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/product-repository";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type CheckoutItem = { slug: string; quantity: number };

export async function POST(request: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured yet." }, { status: 503 });

  const body = await request.json() as { items?: CheckoutItem[] };
  if (!Array.isArray(body.items) || body.items.length === 0) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  if (body.items.length > 100 || body.items.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20)) {
    return NextResponse.json({ error: "One or more quantities are invalid." }, { status: 400 });
  }

  try {
    const products = await getStoreProducts();
    const productsBySlug = new Map(products.map((product) => [product.slug, product]));
    const lineItems = body.items.map((item) => {
      const product = productsBySlug.get(item.slug);
      if (!product) throw new Error(`Unknown product: ${item.slug}`);
      return { price_data: { currency: "usd", product_data: { name: product.name, description: product.packageSize }, unit_amount: Math.round(product.price * 100) }, quantity: item.quantity };
    });
    const origin = new URL(request.url).origin;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      metadata: { store: "morsel", ...(user ? { user_id: user.id } : {}) },
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
