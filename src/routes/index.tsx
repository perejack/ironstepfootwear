import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Quote,
  Smartphone,
  Package,
  Sparkles,
  Instagram,
} from "lucide-react";
import { PageShell } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { formatKES, type Product } from "@/data/products";
import { useSiteContent, splitHeadline } from "@/lib/content";
import heroShoe from "@/assets/hero-shoe.jpg";
import prodMara from "@/assets/product-mara.jpg";
import prodRift from "@/assets/product-rift.jpg";
import prodNairobi from "@/assets/product-nairobi.jpg";
import prodSavanna from "@/assets/product-savanna.jpg";
import prodKibera from "@/assets/product-kibera.jpg";
import stepPick from "@/assets/step-pick.jpg";
import stepPay from "@/assets/step-pay.jpg";
import stepDeliver from "@/assets/step-deliver.jpg";
import avatarBrian from "@/assets/avatar-brian.jpg";
import avatarAisha from "@/assets/avatar-aisha.jpg";
import avatarPatrick from "@/assets/avatar-patrick.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Iron Step Footwear — Footwear made for Kenyan streets" },
      {
        name: "description",
        content:
          "Iron Step Footwear designs and ships Official, Smart Casual and Sneaker footwear across Kenya. Pay with M-Pesa. Delivered nationwide.",
      },
      { property: "og:title", content: "Iron Step Footwear" },
      {
        property: "og:description",
        content: "Premium footwear, designed in Nairobi. Pay with M-Pesa.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { products, categories, settings, newArrivals } = useSiteContent();
  const [headA, headB] = splitHeadline(settings.hero_headline);
  const heroImg = settings.hero_image_url || heroShoe;
  const heroProduct = products.find((p) => p.id === "iron-step-icon") ?? products[0];

  const safeJson = <T,>(key: string, fallback: T): T => {
    const raw = settings[key];
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const heroBadgeText = settings.hero_badge_text || "New · Autumn drop 026";
  const heroPrimaryCta = settings.hero_primary_cta_text || "Shop the collection";
  const heroSecondaryCta = settings.hero_secondary_cta_text || "Our story";
  const stats = safeJson<[string, string][]>("home_stats_json", [
    ["12", "prototypes per shoe"],
    ["48h", "Nairobi delivery"],
    ["100%", "M-Pesa checkout"],
  ]);
  const marqueeCities = safeJson<string[]>("home_marquee_cities_json", [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Eldoret",
    "Nakuru",
    "Thika",
    "Naivasha",
  ]);
  const promise = safeJson<{ title: string; description: string }[]>("home_promise_json", [
    { title: "Free delivery", description: "Free shipping countrywide on orders above KES 5,000." },
    { title: "M-Pesa secure", description: "Pay with M-Pesa, card or on delivery — your choice." },
    { title: "14-day returns", description: "Try them at home. If they don't fit, we collect for free." },
  ]);
  const spotlightKicker = settings.spotlight_kicker || "Spotlight";
  const spotlightImg = settings.spotlight_image_url || prodMara;
  const spotlightFeatures = safeJson<string[]>("spotlight_features_json", [
    "Made for Nairobi's pace",
    "Styles for every occasion",
    "Comfort that doesn't compromise",
    "Affordable Kenyan pricing",
  ]);
  const spotlightPrimaryCta = settings.spotlight_primary_cta_text || "Explore the Collection";
  const categoriesKicker = settings.categories_kicker || "Shop by";
  const categoriesTitle = settings.categories_title || "Categories";
  const categoriesViewAllText = settings.categories_view_all_text || "View all";
  const howKicker = settings.how_it_works_kicker || "How it works";
  const howTitle = safeJson<{ before: string; highlight: string }>("how_it_works_title_json", {
    before: "From cart to doorstep in",
    highlight: "three steps",
  });
  const howSteps = safeJson<{ step: string; title: string; description: string }[]>("how_steps_json", [
    {
      step: "01",
      title: "Pick your pair",
      description: "Browse Official, Smart Casuals or Sneakers. Save favourites to revisit later.",
    },
    {
      step: "02",
      title: "Pay with M-Pesa",
      description: "Lipa na M-Pesa, card or pay on delivery. Order confirmed in seconds.",
    },
    {
      step: "03",
      title: "Delivered to you",
      description: "Same-day in Nairobi. 24–48 hours countrywide via our trusted couriers.",
    },
  ]);
  const howImgs = [
    settings.how_step_1_image_url || stepPick,
    settings.how_step_2_image_url || stepPay,
    settings.how_step_3_image_url || stepDeliver,
  ];
  const testimonialsKicker = settings.testimonials_kicker || "Word on the street";
  const testimonialsTitle = settings.testimonials_title || "Loved across Kenya";
  const testimonialsRating = settings.testimonials_rating_text || "4.9";
  const testimonialsReviews = settings.testimonials_reviews_text || "· 1,240+ reviews";
  const testimonials = safeJson<{ quote: string; name: string; location: string }[]>("testimonials_json", [
    {
      quote: "The Mara Oxford fits like it was made for me. Quality you can't find on Biashara Street.",
      name: "Brian K.",
      location: "Westlands, Nairobi",
    },
    {
      quote: "Ordered in the evening, delivered next morning to Kisumu. The sneakers are crazy comfortable.",
      name: "Aisha M.",
      location: "Kisumu",
    },
    {
      quote: "Finally a Kenyan brand that ships properly and the leather actually lasts. Repeat customer.",
      name: "Patrick O.",
      location: "Eldoret",
    },
  ]);
  const testimonialAvatars = [
    settings.testimonial_1_avatar_url || avatarBrian,
    settings.testimonial_2_avatar_url || avatarAisha,
    settings.testimonial_3_avatar_url || avatarPatrick,
  ];

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--mustard), transparent)" }}
        />
        <div
          aria-hidden
          className="absolute top-40 -left-32 h-[360px] w-[360px] rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--clay), transparent)" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-10 pb-16 md:pt-20 md:pb-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {heroBadgeText}
            </div>
            <h1 className="mt-5 font-display text-[44px] leading-[1.02] sm:text-6xl md:text-7xl text-balance">
              {headA}
              {headB && <span className="italic text-primary"> {headB}</span>}
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">{settings.hero_subtext}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90 transition shadow-soft"
              >
                {heroPrimaryCta}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/story"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-medium hover:bg-secondary transition"
              >
                {heroSecondaryCta}
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {stats.map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl">{n}</dt>
                  <dd className="text-xs text-muted-foreground mt-1">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div
              className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-soft"
              style={{ background: "linear-gradient(160deg, var(--mustard), var(--cream-soft))" }}
            >
              <img
                src={heroImg}
                alt="Iron Step featured shoe"
                width={1600}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover animate-float"
              />
              {heroProduct && (
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-background/85 backdrop-blur px-4 py-3">
                  <div>
                    <div className="font-display text-lg leading-none">{heroProduct.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {heroProduct.tagline || heroProduct.type}
                    </div>
                  </div>
                  <Link
                    to="/product/$id"
                    params={{ id: heroProduct.id }}
                    className="rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium"
                  >
                    KES {formatKES(heroProduct.price)}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-border/60 bg-cream-soft overflow-hidden">
        <div className="flex gap-12 py-4 whitespace-nowrap animate-marquee font-display text-2xl tracking-wide">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 px-6">
              {marqueeCities.map((c) => (
                <span key={c} className="flex items-center gap-12">
                  {c}
                  <span className="text-primary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{categoriesKicker}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-1">{categoriesTitle}</h2>
          </div>
          <Link to="/shop" className="text-sm underline underline-offset-4 hover:text-primary">
            {categoriesViewAllText}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.name }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between text-background">
                <span className="font-display text-2xl">{c.name}</span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <FeaturedProducts products={newArrivals} filters={categories.map((c) => c.name)} />


      {/* PROMISE STRIP */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-14 grid md:grid-cols-3 gap-8 shadow-soft">
          {promise.map(({ title, description }, idx) => {
            const Icon = [Truck, ShieldCheck, RotateCcw][idx] ?? Truck;
            return (
              <div key={title} className="flex gap-4">
                <Icon className="h-7 w-7 shrink-0 mt-1 opacity-90" strokeWidth={1.5} />
              <div>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-1 text-sm opacity-80 max-w-xs">{description}</p>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* SPOTLIGHT — split feature */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
          <div
            className="relative rounded-[2.5rem] overflow-hidden min-h-[420px] shadow-card"
            style={{ background: "linear-gradient(140deg, var(--clay), var(--mustard))" }}
          >
            <img
              src={spotlightImg}
              alt="Iron Step lineup"
              className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-90"
              loading="lazy"
            />
            <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-[11px] tracking-widest uppercase">
              <Sparkles className="h-3 w-3" /> Iron Step
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{spotlightKicker}</p>
            <h2 className="font-display text-4xl md:text-6xl mt-3 leading-[1.02]">
              {headA} {headB && <span className="italic text-primary">{headB}</span>}
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">{settings.hero_subtext}</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              {spotlightFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition"
              >
                {spotlightPrimaryCta} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3.5 text-sm font-medium hover:bg-secondary transition"
              >
                Find Your Style
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cream-soft border-y border-border/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{howKicker}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-1">
              {howTitle.before} <span className="italic text-primary">{howTitle.highlight}</span>
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {howSteps.slice(0, 3).map(({ step, title: h, description: p }, i) => {
              const Icon = [Sparkles, Smartphone, Package][i] ?? Sparkles;
              const img = howImgs[i] ?? stepPick;
              return (
              <div
                key={step}
                className="group relative rounded-3xl bg-background overflow-hidden shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={img}
                    alt={h}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 inline-flex items-center justify-center rounded-full bg-background/95 backdrop-blur w-10 h-10 font-display text-base">
                    {step}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                    <h3 className="font-display text-2xl">{h}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{testimonialsKicker}</p>
            <h2 className="font-display text-4xl md:text-5xl mt-1">{testimonialsTitle}</h2>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{testimonialsRating}</span>
            <span className="text-muted-foreground">{testimonialsReviews}</span>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((t, i) => (
            <figure
              key={i}
              className="rounded-3xl border border-border/60 bg-background p-7 flex flex-col animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 text-lg leading-snug font-display">"{t.quote}"</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonialAvatars[i] ?? avatarBrian}
                    alt={t.name}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-muted-foreground text-xs">{t.location}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* LOOKBOOK / INSTAGRAM */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">@ironstep.ke</p>
            <h2 className="font-display text-4xl md:text-5xl mt-1">On the street</h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm underline underline-offset-4 hover:text-primary">
            <Instagram className="h-4 w-4" /> Follow
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[prodNairobi, prodRift, prodSavanna, prodKibera].map((img, i) => (
            <a key={i} href="#" className="group relative aspect-square rounded-2xl overflow-hidden">
              <img
                src={img}
                alt="Iron Step on the street"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                <Instagram className="h-6 w-6 text-background opacity-0 group-hover:opacity-100 transition" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WHATSAPP GROUP */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 pt-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background p-8 md:p-16">
          <div
            aria-hidden
            className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-40"
            style={{ background: "radial-gradient(closest-side, #25D366, transparent)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(closest-side, var(--mustard), transparent)" }}
          />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 px-3 py-1 text-[11px] tracking-widest uppercase text-[#25D366]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                </span>
                Iron Step VIP · WhatsApp
              </div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                New drops sell out fast.{" "}
                <span className="italic" style={{ color: "var(--mustard)" }}>
                  Don't miss your size.
                </span>
              </h2>
              <p className="mt-4 text-sm opacity-80 max-w-md">
                Join our WhatsApp group and be the first to know — new arrivals, restocks, flash
                deals, and size alerts. Your size won't wait. Neither should you.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-start md:items-end">
              <a
                href={settings.whatsapp_group_url || "https://chat.whatsapp.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 rounded-full bg-[#25D366] text-white px-7 py-4 text-base font-medium shadow-[0_10px_40px_-10px_rgba(37,211,102,0.6)] hover:shadow-[0_15px_50px_-10px_rgba(37,211,102,0.8)] hover:scale-105 transition-all"
              >
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 blur-xl group-hover:opacity-70 -z-10" />
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Join the WhatsApp Group
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <p className="text-xs opacity-60 max-w-xs text-left md:text-right">
                Free to join · Instant alerts · No spam, only the good stuff
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function FeaturedProducts({ products, filters }: { products: Product[]; filters: string[] }) {
  const [active, setActive] = useState("All");
  const allFilters = ["All", ...filters];
  const list = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-6 md:py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">This week</p>
          <h2 className="font-display text-4xl md:text-5xl mt-1">New arrivals</h2>
        </div>
        <Link to="/shop" className="text-sm underline underline-offset-4 hover:text-primary">
          Shop all
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {allFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition border ${
              active === f
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-foreground/20 hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
        {list.slice(0, 6).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

