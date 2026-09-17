import Link from "next/link";
import { CartButton } from "@/components/cart-button";
import { CartPage } from "@/components/cart-page";

export default function Cart() {
  return (
    <main className="min-h-screen bg-[#fffdf8] text-[#273027]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl font-semibold tracking-[-.06em]">
          morsel
        </Link>
        <CartButton />
      </header>
      <CartPage />
    </main>
  );
}
