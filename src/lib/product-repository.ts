import type { Product } from "./products";
import { getProduct, products } from "./products";
import { createClient, hasSupabaseConfig } from "./supabase/server";

type ProductRow = {
  slug: string; name: string; region: string; country: string; price_cents: number;
  description: string; ingredients: string; package_size: string; dietary: string[];
  tone: string; accent: string; shape: Product["shape"];
  image_url: string | null;
};

function toProduct(row: ProductRow): Product {
  return { slug: row.slug, name: row.name, region: row.region, country: row.country, price: row.price_cents / 100, description: row.description, ingredients: row.ingredients, packageSize: row.package_size, dietary: row.dietary, tone: row.tone, accent: row.accent, shape: row.shape, imageUrl: row.image_url };
}

export async function getStoreProducts() {
  if (!hasSupabaseConfig) return products;
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("sort_order").returns<ProductRow[]>();
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data.map(toProduct);
}

export async function getStoreProduct(slug: string) {
  if (!hasSupabaseConfig) return getProduct(slug);
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("is_active", true).maybeSingle<ProductRow>();
  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data ? toProduct(data) : undefined;
}
