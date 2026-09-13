import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CartButton } from "@/components/cart-button";
import { ProductArt } from "@/components/product-art";
import { formatPrice } from "@/lib/products";
import { getStoreProduct } from "@/lib/product-repository";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) notFound();
  return <main className="min-h-screen bg-[#fffdf8] text-[#273027]"><header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10"><Link href="/" className="text-xl font-semibold tracking-[-.06em]">morsel</Link><CartButton /></header><section className="mx-auto grid max-w-6xl gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-16"><div className="relative aspect-[.85]"><ProductArt product={product} large /></div><div className="flex flex-col justify-center"><Link href="/#shop" className="text-sm text-[#5f7b56]">← All dumplings</Link><p className="mt-10 text-xs font-medium uppercase tracking-[.18em] text-[#719064]">{product.region} · {product.country}</p><h1 className="mt-4 text-4xl tracking-[-.06em] sm:text-5xl">{product.name}</h1><p className="mt-4 text-lg">{formatPrice(product.price)}</p><p className="mt-7 max-w-md leading-7 text-[#586457]">{product.description}</p><div className="mt-8 grid gap-4 border-y border-[#d8ddd5] py-5 text-sm"><p><span className="font-medium">Inside:</span> {product.ingredients}</p><p><span className="font-medium">Pack size:</span> {product.packageSize}</p><p><span className="font-medium">Dietary:</span> {product.dietary.join(", ")}</p></div><div className="mt-7"><AddToCartButton product={product} /></div><p className="mt-4 text-xs leading-5 text-[#687168]">Ships frozen. Keep frozen until ready to cook.</p></div></section></main>;
}
