import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ShieldCheck, Smartphone, CreditCard, Banknote } from "lucide-react";
import { PageShell } from "@/components/Layout";
import { formatKES } from "@/data/products";
import { clearCart, useCart } from "@/store/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Iron Step" }] }),
  component: Checkout,
});

const counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Naivasha", "Other"];

function Checkout() {
  const { cart, subtotal } = useCart();
  const nav = useNavigate();
  const shipping = subtotal >= 5000 ? 0 : 350;
  const [pay, setPay] = useState<"mpesa" | "card" | "cod">("mpesa");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const order = Math.random().toString(36).slice(2, 8).toUpperCase();
    clearCart();
    nav({ to: "/order/$id", params: { id: order } });
  };

  if (cart.length === 0) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-5 py-24 text-center">
          <h1 className="font-display text-4xl">Nothing to check out.</h1>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pt-10">
        <h1 className="font-display text-5xl md:text-6xl">Checkout.</h1>
        <p className="mt-2 text-muted-foreground">Three quick steps. Then we lace it up.</p>
      </section>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-6xl px-5 sm:px-8 mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-10"
      >
        <div className="space-y-8">
          <Section step={1} title="Contact">
            <Grid>
              <Field label="Full name" name="name" required />
              <Field label="Phone (M-Pesa)" name="phone" placeholder="07XX XXX XXX" required />
              <Field label="Email" name="email" type="email" required className="sm:col-span-2" />
            </Grid>
          </Section>

          <Section step={2} title="Delivery">
            <Grid>
              <Field label="Address" name="address" required className="sm:col-span-2" />
              <Field label="City / Town" name="city" required />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">County</label>
                <select
                  required
                  className="mt-1.5 w-full rounded-xl bg-secondary px-4 h-12 outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="Nairobi"
                >
                  {counties.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Field label="Notes (optional)" name="notes" className="sm:col-span-2" />
            </Grid>
          </Section>

          <Section step={3} title="Payment">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "mpesa", Icon: Smartphone, label: "M-Pesa" },
                { id: "card", Icon: CreditCard, label: "Card" },
                { id: "cod", Icon: Banknote, label: "Cash on delivery" },
              ].map(({ id, Icon, label }) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-2xl border p-4 flex items-center gap-3 transition ${
                    pay === id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-cream-soft hover:border-foreground/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    className="sr-only"
                    checked={pay === id}
                    onChange={() => setPay(id as typeof pay)}
                  />
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
            {pay === "mpesa" && (
              <p className="mt-4 text-sm text-muted-foreground flex gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                You'll receive an STK push on your phone to confirm KES {formatKES(subtotal + shipping)}.
              </p>
            )}
          </Section>
        </div>

        <aside className="rounded-3xl bg-foreground text-background p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-3xl">Your order</h2>
          <ul className="mt-5 space-y-3 max-h-72 overflow-auto pr-1">
            {cart.map((c) => (
              <li key={c.id} className="flex gap-3 text-sm">
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-background/10 shrink-0">
                  <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{c.name}</div>
                  <div className="opacity-70 text-xs">EU {c.size} · ×{c.qty}</div>
                </div>
                <div>KES {formatKES(c.price * c.qty)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 text-sm border-t border-background/20 pt-4">
            <div className="flex justify-between"><dt className="opacity-70">Subtotal</dt><dd>KES {formatKES(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="opacity-70">Shipping</dt><dd>{shipping ? `KES ${formatKES(shipping)}` : "Free"}</dd></div>
            <div className="flex justify-between text-base pt-3 border-t border-background/20">
              <dt>Total</dt>
              <dd className="font-display text-2xl">KES {formatKES(subtotal + shipping)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            className="mt-7 w-full rounded-full bg-accent text-accent-foreground px-6 py-4 text-sm font-medium hover:opacity-90 transition"
          >
            Place order
          </button>
        </aside>
      </form>
    </PageShell>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-cream-soft p-6 md:p-8 shadow-card">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
          {step}
        </span>
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl bg-secondary px-4 h-12 outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
