export type Product = {
  slug: string;
  name: string;
  region: string;
  country: string;
  price: number;
  description: string;
  ingredients: string;
  packageSize: string;
  dietary: string[];
  tone: string;
  accent: string;
  shape: "round" | "crescent" | "folded" | "pleated";
};

export const products: Product[] = [
  { slug: "soup-dumplings", name: "Soup Dumplings", region: "Jiangnan", country: "China", price: 18, description: "Tender wrappers filled with slow-simmered pork and a deeply savory broth.", ingredients: "Pork, ginger, scallion, sesame", packageSize: "12 dumplings · serves 2", dietary: ["Contains pork"], tone: "#e9d6bb", accent: "#b97948", shape: "round" },
  { slug: "vegetable-momo", name: "Vegetable Momo", region: "Himalayas", country: "Nepal & Tibet", price: 16, description: "Pillowy steamed dumplings brightened with cabbage, carrot, ginger, and toasted spices.", ingredients: "Cabbage, carrot, ginger, garlic", packageSize: "14 dumplings · serves 2", dietary: ["Vegan"], tone: "#c9d7cb", accent: "#688266", shape: "pleated" },
  { slug: "wild-mushroom-pelmeni", name: "Wild Mushroom Pelmeni", region: "Eastern Europe", country: "Ukraine & Russia", price: 17, description: "Little hand-folded parcels of earthy mushroom, potato, and caramelized onion.", ingredients: "Mushroom, potato, onion, dill", packageSize: "16 dumplings · serves 2–3", dietary: ["Vegetarian"], tone: "#c5b1a0", accent: "#725848", shape: "folded" },
  { slug: "chicken-gyoza", name: "Chicken Gyoza", region: "Japan", country: "Japan", price: 16, description: "Crisp-bottomed dumplings with chicken, cabbage, chive, and a touch of white pepper.", ingredients: "Chicken, cabbage, chive, ginger", packageSize: "12 dumplings · serves 2", dietary: ["Contains chicken"], tone: "#d2c9b7", accent: "#92724f", shape: "crescent" },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}
