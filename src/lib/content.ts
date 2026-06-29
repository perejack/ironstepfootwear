import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteContent } from "@/lib/cms.functions";
import type { Tables } from "@/integrations/supabase/types";
import {
  products as staticProducts,
  categories as staticCategoryNames,
  type Product,
  type Category,
} from "@/data/products";
import heroShoe from "@/assets/hero-shoe.jpg";
import savanna from "@/assets/product-savanna.jpg";
import kibera from "@/assets/product-kibera.jpg";
import mara from "@/assets/product-mara.jpg";
import rift from "@/assets/product-rift.jpg";
import nairobi from "@/assets/product-nairobi.jpg";
import catOfficial from "@/assets/cat-official.jpg";
import catSmart from "@/assets/cat-smartcasual.jpg";
import catSneakers from "@/assets/cat-sneakers-new.jpg";

export type DbProduct = Tables<"products">;
export type DbCategory = Tables<"categories">;

export const productImageFallbacks: Record<string, string> = {
  "savanna-runner": savanna,
  "kibera-court": kibera,
  "mara-glide": mara,
  "rift-chelsea": rift,
  "nairobi-derby": nairobi,
  "iron-step-icon": heroShoe,
};

export const categoryImageFallbacks: Record<string, string> = {
  official: catOfficial,
  "smart-casuals": catSmart,
  sneakers: catSneakers,
};

export const defaultSettings: Record<string, string> = {
  hero_headline: "One wardrobe. Every occasion.",
  hero_subtext:
    "Sneakers that go beyond the gym. Casuals that outlast the weekend. Smart casuals that mean business without trying too hard. Whatever the day calls for, Iron Step has the shoe for it.",
  hero_image_url: "",
  hero_badge_text: "New · Autumn drop 026",
  hero_primary_cta_text: "Shop the collection",
  hero_secondary_cta_text: "Our story",
  /**
   * JSON array of [number,label] pairs.
   * Example: [["12","prototypes per shoe"],["48h","Nairobi delivery"],["100%","M-Pesa checkout"]]
   */
  home_stats_json: JSON.stringify([
    ["12", "prototypes per shoe"],
    ["48h", "Nairobi delivery"],
    ["100%", "M-Pesa checkout"],
  ]),
  /**
   * JSON array of strings.
   * Example: ["Nairobi","Mombasa","Kisumu"]
   */
  home_marquee_cities_json: JSON.stringify([
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Eldoret",
    "Nakuru",
    "Thika",
    "Naivasha",
  ]),
  categories_kicker: "Shop by",
  categories_title: "Categories",
  categories_view_all_text: "View all",
  /**
   * JSON array of { title, description } objects.
   */
  home_promise_json: JSON.stringify([
    { title: "Free delivery", description: "Free shipping countrywide on orders above KES 5,000." },
    { title: "M-Pesa secure", description: "Pay with M-Pesa, card or on delivery — your choice." },
    { title: "14-day returns", description: "Try them at home. If they don't fit, we collect for free." },
  ]),
  spotlight_kicker: "Spotlight",
  spotlight_image_url: "",
  /**
   * JSON array of strings.
   */
  spotlight_features_json: JSON.stringify([
    "Made for Nairobi's pace",
    "Styles for every occasion",
    "Comfort that doesn't compromise",
    "Affordable Kenyan pricing",
  ]),
  spotlight_primary_cta_text: "Explore the Collection",
  how_it_works_kicker: "How it works",
  how_it_works_title_json: JSON.stringify({
    before: "From cart to doorstep in",
    highlight: "three steps",
  }),
  how_step_1_image_url: "",
  how_step_2_image_url: "",
  how_step_3_image_url: "",
  /**
   * JSON array of { step, title, description }.
   * Images are controlled by how_step_#_image_url keys.
   */
  how_steps_json: JSON.stringify([
    {
      step: "01",
      title: "Pick your pair",
      description: "Browse Official, Smart Casuals or Sneakers. Save favourites to revisit later.",
    },
    {
      step: "02",
      title: "Pay with M-Pesa",
      description: "Lipa na M-Pesa, card or pay on delivery. Order confirmed in seconds.",
    },
    {
      step: "03",
      title: "Delivered to you",
      description: "Same-day in Nairobi. 24–48 hours countrywide via our trusted couriers.",
    },
  ]),
  testimonials_kicker: "Word on the street",
  testimonials_title: "Loved across Kenya",
  testimonials_rating_text: "4.9",
  testimonials_reviews_text: "· 1,240+ reviews",
  testimonial_1_avatar_url: "",
  testimonial_2_avatar_url: "",
  testimonial_3_avatar_url: "",
  /**
   * JSON array of { quote, name, location }.
   * Avatars are controlled by testimonial_#_avatar_url keys.
   */
  testimonials_json: JSON.stringify([
    {
      quote: "The Mara Oxford fits like it was made for me. Quality you can't find on Biashara Street.",
      name: "Brian K.",
      location: "Westlands, Nairobi",
    },
    {
      quote: "Ordered in the evening, delivered next morning to Kisumu. The sneakers are crazy comfortable.",
      name: "Aisha M.",
      location: "Kisumu",
    },
    {
      quote: "Finally a Kenyan brand that ships properly and the leather actually lasts. Repeat customer.",
      name: "Patrick O.",
      location: "Eldoret",
    },
  ]),
  whatsapp_number: "+254795704273",
  whatsapp_group_url: "https://chat.whatsapp.com/",
  announcement: "Free delivery in Nairobi on orders above KES 5,000",
};

/** Split a headline at the first full stop: ["One wardrobe.", "Every occasion."] */
export function splitHeadline(h: string): [string, string] {
  const i = h.indexOf(".");
  if (i === -1 || i >= h.length - 1) return [h, ""];
  return [h.slice(0, i + 1), h.slice(i + 1).trim()];
}

export type SiteCategory = { id: string; name: string; slug: string; image: string };

export function productImage(row: Pick<DbProduct, "image_url" | "slug">): string {
  return row.image_url || productImageFallbacks[row.slug] || heroShoe;
}

function mapProduct(row: DbProduct, catNames: Map<string, string>): Product {
  return {
    id: row.slug,
    name: row.name,
    tagline: row.tagline,
    category: ((row.category_id && catNames.get(row.category_id)) ?? "Sneakers") as Category,
    type: row.type,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    badge: (row.badge as Product["badge"]) ?? undefined,
    image: productImage(row),
    swatch: row.swatch || "oklch(0.9 0.03 80)",
    colors: row.colors,
    description: row.description,
    features: row.features,
    sizes: row.sizes,
  };
}

export type SiteContentData = Awaited<ReturnType<typeof getSiteContent>>;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Live site content from the database, with a graceful fallback
 * to the built-in catalogue while loading or offline.
 */
export function useSiteContent() {
  const fetchContent = useServerFn(getSiteContent);
  const query = useQuery({
    queryKey: ["site-content"],
    queryFn: () => fetchContent(),
    staleTime: 60_000,
  });

  const data = query.data;

  return useMemo(() => {
    if (!data) {
      return {
        loaded: false,
        products: staticProducts,
        newArrivals: staticProducts,
        categories: staticCategoryNames.map((name) => ({
          id: name,
          name,
          slug: slugify(name),
          image: categoryImageFallbacks[slugify(name)] ?? heroShoe,
        })) as SiteCategory[],
        settings: { ...defaultSettings },
        raw: undefined as SiteContentData | undefined,
      };
    }

    const catNames = new Map(data.categories.map((c) => [c.id, c.name]));
    const products = data.products
      .filter((p) => p.is_active)
      .map((p) => mapProduct(p, catNames));
    const newArrivalList = data.products
      .filter((p) => p.is_active && p.is_new_arrival)
      .map((p) => mapProduct(p, catNames));
    const categories: SiteCategory[] = data.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image_url || categoryImageFallbacks[c.slug] || heroShoe,
    }));
    const settings: Record<string, string> = { ...defaultSettings };
    for (const [k, v] of Object.entries(data.settings)) if (v) settings[k] = v;

    return {
      loaded: true,
      products,
      newArrivals: newArrivalList.length ? newArrivalList : products,
      categories,
      settings,
      raw: data,
    };
  }, [data]);
}
