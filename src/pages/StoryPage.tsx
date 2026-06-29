import { Link } from "react-router-dom";
import { PageShell } from "@/components/Layout";
import { usePageTitle } from "@/lib/use-page-title";
import hero from "@/assets/hero-shoe.jpg";
import catBoots from "@/assets/cat-boots.jpg";

export default function StoryPage() {
  usePageTitle("Our story — Iron Step Footwear");
  return (
    <PageShell>
      <section className="mx-auto max-w-4xl px-5 sm:px-8 pt-14 pb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Our story</p>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-[1.05] text-balance">
          A small workshop in Nairobi.
          <span className="italic text-primary"> Big plans.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Iron Step began in 2021 in a one-room workshop off Ngong Road. Three friends, one
          sewing machine, and a stubborn idea: that footwear made for Kenya should be designed
          here, not imported as an afterthought.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 grid md:grid-cols-2 gap-6">
        <img src={hero} alt="" className="rounded-3xl aspect-[4/5] object-cover w-full" />
        <img src={catBoots} alt="" className="rounded-3xl aspect-[4/5] object-cover w-full" />
      </section>

      <section className="mx-auto max-w-3xl px-5 sm:px-8 py-16 space-y-6 text-lg leading-relaxed text-foreground/85">
        <p>
          Today we still make every pair in small batches. Each shoe goes through twelve
          prototypes before it reaches you, and every order is hand-checked, hand-wrapped and
          sent out with a note from the maker.
        </p>
        <p>
          We work with leather sourced from East African tanneries, and our soles are moulded in
          a small partner factory in Athi River. Nothing about this is mass production. It
          shouldn't be.
        </p>
        <p className="font-display text-2xl text-primary">
          "We're building the shoes our grandfathers would have wanted to wear."
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm font-medium"
        >
          Shop the collection
        </Link>
      </section>
    </PageShell>
  );
}
