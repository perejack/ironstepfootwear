import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { getColorways, swatchStyle, type ColorwayOption } from "@/lib/product-variants";
import type { Product } from "@/data/products";

export function ProductColorPicker({
  product,
  catalog,
  selectedKey,
  onSelectVariant,
}: {
  product: Product;
  catalog: Product[];
  selectedKey: string;
  onSelectVariant: (option: ColorwayOption) => void;
}) {
  const options = getColorways(product, catalog);
  if (options.length <= 1) return null;

  const active = options.find((o) => o.key === selectedKey) ?? options[0];

  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground">COLOUR</p>
        <span className="text-sm font-medium text-foreground">{active.label}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = option.key === selectedKey;
          const isLinked = option.slug !== product.id;

          const swatch = (
            <span className="relative block h-14 w-14 rounded-2xl overflow-hidden ring-1 ring-border shadow-sm transition-transform hover:scale-105">
              <img
                src={option.image}
                alt={option.label}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                className="absolute bottom-0 inset-x-0 h-1.5"
                style={swatchStyle(option.color)}
                aria-hidden
              />
              {isActive ? (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background shadow">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              ) : null}
            </span>
          );

          const className = `rounded-2xl transition ${
            isActive ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
          }`;

          if (isLinked) {
            return (
              <Link
                key={option.key}
                to={`/product/${option.slug}`}
                className={className}
                title={option.label}
                aria-label={`${option.label} colourway`}
              >
                {swatch}
              </Link>
            );
          }

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelectVariant(option)}
              className={className}
              title={option.label}
              aria-label={`${option.label} colourway`}
              aria-pressed={isActive}
            >
              {swatch}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Tap a colour to see that version of the shoe.
      </p>
    </div>
  );
}

/** Compact dots for product cards */
export function ProductColorDots({
  product,
  catalog,
  max = 4,
}: {
  product: Product;
  catalog: Product[];
  max?: number;
}) {
  const options = getColorways(product, catalog);
  if (options.length <= 1) return null;

  const shown = options.slice(0, max);
  const extra = options.length - shown.length;

  return (
    <div className="flex items-center gap-1 mt-1">
      {shown.map((o) => (
        <span
          key={o.key}
          className="h-3 w-3 rounded-full ring-1 ring-border shrink-0"
          style={swatchStyle(o.color)}
          title={o.label}
        />
      ))}
      {extra > 0 ? (
        <span className="text-[10px] text-muted-foreground">+{extra}</span>
      ) : null}
    </div>
  );
}
