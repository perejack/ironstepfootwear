import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { formatKES, type Product } from "@/data/products";
import { addToCart } from "@/store/cart";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const quickOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes[Math.floor(product.sizes.length / 2)];
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
    });
    toast.success(`${product.name} added · size ${size}`);
  };

  return (
    <article
      className="group flex flex-col animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}
    >
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden rounded-3xl aspect-square shadow-card"
        style={{ background: product.swatch }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-foreground text-background px-3 py-1.5 text-[10px] font-semibold tracking-widest">
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 rounded-full bg-destructive text-destructive-foreground px-2.5 py-1 text-[10px] font-semibold">
            −{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </Link>

      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
        <span className="font-medium">{product.rating.toFixed(1)}</span>
        <span className="text-muted-foreground">· {product.reviews} reviews</span>
      </div>

      <h3 className="mt-1.5 font-display text-xl sm:text-2xl leading-tight">{product.name}</h3>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-1">{product.tagline}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-display text-base sm:text-xl whitespace-nowrap">
            Ksh {formatKES(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] sm:text-xs text-muted-foreground line-through whitespace-nowrap">
              {formatKES(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {product.colors.map((c) => (
            <span
              key={c}
              className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full ring-1 ring-border"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:grid sm:grid-cols-2 gap-2">
        <Link
          to={`/product/${product.id}`}
          className="rounded-full border border-foreground/25 px-3 py-2.5 text-xs font-medium text-center hover:bg-secondary transition"
        >
          View details
        </Link>
        <button
          onClick={quickOrder}
          className="rounded-full bg-foreground text-background px-3 py-2.5 text-xs font-medium inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition"
        >
          Order
          <ShoppingBag className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
