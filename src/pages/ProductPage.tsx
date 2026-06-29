import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Truck, RotateCcw, Star, Check, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, formatKES } from "@/data/products";
import { addToCart, toggleSaved, useCart } from "@/store/cart";
import { useSiteContent } from "@/lib/content";
import { usePageTitle } from "@/lib/use-page-title";

export default function ProductPage() {
  const { id = "" } = useParams();
  const { products, settings } = useSiteContent();
  const product = products.find((p) => p.id === id) ?? getProduct(id);
  const navigate = useNavigate();
  const { saved } = useCart();
  const [size, setSize] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [colorIdx, setColorIdx] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [err, setErr] = useState("");

  usePageTitle(product ? `${product.name} — Iron Step` : "Product — Iron Step");

  if (!product) {
    return (
      <PageShell>
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="font-display text-4xl">Not found</h1>
          <Link to="/shop" className="mt-4 inline-block underline">
            Back to shop
          </Link>
        </div>
      </PageShell>
    );
  }

  const isSaved = saved.includes(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const gallery = [product.image, product.image, product.image, product.image];

  const buy = (then?: "checkout") => {
    if (!size) {
      setErr("Select a size");
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      qty,
    });
    if (then === "checkout") navigate("/checkout");
    else navigate("/cart");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/">Home</Link> · <Link to="/shop">Shop</Link> · {product.name}
        </nav>
      </div>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* GALLERY */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative aspect-square rounded-[2rem] overflow-hidden shadow-soft"
            style={{ background: product.swatch }}
          >
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              onClick={() => toggleSaved(product.id)}
              className="absolute top-4 right-4 h-11 w-11 rounded-full bg-background/85 backdrop-blur flex items-center justify-center hover:scale-110 transition"
              aria-label="Save"
            >
              <Heart
                className="h-5 w-5"
                fill={isSaved ? "currentColor" : "none"}
                color={isSaved ? "var(--primary)" : "currentColor"}
              />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square rounded-2xl overflow-hidden transition ${
                  activeImg === i ? "ring-2 ring-foreground" : "opacity-80 hover:opacity-100"
                }`}
                style={{ background: product.swatch }}
              >
                <img src={g} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="animate-fade-up">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {product.category} · {product.type}
          </p>
          <h1 className="font-display text-5xl md:text-7xl mt-2 leading-[0.95]">
            {product.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-4 w-4 fill-accent text-accent"
                  fill={s <= Math.round(product.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-5xl">Ksh {formatKES(product.price)}</span>
            {product.originalPrice && (
              <span className="text-base text-muted-foreground line-through">
                Ksh {formatKES(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
            {product.description}
          </p>

          {/* COLOR */}
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-3">COLOR</p>
            <div className="flex gap-3">
              {product.colors.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setColorIdx(i)}
                  className={`h-11 w-11 rounded-full transition ${
                    colorIdx === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "ring-1 ring-border"
                  }`}
                  style={{ background: c }}
                  aria-label={`Color ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">SIZE (EU)</p>
              <a className="text-xs underline text-muted-foreground" href="#">Size guide</a>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setErr("");
                  }}
                  className={`h-12 w-12 rounded-full text-sm font-medium transition border ${
                    size === s
                      ? "bg-foreground text-background border-foreground"
                      : "bg-secondary border-transparent hover:border-foreground/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
          </div>

          {/* QTY + CTA */}
          <div className="mt-7 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-secondary">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-12 w-12 flex items-center justify-center"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="h-12 w-12 flex items-center justify-center"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => buy()}
              className={`flex-1 rounded-full px-6 py-3.5 text-sm font-semibold transition ${
                size
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {size ? `Add to bag · Ksh ${formatKES(product.price * qty)}` : "Select a size"}
            </button>
            <button
              onClick={() => toggleSaved(product.id)}
              className="h-12 w-12 shrink-0 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition"
              aria-label="Save"
            >
              <Heart
                className="h-5 w-5"
                fill={isSaved ? "currentColor" : "none"}
                color={isSaved ? "var(--primary)" : "currentColor"}
              />
            </button>
          </div>

          <button
            onClick={() => buy("checkout")}
            className="mt-3 w-full rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2"
          >
            Buy now with M-Pesa
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <a
            href={`https://wa.me/${(settings.whatsapp_number || "+254795704273").replace(/\D/g, "")}?text=Hi%20Iron%20Step!%20I%27d%20like%20to%20order%20the%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.tagline)}).%20Please%20assist%20me.`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition inline-flex items-center justify-center gap-2.5"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.125.298-.324.446-.486.149-.16.198-.297.298-.496.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order via WhatsApp
          </a>

          {/* FEATURES */}
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {product.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm">
                <span className="h-6 w-6 rounded-full bg-accent/30 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {f}
              </div>
            ))}
          </div>

          {/* TRUST */}
          <div className="mt-8 rounded-3xl bg-secondary/70 p-5 grid grid-cols-3 gap-3 text-center">
            {[
              { Icon: Truck, h: "Free delivery", s: "Over KES 5,000" },
              { Icon: RotateCcw, h: "14-day returns", s: "No questions" },
              { Icon: ShieldCheck, h: "Authentic", s: "Guaranteed" },
            ].map(({ Icon, h, s }) => (
              <div key={h} className="flex flex-col items-center gap-1.5">
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.8} />
                <div className="text-xs font-semibold">{h}</div>
                <div className="text-[11px] text-muted-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 mt-20">
        <h2 className="font-display text-3xl md:text-4xl mb-6">You may also like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
