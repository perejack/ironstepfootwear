import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/Layout";
import { formatKES } from "@/data/products";
import { removeItem, updateQty, useCart } from "@/store/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your bag — Iron Step" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, subtotal } = useCart();
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 350;

  if (cart.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-display text-5xl">Your bag is empty.</h1>
          <p className="mt-3 text-muted-foreground">Find a pair that feels like a second skin.</p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium"
          >
            Browse the shop <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-10">
        <h1 className="font-display text-5xl md:text-6xl">Your bag.</h1>
        <p className="mt-2 text-muted-foreground">
          {cart.length} item{cart.length > 1 ? "s" : ""} · Almost yours.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8 mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-10">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl bg-cream-soft shadow-card"
            >
              <div className="h-24 w-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">EU size {item.size}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center rounded-full bg-background">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="h-8 w-8 flex items-center justify-center"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="h-8 w-8 flex items-center justify-center"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-sm font-medium">KES {formatKES(item.price * item.qty)}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-3xl bg-foreground text-background p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-3xl">Summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="opacity-70">Subtotal</dt>
              <dd>KES {formatKES(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="opacity-70">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : `KES ${formatKES(shipping)}`}</dd>
            </div>
            <div className="flex justify-between text-base pt-3 border-t border-background/20">
              <dt>Total</dt>
              <dd className="font-display text-2xl">KES {formatKES(subtotal + shipping)}</dd>
            </div>
          </dl>
          <Link
            to="/checkout"
            className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-4 text-sm font-medium hover:opacity-90 transition"
          >
            Continue to checkout <ArrowUpRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] opacity-70 text-center">
            Pay with M-Pesa, card, or cash on delivery.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
