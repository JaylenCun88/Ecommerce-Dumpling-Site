import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return fallback;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    const message = errorMessage(error, "Invalid webhook signature.");
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid" || !session.customer_details?.email || session.amount_total === null) {
      return NextResponse.json({ error: "Checkout session is incomplete." }, { status: 400 });
    }
    const admin = createAdminClient();
    const { data: existing, error: lookupError } = await admin.from("orders").select("id").eq("stripe_checkout_session_id", session.id).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return NextResponse.json({ received: true, duplicate: true });

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const { data: order, error: orderError } = await admin.from("orders").insert({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
      user_id: session.metadata?.user_id ?? null,
      customer_email: session.customer_details.email,
      customer_name: session.customer_details.name,
      shipping_address: session.collected_information?.shipping_details?.address ?? null,
      amount_total: session.amount_total,
      currency: session.currency ?? "usd",
      status: "paid",
    }).select("id").single();
    if (orderError) throw orderError;

    const items = lineItems.data.map((item) => {
      const productName = item.description ?? "Morsel dumplings";
      return { order_id: order.id, product_name: productName, product_slug: productName.toLowerCase().replaceAll(" ", "-"), unit_amount: item.price?.unit_amount ?? 0, quantity: item.quantity ?? 1 };
    });
    if (items.length) {
      const { error: itemsError } = await admin.from("order_items").insert(items);
      if (itemsError) throw itemsError;
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = errorMessage(error, "Could not record order.");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
