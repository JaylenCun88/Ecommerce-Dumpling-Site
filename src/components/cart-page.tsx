"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";

export function CartPage() {
  const { items, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  async function startCheckout() {
    setIsLoading(true); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(({ slug, quantity }) => ({ slug, quantity })) }) });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Could not begin checkout.");
      window.location.assign(result.url);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not begin checkout.");
      setIsLoading(false);
    }
  }

  if (!items.length) return <section className="mx-auto max-w-3xl px-6 py-20 text-center"><p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Your bag</p><h1 className="mt-4 text-4xl tracking-[-.06em]">Your bag is waiting.</h1><p className="mt-4 text-[#586457]">Add a few dumplings and make dinner easy.</p><Link href="/#shop" className="mt-8 inline-block bg-[#243529] px-6 py-3.5 text-sm text-white">Explore dumplings</Link></section>;

  return <section className="mx-auto max-w-4xl px-6 py-12 lg:py-20"><p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Your bag</p><h1 className="mt-4 text-4xl tracking-[-.06em]">Ready for the freezer.</h1><div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]"><div className="divide-y divide-[#d8ddd5] border-y border-[#d8ddd5]">{items.map((item) => <div key={item.slug} className="flex items-center justify-between gap-5 py-5"><div><h2 className="font-medium">{item.name}</h2><p className="mt-1 text-sm text-[#687168]">{item.packageSize} · Qty {item.quantity}</p><button onClick={() => removeItem(item.slug)} className="mt-3 border-b border-[#687168] text-xs text-[#687168]">Remove</button></div><p>{formatPrice(item.price * item.quantity)}</p></div>)}</div><aside className="h-fit bg-[#e6eee3] p-6"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><p className="mt-3 text-xs leading-5 text-[#687168]">Shipping and taxes are calculated securely at checkout.</p><button onClick={startCheckout} disabled={isLoading} className="mt-6 w-full bg-[#243529] px-5 py-3.5 text-sm text-white disabled:opacity-60">{isLoading ? "Taking you to checkout…" : "Secure checkout"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</aside></div></section>;
}
