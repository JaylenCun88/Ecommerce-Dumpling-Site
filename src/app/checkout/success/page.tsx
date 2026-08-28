import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/clear-cart-on-success";

export default function CheckoutSuccess() {
  return <main className="grid min-h-screen place-items-center bg-[#fffdf8] px-6 text-center text-[#273027]"><ClearCartOnSuccess /><section><p className="text-xs font-medium uppercase tracking-[.2em] text-[#719064]">Order received</p><h1 className="mt-4 text-5xl tracking-[-.07em]">Dinner is on its way.</h1><p className="mx-auto mt-5 max-w-md leading-7 text-[#586457]">Thank you for your order. We’ll send confirmation and delivery details to the email you entered at checkout.</p><Link href="/" className="mt-8 inline-block bg-[#243529] px-6 py-3.5 text-sm text-white">Return to Morsel</Link></section></main>;
}
