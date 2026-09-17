"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CartButton() {
  const { itemCount } = useCart();
  return (
    <Link href="/cart" aria-label={`Shopping bag with ${itemCount} items`} className="flex items-center gap-2 text-sm">
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M5 8.5h14l-.8 11H5.8L5 8.5Z" />
        <path d="M8.5 9V6.7a3.5 3.5 0 0 1 7 0V9" />
      </svg>
      <span>Bag ({itemCount})</span>
    </Link>
  );
}
