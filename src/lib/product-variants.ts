import { resolveColor } from "@/lib/color-utils";
import type { Product } from "@/data/products";

export type ProductVariant = {
  label: string;
  color: string;
  image_url: string | null;
};

export type ColorwayOption = {
  key: string;
  label: string;
  color: string;
  image: string;
  /** Product slug — navigate when switching linked style rows */
  slug: string;
  /** In-page variant index when variants live on one product */
  variantIndex?: number;
};

function parseVariants(raw: unknown): ProductVariant[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const o = row as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label.trim() : "";
      const color = typeof o.color === "string" ? o.color.trim() : "";
      const image_url =
        typeof o.image_url === "string" && o.image_url.trim() ? o.image_url.trim() : null;
      if (!label) return null;
      return { label, color: color || label, image_url };
    })
    .filter((v): v is ProductVariant => v !== null)
    .slice(0, 12);
}

export function parseDbVariants(raw: unknown): ProductVariant[] {
  return parseVariants(raw);
}

function getMainColorway(product: Product): ColorwayOption {
  return {
    key: `${product.id}-main`,
    label: product.colorLabel || "Main",
    color: product.colors[0] || product.swatch,
    image: product.image,
    slug: product.id,
  };
}

/** All colour options for a product page (variants, linked styles, or legacy dots). */
export function getColorways(product: Product, catalog: Product[]): ColorwayOption[] {
  if (product.variants.length > 0) {
    const main = getMainColorway(product);
    const variants = product.variants.map((v, i) => ({
      key: `${product.id}-v-${i}`,
      label: v.label,
      color: v.color,
      image: v.image_url || product.image,
      slug: product.id,
      variantIndex: i,
    }));

    const hasDistinctMain = variants.every(
      (v) => v.image !== main.image || v.label.toLowerCase() !== main.label.toLowerCase(),
    );

    return hasDistinctMain ? [main, ...variants] : variants;
  }

  if (product.styleKey) {
    const family = catalog
      .filter((p) => p.styleKey === product.styleKey)
      .sort((a, b) => a.name.localeCompare(b.name));
    if (family.length > 1) {
      return family.map((p) => ({
        key: p.id,
        label: p.colorLabel || p.name.replace(/^.*\s[-–]\s/, "") || p.name,
        color: p.colors[0] || p.swatch,
        image: p.image,
        slug: p.id,
      }));
    }
  }

  if (product.colors.length > 1) {
    return product.colors.map((c, i) => ({
      key: `${product.id}-c-${i}`,
      label: c,
      color: c,
      image: product.image,
      slug: product.id,
      variantIndex: i,
    }));
  }

  if (product.colors.length === 1) {
    return [
      {
        key: `${product.id}-c-0`,
        label: product.colorLabel || product.colors[0],
        color: product.colors[0],
        image: product.image,
        slug: product.id,
        variantIndex: 0,
      },
    ];
  }

  return [];
}

export function colorwayCount(product: Product, catalog: Product[]): number {
  return getColorways(product, catalog).length;
}

/** Thumbnail row on product page — up to 4 colour photos for this product. */
export function getProductGallery(product: Product, catalog: Product[]): ColorwayOption[] {
  const onPage = getColorways(product, catalog).filter((o) => o.slug === product.id);
  if (onPage.length > 0) return onPage.slice(0, 4);
  return [getMainColorway(product)];
}

export function swatchStyle(color: string) {
  return { background: resolveColor(color) };
}
