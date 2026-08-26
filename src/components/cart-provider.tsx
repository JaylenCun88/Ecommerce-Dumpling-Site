"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import type { Product } from "@/lib/products";

type CartItem = Pick<Product, "slug" | "name" | "price" | "packageSize"> & { quantity: number };
type CartContextValue = { items: CartItem[]; itemCount: number; addItem: (product: Product) => void; removeItem: (slug: string) => void; clearCart: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = "morsel-cart";
const cartListeners = new Set<() => void>();

function getCartSnapshot() {
  return typeof window === "undefined" ? "[]" : window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function parseCart(snapshot: string): CartItem[] {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed as CartItem[] : [];
  } catch {
    return [];
  }
}

function updateCart(update: (items: CartItem[]) => CartItem[]) {
  const nextItems = update(parseCart(getCartSnapshot()));
  window.localStorage.setItem(cartStorageKey, JSON.stringify(nextItems));
  cartListeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartSnapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => "[]");
  const items = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem(product: Product) {
      updateCart((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        if (existing) return current.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { slug: product.slug, name: product.name, price: product.price, packageSize: product.packageSize, quantity: 1 }];
      });
    },
    removeItem(slug: string) { updateCart((current) => current.filter((item) => item.slug !== slug)); },
    clearCart() { updateCart(() => []); },
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
