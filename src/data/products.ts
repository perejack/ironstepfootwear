import savanna from "@/assets/product-savanna.jpg";
import kibera from "@/assets/product-kibera.jpg";
import mara from "@/assets/product-mara.jpg";
import rift from "@/assets/product-rift.jpg";
import nairobi from "@/assets/product-nairobi.jpg";
import hero from "@/assets/hero-shoe.jpg";

export type Category = "Official" | "Smart Casuals" | "Sneakers";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  type: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: "BESTSELLER" | "NEW" | "LIMITED";
  image: string;
  swatch: string;
  colors: string[];
  description: string;
  features: string[];
  sizes: number[];
};

export const categories: Category[] = ["Official", "Smart Casuals", "Sneakers"];

export const products: Product[] = [
  {
    id: "savanna-runner",
    name: "Savanna Runner",
    tagline: "Engineered for the Nairobi commute",
    category: "Sneakers",
    type: "Trainer",
    price: 6800,
    originalPrice: 8200,
    rating: 4.8,
    reviews: 214,
    badge: "BESTSELLER",
    image: savanna,
    swatch: "oklch(0.85 0.10 75)",
    colors: ["#e25822", "#1a1a1a"],
    description:
      "A featherweight runner engineered for Nairobi pavements and weekend trails. Knit upper, foam midsole, breathable from morning matatu to evening jog.",
    features: ["Breathable engineered knit", "Cushioned EVA midsole", "Rubber outsole grip", "Recycled laces"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: "kibera-court",
    name: "Kibera Court",
    tagline: "The everyday canvas classic",
    category: "Smart Casuals",
    type: "Court Shoe",
    price: 4500,
    rating: 4.7,
    reviews: 96,
    badge: "NEW",
    image: kibera,
    swatch: "oklch(0.92 0.03 80)",
    colors: ["#efe6d3", "#1a1a1a"],
    description:
      "Heritage canvas court shoe. A daily classic, hand-finished with a vulcanised rubber sole that softens beautifully with wear.",
    features: ["12oz cotton canvas", "Vulcanised rubber sole", "Cotton terry lining", "Removable insole"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },
  {
    id: "mara-glide",
    name: "Mara Glide",
    tagline: "Soft as sand, built to move",
    category: "Sneakers",
    type: "Runner",
    price: 7400,
    rating: 4.9,
    reviews: 178,
    image: mara,
    swatch: "oklch(0.88 0.05 75)",
    colors: ["#f5e7d0", "#cfd8c7"],
    description:
      "Soft-as-sand runner with a sculpted heel cradle. Built for long walks, late commutes and quiet Sundays.",
    features: ["Sock-fit collar", "Energy-return foam", "Recycled mesh upper", "Reflective heel tab"],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  {
    id: "rift-chelsea",
    name: "Heritage Chelsea",
    tagline: "Timeless leather, built to last",
    category: "Official",
    type: "Chelsea Boot",
    price: 9800,
    rating: 4.9,
    reviews: 132,
    badge: "BESTSELLER",
    image: rift,
    swatch: "oklch(0.75 0.09 70)",
    colors: ["#1a1a1a", "#5b3a23"],
    description:
      "Hand-finished full-grain leather Chelsea boot with a chunky lugged sole for grip in every season.",
    features: ["Full-grain leather", "Elastic side panels", "Goodyear welted", "Lugged rubber sole"],
    sizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: "nairobi-derby",
    name: "Nairobi Derby",
    tagline: "Boardroom polish, all-day comfort",
    category: "Official",
    type: "Derby",
    price: 9800,
    rating: 4.8,
    reviews: 87,
    image: nairobi,
    swatch: "oklch(0.45 0.05 40)",
    colors: ["#1a1a1a", "#5b3a23"],
    description:
      "A clean, modern derby. Hand-polished calfskin over a soft leather lining — boardroom by morning, dinner by night.",
    features: ["Polished calfskin", "Blake-stitched", "Leather insole", "Cushioned heel"],
    sizes: [40, 41, 42, 43, 44, 45],
  },
  {
    id: "iron-step-icon",
    name: "Iron Step Icon",
    tagline: "The shoe that started the studio",
    category: "Smart Casuals",
    type: "Premium Sneaker",
    price: 11200,
    rating: 5.0,
    reviews: 64,
    badge: "LIMITED",
    image: hero,
    swatch: "oklch(0.55 0.14 25)",
    colors: ["#5a1a2a", "#1a1a1a"],
    description:
      "The shoe that started the studio. Burgundy aniline leather, a tonal sole, and a silhouette refined over twelve prototypes.",
    features: ["Aniline-dyed leather", "Memory-foam footbed", "Numbered batch", "Hand-stitched welt"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const formatKES = (n: number) =>
  new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(n);
