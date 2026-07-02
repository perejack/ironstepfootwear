import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { deleteProduct, saveProduct } from "@/lib/cms.api";
import { parseColorList, resolveColor } from "@/lib/color-utils";
import { ColorSwatchPreview } from "@/components/admin/ColorField";
import { productImage, type DbCategory, type DbProduct } from "@/lib/content";
import { parseDbVariants, type ProductVariant } from "@/lib/product-variants";
import { VariantsEditor } from "./VariantsEditor";
import { formatKES } from "@/data/products";
import { Field, ImageField, inputCls } from "./ImageField";

type Draft = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category_id: string | null;
  type: string;
  price: string;
  original_price: string;
  rating: string;
  reviews: string;
  badge: string;
  image_url: string | null;
  swatch: string;
  colors: string;
  features: string;
  sizes: string;
  variants: ProductVariant[];
  is_new_arrival: boolean;
  is_active: boolean;
  sort_order: number;
};

const emptyDraft = (categories: DbCategory[], count: number): Draft => ({
  slug: "",
  name: "",
  tagline: "",
  description: "",
  category_id: categories[0]?.id ?? null,
  type: "",
  price: "",
  original_price: "",
  rating: "4.8",
  reviews: "0",
  badge: "",
  image_url: null,
  swatch: "oklch(0.9 0.03 80)",
  colors: "#1a1a1a",
  features: "",
  sizes: "40, 41, 42, 43, 44",
  variants: [],
  is_new_arrival: true,
  is_active: true,
  sort_order: count + 1,
});

const toDraft = (p: DbProduct): Draft => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  tagline: p.tagline,
  description: p.description,
  category_id: p.category_id,
  type: p.type,
  price: String(p.price),
  original_price: p.original_price != null ? String(p.original_price) : "",
  rating: String(p.rating),
  reviews: String(p.reviews),
  badge: p.badge ?? "",
  image_url: p.image_url,
  swatch: p.swatch ?? "",
  colors: p.colors.join(", "),
  features: p.features.join("\n"),
  sizes: p.sizes.join(", "),
  variants: parseDbVariants(p.variants),
  is_new_arrival: p.is_new_arrival,
  is_active: p.is_active,
  sort_order: p.sort_order,
});

export function ProductsTab({
  products,
  categories,
}: {
  products: DbProduct[];
  categories: DbCategory[];
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const submit = async () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const price = Number(draft.price);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    const slug = (draft.slug || draft.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const orig = draft.original_price.trim() ? Number(draft.original_price) : null;
    const variants = draft.variants
      .filter((v) => v.label.trim())
      .slice(0, 4)
      .map((v) => ({
        label: v.label.trim(),
        color: resolveColor(v.color || v.label),
        image_url: v.image_url,
      }));
    const colorsFromVariants = variants.map((v) => v.color);
    setBusy(true);
    try {
      await saveProduct({
          id: draft.id,
          slug,
          name: draft.name.trim(),
          tagline: draft.tagline.trim(),
          description: draft.description.trim(),
          category_id: draft.category_id,
          type: draft.type.trim(),
          price: Math.round(price),
          original_price: orig != null && Number.isFinite(orig) && orig > 0 ? Math.round(orig) : null,
          rating: Math.min(5, Math.max(0, Number(draft.rating) || 4.8)),
          reviews: Math.max(0, Math.round(Number(draft.reviews) || 0)),
          badge: draft.badge || null,
          image_url: variants[0]?.image_url || draft.image_url,
          swatch: resolveColor(draft.swatch) || null,
          colors: colorsFromVariants.length > 0 ? colorsFromVariants : parseColorList(draft.colors),
          variants,
          features: draft.features.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12),
          sizes: draft.sizes
            .split(",")
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isInteger(n) && n >= 20 && n <= 60)
            .slice(0, 20),
          is_new_arrival: draft.is_new_arrival,
          is_active: draft.is_active,
          sort_order: draft.sort_order,
      });
      toast.success(draft.id ? "Product updated" : "Product added");
      qc.invalidateQueries({ queryKey: ["site-content"] });
      setDraft(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: DbProduct) => {
    if (!window.confirm(`Delete "${p.name}" permanently?`)) return;
    try {
      await deleteProduct({ id: p.id });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Product deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {!draft && (
        <button
          onClick={() => setDraft(emptyDraft(categories, products.length))}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> New product
        </button>
      )}

      {draft && (
        <div className="rounded-3xl border border-border/60 bg-background p-5 md:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">{draft.id ? "Edit product" : "New product"}</h2>
            <button
              onClick={() => setDraft(null)}
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name">
              <input className={inputCls} value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <input className={inputCls} value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Category">
              <select
                className={inputCls}
                value={draft.category_id ?? ""}
                onChange={(e) => set("category_id", e.target.value || null)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Type (e.g. Trainer, Derby)">
              <input className={inputCls} value={draft.type} onChange={(e) => set("type", e.target.value)} />
            </Field>
            <Field label="Price (KES)">
              <input
                className={inputCls}
                inputMode="numeric"
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </Field>
            <Field label="Original price (optional, shows discount)">
              <input
                className={inputCls}
                inputMode="numeric"
                value={draft.original_price}
                onChange={(e) => set("original_price", e.target.value)}
              />
            </Field>
            <Field label="Badge">
              <select className={inputCls} value={draft.badge} onChange={(e) => set("badge", e.target.value)}>
                <option value="">None</option>
                <option value="NEW">NEW</option>
                <option value="BESTSELLER">BESTSELLER</option>
                <option value="LIMITED">LIMITED</option>
              </select>
            </Field>
            <Field label="Rating (0–5)">
              <input className={inputCls} inputMode="decimal" value={draft.rating} onChange={(e) => set("rating", e.target.value)} />
            </Field>
            <Field label="Reviews count">
              <input className={inputCls} inputMode="numeric" value={draft.reviews} onChange={(e) => set("reviews", e.target.value)} />
            </Field>
            <Field label="Sizes (comma separated EU)">
              <input className={inputCls} value={draft.sizes} onChange={(e) => set("sizes", e.target.value)} />
            </Field>
            <Field label="Colours (type names — e.g. black, burgundy, cream)">
              <input
                className={inputCls}
                value={draft.colors}
                onChange={(e) => set("colors", e.target.value)}
                placeholder="black, burgundy, cream, orange"
              />
              <ColorSwatchPreview value={draft.colors} />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Separate with commas. Use plain words like <span className="font-medium">navy</span> or{" "}
                <span className="font-medium">mustard</span> — no codes needed.
              </p>
            </Field>
            <Field label="Card background colour">
              <input
                className={inputCls}
                value={draft.swatch}
                onChange={(e) => set("swatch", e.target.value)}
                placeholder="cream, sand, or #efe6d3"
              />
              {draft.swatch.trim() ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="h-6 w-10 rounded-md ring-1 ring-border"
                    style={{ background: resolveColor(draft.swatch) }}
                  />
                  Preview
                </div>
              ) : null}
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} className={inputCls} value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </Field>
          <Field label="Features (one per line)">
            <textarea rows={3} className={inputCls} value={draft.features} onChange={(e) => set("features", e.target.value)} />
          </Field>
          <Field label="Main product image">
            <ImageField
              value={draft.image_url}
              fallback={draft.slug ? productImage({ image_url: null, slug: draft.slug }) : undefined}
              aspect="aspect-square max-w-[220px]"
              onChange={(url) => set("image_url", url)}
              label="Upload default photo"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Used as fallback. Add colour photos below — each appears as a thumbnail on the product page.
            </p>
          </Field>

          <VariantsEditor
            variants={draft.variants}
            fallbackSlug={draft.slug}
            onChange={(variants) => set("variants", variants.slice(0, 4))}
          />

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.is_new_arrival}
                onChange={(e) => set("is_new_arrival", e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Show in New Arrivals
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              Visible in store
            </label>
          </div>

          <button
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {draft.id ? "Save product" : "Add product"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {products.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-4 rounded-3xl border border-border/60 bg-background p-3.5 ${p.is_active ? "" : "opacity-55"}`}
          >
            <img
              src={productImage(p)}
              alt={p.name}
              className="h-16 w-16 rounded-2xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="font-display text-lg leading-tight truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                Ksh {formatKES(p.price)}
                {p.badge ? ` · ${p.badge}` : ""}
                {p.is_active ? "" : " · hidden"}
              </div>
            </div>
            <button
              onClick={() => setDraft(toDraft(p))}
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition shrink-0"
              aria-label={`Edit ${p.name}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => remove(p)}
              className="h-9 w-9 rounded-full border border-destructive/40 text-destructive flex items-center justify-center hover:bg-destructive/10 transition shrink-0"
              aria-label={`Delete ${p.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
