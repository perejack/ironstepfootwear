import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Store, Heart, ShoppingBag, BookOpen, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import logoAsset from "@/assets/logo-iron-step.png.asset.json";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
      <img
        src={logoAsset.url}
        alt="Iron Step Footwear"
        className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-[0_2px_8px_rgba(236,72,153,0.35)] group-hover:scale-110 transition-transform duration-300"
      />
      <span className="font-display text-lg sm:text-xl tracking-[0.18em] sm:tracking-[0.22em] font-medium leading-none bg-gradient-to-r from-[#ff6a3d] via-[#ec4899] to-[#6366f1] bg-clip-text text-transparent">
        IRON&nbsp;STEP
      </span>
    </Link>
  );
}


export function TopBar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/shop" className="hover:text-primary transition">Shop</Link>
          <Link to="/shop" search={{ category: "Official" }} className="hover:text-primary transition">Official</Link>
          <Link to="/shop" search={{ category: "Smart Casuals" }} className="hover:text-primary transition">Smart Casuals</Link>
          <Link to="/shop" search={{ category: "Sneakers" }} className="hover:text-primary transition">Sneakers</Link>
          <Link to="/story" className="hover:text-primary transition">Story</Link>
        </nav>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-secondary transition" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/saved" className="p-2 rounded-full hover:bg-secondary transition" aria-label="Saved">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-secondary transition" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-secondary transition"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-up">
          <div className="px-5 h-16 flex items-center justify-between border-b border-border/60">
            <Logo />
            <button onClick={() => setOpen(false)} className="p-2" aria-label="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="px-6 py-10 flex flex-col gap-6 text-3xl font-display">
            {[
              { to: "/shop", label: "Shop all" },
              { to: "/shop", label: "Official", search: { category: "Official" } },
              { to: "/shop", label: "Smart Casuals", search: { category: "Smart Casuals" } },
              { to: "/shop", label: "Sneakers", search: { category: "Sneakers" } },
              { to: "/story", label: "Our story" },
            ].map((l, i) => (
              <Link
                key={i}
                to={l.to as "/shop"}
                search={l.search as any}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 pb-4 hover:text-primary transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function BottomNav() {
  const { count } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/saved", icon: Heart, label: "Saved" },
    { to: "/cart", icon: ShoppingBag, label: "Cart", badge: count },
    { to: "/story", icon: BookOpen, label: "Story" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-soft/95 backdrop-blur border-t border-border/60 pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {items.map(({ to, icon: Icon, label, badge }) => {
          const active = path === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className="relative flex flex-col items-center gap-1 py-2.5 text-[11px]"
              >
                <span className={`relative ${active ? "text-primary" : "text-foreground/70"}`}>
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.6} />
                  {badge ? (
                    <span className="absolute -top-1 -right-2 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                      {badge}
                    </span>
                  ) : null}
                </span>
                <span className={active ? "text-primary font-medium" : "text-foreground/70"}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Footwear made for Kenyan streets — designed in Nairobi, finished by hand, shipped nationwide.
          </p>
        </div>
        {[
          { h: "Shop", links: ["Official", "Smart Casuals", "Sneakers"] },
          { h: "Studio", links: ["Our story", "Craftsmanship", "Stockists", "Journal"] },
          { h: "Help", links: ["Sizing", "Shipping & M-Pesa", "Returns", "Contact"] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-4">{col.h}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => <li key={l}><a className="hover:text-foreground" href="#">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Iron Step Footwear · Nairobi, Kenya
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
