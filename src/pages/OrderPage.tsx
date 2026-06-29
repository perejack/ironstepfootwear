import { Link, useParams } from "react-router-dom";
import { Check, Package, Truck, Home as HomeIcon } from "lucide-react";
import { PageShell } from "@/components/Layout";
import { usePageTitle } from "@/lib/use-page-title";

export default function OrderPage() {
  usePageTitle("Order confirmed — Iron Step");
  const { id = "" } = useParams();
  const steps = [
    { Icon: Check, label: "Confirmed", done: true },
    { Icon: Package, label: "Packing", done: true },
    { Icon: Truck, label: "On the way", done: false },
    { Icon: HomeIcon, label: "Delivered", done: false },
  ];
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-5 sm:px-8 py-16 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-fade-up">
          <Check className="h-9 w-9" strokeWidth={2.4} />
        </div>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">Thank you.</h1>
        <p className="mt-3 text-muted-foreground">
          Your order <span className="font-medium text-foreground">#{id}</span> is confirmed. We've
          sent a confirmation to your email and an M-Pesa receipt to your phone.
        </p>

        <div className="mt-12 rounded-3xl bg-cream-soft p-6 md:p-8 shadow-card">
          <div className="grid grid-cols-4 gap-2">
            {steps.map(({ Icon, label, done }, i) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[11px] ${done ? "" : "text-muted-foreground"}`}>{label}</span>
                {i < steps.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Estimated delivery in <span className="text-foreground font-medium">2 business days</span>.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium"
          >
            Keep shopping
          </Link>
          <Link
            to="/"
            className="rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-medium"
          >
            Back home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
