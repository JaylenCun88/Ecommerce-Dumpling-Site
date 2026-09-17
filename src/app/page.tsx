import Link from "next/link";
import { connection } from "next/server";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CartButton } from "@/components/cart-button";
import { ProductArt } from "@/components/product-art";
import { formatPrice } from "@/lib/products";
import { getStoreProducts } from "@/lib/product-repository";

export default async function Home() {
  await connection();
  const products = await getStoreProducts();
  const featuredProduct = products[0];
  return (
    <main className="min-h-screen bg-[#fffdf8] text-[#273027]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl font-semibold tracking-[-.06em]">
          morsel
        </Link>
        <nav className="hidden gap-8 text-sm md:flex">
          <a href="#shop">Shop</a>
          <a href="#how-it-works">How it works</a>
          <a href="#our-table">Our table</a>
        </nav>
        <CartButton />
      </header>
      <section className="mx-auto grid max-w-7xl overflow-hidden px-6 pb-14 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-24">
        <div className="flex flex-col justify-center py-14 lg:py-24">
          <p className="mb-6 text-xs font-medium uppercase tracking-[.2em] text-[#719064]">
            Dumplings, gathered globally
          </p>
          <h1 className="max-w-xl text-5xl leading-[.96] tracking-[-.07em] sm:text-7xl">
            The world is better at your table.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#626e62]">
            Discover time-honored dumpling traditions, made with care and delivered frozen for your easiest, most
            delicious dinner.
          </p>
          <Link href="#shop" className="mt-9 w-fit bg-[#243529] px-6 py-3.5 text-sm text-white">
            Explore the collection →
          </Link>
        </div>
        <div className="relative min-h-[420px] sm:min-h-[510px]">
          <ProductArt product={featuredProduct} large />
        </div>
      </section>
      <section id="shop" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Freezer favorites</p>
            <h2 className="mt-3 text-3xl tracking-[-.05em] sm:text-4xl">One world. Many folds.</h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-5 text-[#687168] sm:block">
            Small-batch dumplings made in partnership with cooks who know each tradition best.
          </p>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.slug}>
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[.84]">
                  <ProductArt product={product} />
                  <span className="absolute left-3 top-3 bg-[#fffdf8] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[.14em]">
                    {product.country}
                  </span>
                </div>
                <div className="mt-4 flex justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-[#687168]">{product.region}</p>
                  </div>
                  <p className="text-sm">{formatPrice(product.price)}</p>
                </div>
              </Link>
              <div className="mt-4">
                <AddToCartButton product={product} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="bg-[#e6eee3] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">From freezer to table</p>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {[
              [
                "01",
                "Choose your dumplings",
                "Explore regional styles, from steaming baskets to crispy skillet favorites.",
              ],
              [
                "02",
                "Keep them frozen",
                "Your order arrives packed for the freezer, ready whenever dinner needs a hand.",
              ],
              ["03", "Cook and gather", "Follow a simple card for a joyful meal in ten minutes or less."],
            ].map(([number, title, body]) => (
              <div key={number} className="border-t border-[#b9c9b5] pt-4">
                <p className="text-sm text-[#719064]">{number}</p>
                <h3 className="mt-8 text-2xl tracking-[-.04em]">{title}</h3>
                <p className="mt-3 max-w-xs leading-7 text-[#586457]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="our-table"
        className="mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-24"
      >
        <p className="max-w-md text-3xl leading-tight tracking-[-.05em] sm:text-4xl">
          Every dumpling carries a story—of a place, a family kitchen, and a way of gathering.
        </p>
        <div>
          <p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Our table</p>
          <p className="mt-4 max-w-md leading-7 text-[#626e62]">
            We celebrate dumpling traditions from around the world, with care for the people and cuisines that inspired
            every bite.
          </p>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-[#e2ded5] px-6 py-10 text-sm text-[#687168] sm:flex-row sm:justify-between lg:px-10">
        <p>© 2026 Morsel Foods</p>
        <div className="flex gap-5">
          <a href="#">Instagram</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </main>
  );
}
