"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "./cart-provider";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return <button onClick={() => { addItem(product); setAdded(true); }} className="bg-[#243529] px-6 py-4 text-sm text-white transition hover:bg-[#415949]">{added ? "Added to bag ✓" : `Add to bag — ${formatPrice(product.price)}`}</button>;
}
