import { Plus, Trash2 } from "lucide-react";
import type { ProductVariant } from "@/lib/product-variants";
import { resolveColor } from "@/lib/color-utils";
import { productImage } from "@/lib/content";
import { Field, ImageField, inputCls } from "./ImageField";

const MAX_VARIANTS = 4;

export function VariantsEditor({
  variants,
  fallbackSlug,
  onChange,
}: {
  variants: ProductVariant[];
  fallbackSlug?: string;
  onChange: (next: ProductVariant[]) => void;
}) {
  const add = () => {
    if (variants.length >= MAX_VARIANTS) return;
    onChange([...variants, { label: "", color: "", image_url: null }]);
  };

  const update = (index: number, patch: Partial<ProductVariant>) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };

  const remove = (index: number) => onChange(variants.filter((_, i) => i !== index));

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-secondary/30 p-4 space-y-4">
      <div>
        <h3 className="font-display text-xl">Colour variations</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
          Add up to {MAX_VARIANTS} colours, each with its own photo. Customers tap the thumbnails on the
          product page to switch between them. Use names like{" "}
          <span className="font-medium">Black</span> or <span className="font-medium">Orange</span>.
        </p>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No colour photos yet — add one below.</p>
      ) : null}

      {variants.map((v, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/60 bg-background p-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
        >
          <Field label={`Colour name ${i + 1}`}>
            <input
              className={inputCls}
              value={v.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="e.g. Black, Burgundy"
            />
          </Field>
          <Field label="Swatch colour (optional)">
            <input
              className={inputCls}
              value={v.color}
              onChange={(e) => update(i, { color: e.target.value })}
              placeholder="black, burgundy…"
            />
            {(v.color || v.label) && (
              <span
                className="mt-2 inline-block h-5 w-5 rounded-full ring-1 ring-border"
                style={{ background: resolveColor(v.color || v.label) }}
              />
            )}
          </Field>
          <button
            type="button"
            onClick={() => remove(i)}
            className="sm:mt-7 h-10 w-10 rounded-full border border-destructive/40 text-destructive flex items-center justify-center hover:bg-destructive/10 transition self-end sm:self-auto"
            aria-label="Remove colour"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="sm:col-span-3">
            <Field label="Photo for this colour">
              <ImageField
                value={v.image_url}
                fallback={
                  fallbackSlug
                    ? productImage({ image_url: null, slug: fallbackSlug })
                    : undefined
                }
                aspect="aspect-square max-w-[180px]"
                onChange={(url) => update(i, { image_url: url })}
                label="Upload colour photo"
              />
            </Field>
          </div>
        </div>
      ))}

      {variants.length < MAX_VARIANTS ? (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-background transition"
        >
          <Plus className="h-4 w-4" /> Add colour variation
        </button>
      ) : (
        <p className="text-xs text-muted-foreground">Maximum {MAX_VARIANTS} colour photos per product.</p>
      )}
    </div>
  );
}
