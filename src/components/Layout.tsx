import { Link, useLocation } from "react-router-dom";
import { Home, Store, Heart, ShoppingBag, BookOpen, Search, Menu, X, Shield } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/store/cart";
import logo from "@/assets/logo-iron-step.png";

type IconTone = {
  shell: string;
  icon: string;
};

const headerTones: Record<string, IconTone> = {
  search: {
    shell:
      "bg-gradient-to-br from-sky-100/90 to-indigo-100/70 ring-sky-200/60 hover:from-sky-500 hover:to-indigo-600 hover:ring-sky-300/60 hover:shadow-sky-500/25",
    icon: "text-sky-700 group-hover:text-white",
  },
  saved: {
    shell:
      "bg-gradient-to-br from-rose-100/90 to-pink-100/70 ring-rose-200/60 hover:from-rose-500 hover:to-pink-600 hover:ring-rose-300/60 hover:shadow-rose-500/25",
    icon: "text-rose-600 group-hover:text-white",
  },
  cart: {
    shell:
      "bg-gradient-to-br from-orange-100/90 to-amber-100/70 ring-orange-200/60 hover:from-[#e25822] hover:to-[#c44b3f] hover:ring-orange-300/60 hover:shadow-orange-500/25",
    icon: "text-[#c44b3f] group-hover:text-white",
  },
  menu: {
    shell:
      "bg-gradient-to-br from-violet-100/90 to-fuchsia-100/70 ring-violet-200/60 hover:from-violet-600 hover:to-fuchsia-600 hover:ring-violet-300/60 hover:shadow-violet-500/25",
    icon: "text-violet-700 group-hover:text-white",
  },
};

const bottomTones: Record<string, { idle: IconTone; active: IconTone }> = {
  "/": {
    idle: {
      shell: "bg-primary/8 ring-primary/10",
      icon: "text-primary/70",
    },
    active: {
      shell: "bg-gradient-to-br from-primary via-[#a82835] to-[#e25822] shadow-lg shadow-primary/30 ring-primary/30",
      icon: "text-white",
    },
  },
  "/shop": {
    idle: {
      shell: "bg-amber-100/50 ring-amber-200/40",
      icon: "text-amber-700/80",
    },
    active: {
      shell: "bg-gradient-to-br from-amber-500 via-[#e8a317] to-[#f5c842] shadow-lg shadow-amber-500/30 ring-amber-300/40",
      icon: "text-white",
    },
  },
  "/saved": {
    idle: {
      shell: "bg-rose-100/50 ring-rose-200/40",
      icon: "text-rose-600/80",
    },
    active: {
      shell: "bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 shadow-lg shadow-rose-500/30 ring-rose-300/40",
      icon: "text-white",
    },
  },
  "/cart": {
    idle: {
      shell: "bg-orange-100/50 ring-orange-200/40",
      icon: "text-[#c44b3f]/80",
    },
    active: {
      shell: "bg-gradient-to-br from-[#e25822] via-[#d44a2f] to-[#ff6b4a] shadow-lg shadow-orange-500/30 ring-orange-300/40",
      icon: "text-white",
    },
  },
  "/story": {
    idle: {
      shell: "bg-violet-100/50 ring-violet-200/40",
      icon: "text-violet-700/80",
    },
    active: {
      shell: "bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 shadow-lg shadow-violet-500/30 ring-violet-300/40",
      icon: "text-white",
    },
  },
};

const iconShellBase =
  "group relative flex h-10 w-10 items-center justify-center rounded-2xl ring-1 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95";

function HeaderIconButton({
  tone,
  label,
  onClick,
  children,
  badge,
  className = "",
}: {
  tone: IconTone;
  label: string;
  onClick?: () => void;
  children: ReactNode;
  badge?: number;
  className?: string;
}) {
  const shellClass = `${iconShellBase} ${tone.shell} ${className}`;

  const inner = (
    <>
      <span className={`transition-colors duration-300 ${tone.icon}`}>{children}</span>
      {badge ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#e25822] to-[#c44b3f] px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-background">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shellClass} aria-label={label}>
        {inner}
      </button>
    );
  }

  return (
    <span className={shellClass}>
      {inner}
    </span>
  );
}

function HeaderIconLink({
  to,
  tone,
  label,
  badge,
  children,
  className = "",
}: {
  to: string;
  tone: IconTone;
  label: string;
  badge?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} aria-label={label} className={`${iconShellBase} ${tone.shell} ${className}`}>
      <span className={`transition-colors duration-300 ${tone.icon}`}>{children}</span>
      {badge ? (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#e25822] to-[#c44b3f] px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-background">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function BrandWordmark({ size = "header" }: { size?: "header" | "footer" }) {
  const mainClass = size === "footer" ? "brand-wordmark-main text-[1.35rem] sm:text-[1.5rem]" : "brand-wordmark-main";
  const subClass = size === "footer" ? "brand-wordmark-sub text-[0.62rem] sm:text-[0.68rem]" : "brand-wordmark-sub";

  return (
    <span className="brand-wordmark flex flex-col justify-center">
      <span className={mainClass}>
        <span className="brand-wordmark-i">I</span>
        <span className="brand-wordmark-accent">RON</span>STEP
      </span>
      <span className={subClass}>Footwear</span>
      <span className="brand-wordmark-rule" aria-hidden />
    </span>
  );
}

function Logo({ variant = "header" }: { variant?: "header" | "footer" }) {
  const isFooter = variant === "footer";
  const markSize = isFooter ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-12 sm:w-12";
  const imgSize = isFooter ? "h-[6.25rem] sm:h-[7rem]" : "h-[4.75rem] sm:h-[5.25rem]";

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
      aria-label="Iron Step Footwear — Built for the strongest steps"
    >
      <span className={`brand-logo-mark ${markSize}`}>
        <img src={logo} alt="" className={`${imgSize} -mt-0.5`} />
      </span>
      <BrandWordmark size={variant} />
    </Link>
  );
}


function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#f5efdf] md:hidden">
      <div className="shrink-0 px-4 h-[4.75rem] flex items-center justify-between border-b border-border/70 bg-[#f5efdf] shadow-sm">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 active:scale-95 transition-transform"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1 bg-[#f5efdf]">
        {[
          { to: "/shop", label: "Shop all" },
          { to: "/shop?category=Official", label: "Official" },
          { to: "/shop?category=Smart%20Casuals", label: "Smart Casuals" },
          { to: "/shop?category=Sneakers", label: "Sneakers" },
          { to: "/story", label: "Our story" },
          { to: "/saved", label: "Saved" },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={onClose}
            className="border-b border-border/70 py-4 text-3xl font-display text-foreground hover:text-primary transition"
          >
            {l.label}
          </Link>
        ))}
        <Link
          to="/admin"
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2.5 rounded-2xl bg-primary text-primary-foreground px-5 py-4 text-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          <Shield className="h-5 w-5" />
          Admin
        </Link>
      </nav>
    </div>,
    document.body,
  );
}

export function TopBar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
    <header className="sticky top-0 z-40 bg-background/95 border-b border-border/60 supports-[backdrop-filter]:bg-background/90 supports-[backdrop-filter]:backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-8 h-[4.75rem] sm:h-16 flex items-center justify-between gap-2">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/shop" className="hover:text-primary transition">Shop</Link>
          <Link to="/shop?category=Official" className="hover:text-primary transition">Official</Link>
          <Link to="/shop?category=Smart%20Casuals" className="hover:text-primary transition">Smart Casuals</Link>
          <Link to="/shop?category=Sneakers" className="hover:text-primary transition">Sneakers</Link>
          <Link to="/story" className="hover:text-primary transition">Story</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <HeaderIconButton tone={headerTones.search} label="Search" className="hidden sm:flex">
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
          </HeaderIconButton>
          <HeaderIconLink to="/saved" tone={headerTones.saved} label="Saved" className="hidden sm:flex">
            <Heart className="h-[18px] w-[18px]" strokeWidth={2} />
          </HeaderIconLink>
          <HeaderIconLink to="/cart" tone={headerTones.cart} label="Cart" badge={count > 0 ? count : undefined}>
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2} />
          </HeaderIconLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 active:scale-95 transition-transform"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
    <MobileMenu open={open} onClose={closeMenu} />
    </>
  );
}

const bottomLabelColors: Record<string, { idle: string; active: string }> = {
  "/": { idle: "text-primary/60", active: "text-primary font-semibold" },
  "/shop": { idle: "text-amber-700/60", active: "text-amber-600 font-semibold" },
  "/saved": { idle: "text-rose-600/60", active: "text-rose-600 font-semibold" },
  "/cart": { idle: "text-[#c44b3f]/60", active: "text-[#e25822] font-semibold" },
  "/story": { idle: "text-violet-700/60", active: "text-violet-600 font-semibold" },
};

const bottomShellBase =
  "relative flex h-11 w-11 items-center justify-center rounded-2xl ring-1 transition-all duration-300";

function BottomNav() {
  const { count } = useCart();
  const { pathname: path } = useLocation();
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/shop", icon: Store, label: "Shop" },
    { to: "/saved", icon: Heart, label: "Saved" },
    { to: "/cart", icon: ShoppingBag, label: "Cart", badge: count },
    { to: "/story", icon: BookOpen, label: "Story" },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-3 mb-2 rounded-2xl border border-white/60 bg-cream-soft/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06),0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <ul className="grid grid-cols-5 px-1 py-1.5">
          {items.map(({ to, icon: Icon, label, badge }) => {
            const active = path === to;
            const tones = bottomTones[to];
            const tone = active ? tones.active : tones.idle;
            const labelColors = bottomLabelColors[to];
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex flex-col items-center gap-0.5 py-1.5 active:scale-95 transition-transform duration-200"
                >
                  <span
                    className={`${bottomShellBase} ${tone.shell} ${active ? "scale-105" : "group-hover:scale-105 group-hover:shadow-md"}`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] transition-colors duration-300 ${tone.icon}`}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    {badge ? (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#e25822] to-[#c44b3f] px-1 text-[9px] font-bold text-white shadow-md ring-2 ring-cream-soft">
                        {badge}
                      </span>
                    ) : null}
                    {active ? (
                      <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80" />
                    ) : null}
                  </span>
                  <span
                    className={`text-[10px] tracking-wide transition-colors duration-300 ${active ? labelColors.active : labelColors.idle}`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-cream-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Logo variant="footer" />
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
