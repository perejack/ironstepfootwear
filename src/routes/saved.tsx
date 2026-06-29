import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved — Iron Step" }] }),
  component: Saved,
});

function Saved() {
  const { saved } = useCart();
  const list = products.filter((p) => saved.includes(p.id));
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pt-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Wishlist</p>
        <h1 className="font-display text-5xl md:text-6xl mt-1">Saved for later.</h1>
      </section>
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        {list.length === 0 ? (
          <div className="rounded-3xl bg-cream-soft p-12 text-center">
            <p className="text-muted-foreground">Tap the heart on any shoe to save it here.</p>
            <Link to="/shop" className="mt-5 inline-block underline">Browse the shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </PageShell>
  );
}
