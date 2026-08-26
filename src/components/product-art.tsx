import type { Product } from "@/lib/products";

export function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const shapeClasses = { round: "rounded-[48%_48%_38%_38%]", crescent: "rounded-[60%_60%_18%_18%]", folded: "rounded-[16%_58%_20%_58%]", pleated: "rounded-[50%_50%_22%_22%]" };
  return <div className="relative h-full w-full overflow-hidden" style={{ background: product.tone }}><div className={`absolute left-[18%] bottom-[17%] h-[55%] w-[64%] ${shapeClasses[product.shape]} shadow-[17px_15px_0_rgba(76,48,30,.12)]`} style={{ background: product.accent, transform: product.shape === "crescent" ? "rotate(-10deg)" : "rotate(4deg)" }} /><div className={`absolute left-[24%] bottom-[23%] h-[42%] w-[52%] ${shapeClasses[product.shape]} bg-white/20`} />{large && <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[.18em] text-white/80">Cook from frozen · 8–10 minutes</p>}</div>;
}
