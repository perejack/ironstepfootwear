import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { PageShell } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useSiteContent } from "@/lib/content";
import { usePageTitle } from "@/lib/use-page-title";

export default function ShopPage() {
  usePageTitle("Shop — Iron Step Footwear");
  const [searchParams] = useSearchParams();
  const active = searchParams.get("category") || "All";
  const navigate = useNavigate();
  const { products, categories } = useSiteContent();
  const [sort, setSort] = useState<"new" | "low" | "high">("new");

  const cats = ["All", ...categories.map((c) => c.name)];

  let list = active === "All" ? products : products.filter((p) => p.category === active);
  if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-8 md:pt-14">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Collection</p>
        <h1 className="font-display text-5xl md:text-7xl mt-2">The Shop.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {list.length} pieces, hand-finished in small batches and shipped across Kenya.
        </p>
      </section>

      <section className="sticky top-16 z-30 bg-background/85 backdrop-blur border-b border-border/60 mt-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto">
          <div className="flex gap-2 flex-1 min-w-0">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => {
                  const next = c === "All" ? "/shop" : `/shop?category=${encodeURIComponent(c)}`;
                  navigate(next, { replace: true });
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition ${
                  active === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="shrink-0 rounded-full bg-secondary text-xs px-3 py-2 border-0 outline-none"
          >
            <option value="new">Newest</option>
            <option value="low">Price: low</option>
            <option value="high">Price: high</option>
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
        {list.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground py-16">
            No products in this category yet.
          </p>
        )}
      </section>
    </PageShell>
  );
}
