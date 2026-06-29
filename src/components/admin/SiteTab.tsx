import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveSettings } from "@/lib/cms.functions";
import { Field, ImageField, inputCls } from "./ImageField";
import heroShoe from "@/assets/hero-shoe.jpg";

export function SiteTab({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({ ...settings });
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const save = useServerFn(saveSettings);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setBusy(true);
    try {
      await save({
        data: { entries: Object.entries(form).map(([key, value]) => ({ key, value })) },
      });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Site content saved — it's live!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-background p-5 md:p-7 space-y-4">
        <h2 className="font-display text-2xl">Hero section</h2>
        <Field label="Badge text">
          <input
            className={inputCls}
            value={form.hero_badge_text ?? ""}
            onChange={(e) => set("hero_badge_text", e.target.value)}
            placeholder='e.g. "New · Autumn drop 026"'
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputCls}
            value={form.hero_headline ?? ""}
            onChange={(e) => set("hero_headline", e.target.value)}
          />
        </Field>
        <p className="text-[11px] text-muted-foreground -mt-2">
          Tip: the words after the first full stop get the red italic style.
        </p>
        <Field label="Subtext">
          <textarea
            rows={3}
            className={inputCls}
            value={form.hero_subtext ?? ""}
            onChange={(e) => set("hero_subtext", e.target.value)}
          />
        </Field>
        <Field label="Hero image">
          <ImageField
            value={form.hero_image_url || null}
            fallback={heroShoe}
            aspect="aspect-square max-w-xs"
            onChange={(url) => set("hero_image_url", url)}
            label="Replace hero image"
          />
        </Field>
        <Field label="Primary button text">
          <input
            className={inputCls}
            value={form.hero_primary_cta_text ?? ""}
            onChange={(e) => set("hero_primary_cta_text", e.target.value)}
          />
        </Field>
        <Field label="Secondary button text">
          <input
            className={inputCls}
            value={form.hero_secondary_cta_text ?? ""}
            onChange={(e) => set("hero_secondary_cta_text", e.target.value)}
          />
        </Field>
      </section>

      <section className="rounded-3xl border border-border/60 bg-background p-5 md:p-7 space-y-4">
        <h2 className="font-display text-2xl">Homepage content</h2>
        <Field label="Stats (JSON)">
          <textarea
            rows={4}
            className={inputCls}
            value={form.home_stats_json ?? ""}
            onChange={(e) => set("home_stats_json", e.target.value)}
            placeholder='[["12","prototypes per shoe"],["48h","Nairobi delivery"],["100%","M-Pesa checkout"]]'
          />
        </Field>
        <Field label="Marquee cities (JSON)">
          <textarea
            rows={3}
            className={inputCls}
            value={form.home_marquee_cities_json ?? ""}
            onChange={(e) => set("home_marquee_cities_json", e.target.value)}
            placeholder='["Nairobi","Mombasa","Kisumu"]'
          />
        </Field>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Categories kicker">
            <input
              className={inputCls}
              value={form.categories_kicker ?? ""}
              onChange={(e) => set("categories_kicker", e.target.value)}
            />
          </Field>
          <Field label="Categories title">
            <input
              className={inputCls}
              value={form.categories_title ?? ""}
              onChange={(e) => set("categories_title", e.target.value)}
            />
          </Field>
          <Field label="Categories “View all” text">
            <input
              className={inputCls}
              value={form.categories_view_all_text ?? ""}
              onChange={(e) => set("categories_view_all_text", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Promise strip cards (JSON)">
          <textarea
            rows={5}
            className={inputCls}
            value={form.home_promise_json ?? ""}
            onChange={(e) => set("home_promise_json", e.target.value)}
            placeholder='[{"title":"Free delivery","description":"..."},{"title":"M-Pesa secure","description":"..."}]'
          />
        </Field>
        <Field label="Spotlight kicker">
          <input
            className={inputCls}
            value={form.spotlight_kicker ?? ""}
            onChange={(e) => set("spotlight_kicker", e.target.value)}
          />
        </Field>
        <Field label="Spotlight image">
          <ImageField
            value={form.spotlight_image_url || null}
            fallback={heroShoe}
            aspect="aspect-[4/3] max-w-md"
            onChange={(url) => set("spotlight_image_url", url)}
            label="Replace spotlight image"
          />
        </Field>
        <Field label="Spotlight features (JSON)">
          <textarea
            rows={4}
            className={inputCls}
            value={form.spotlight_features_json ?? ""}
            onChange={(e) => set("spotlight_features_json", e.target.value)}
            placeholder='["Feature one","Feature two"]'
          />
        </Field>
        <Field label="Spotlight button text">
          <input
            className={inputCls}
            value={form.spotlight_primary_cta_text ?? ""}
            onChange={(e) => set("spotlight_primary_cta_text", e.target.value)}
          />
        </Field>
        <div className="h-px bg-border/60" />
        <Field label="How it works — kicker">
          <input
            className={inputCls}
            value={form.how_it_works_kicker ?? ""}
            onChange={(e) => set("how_it_works_kicker", e.target.value)}
          />
        </Field>
        <Field label="How it works — title (JSON)">
          <textarea
            rows={3}
            className={inputCls}
            value={form.how_it_works_title_json ?? ""}
            onChange={(e) => set("how_it_works_title_json", e.target.value)}
            placeholder='{"before":"From cart to doorstep in","highlight":"three steps"}'
          />
        </Field>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Step 1 image">
            <ImageField
              value={form.how_step_1_image_url || null}
              fallback={heroShoe}
              aspect="aspect-[5/4]"
              onChange={(url) => set("how_step_1_image_url", url)}
              label="Replace step 1"
            />
          </Field>
          <Field label="Step 2 image">
            <ImageField
              value={form.how_step_2_image_url || null}
              fallback={heroShoe}
              aspect="aspect-[5/4]"
              onChange={(url) => set("how_step_2_image_url", url)}
              label="Replace step 2"
            />
          </Field>
          <Field label="Step 3 image">
            <ImageField
              value={form.how_step_3_image_url || null}
              fallback={heroShoe}
              aspect="aspect-[5/4]"
              onChange={(url) => set("how_step_3_image_url", url)}
              label="Replace step 3"
            />
          </Field>
        </div>
        <Field label="How it works — steps (JSON)">
          <textarea
            rows={6}
            className={inputCls}
            value={form.how_steps_json ?? ""}
            onChange={(e) => set("how_steps_json", e.target.value)}
            placeholder='[{"step":"01","title":"Pick your pair","description":"..."},{"step":"02","title":"Pay with M-Pesa","description":"..."}]'
          />
        </Field>
        <div className="h-px bg-border/60" />
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Testimonials — kicker">
            <input
              className={inputCls}
              value={form.testimonials_kicker ?? ""}
              onChange={(e) => set("testimonials_kicker", e.target.value)}
            />
          </Field>
          <Field label="Testimonials — title">
            <input
              className={inputCls}
              value={form.testimonials_title ?? ""}
              onChange={(e) => set("testimonials_title", e.target.value)}
            />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Rating text">
            <input
              className={inputCls}
              value={form.testimonials_rating_text ?? ""}
              onChange={(e) => set("testimonials_rating_text", e.target.value)}
              placeholder="4.9"
            />
          </Field>
          <Field label="Reviews text">
            <input
              className={inputCls}
              value={form.testimonials_reviews_text ?? ""}
              onChange={(e) => set("testimonials_reviews_text", e.target.value)}
              placeholder="· 1,240+ reviews"
            />
          </Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Avatar 1">
            <ImageField
              value={form.testimonial_1_avatar_url || null}
              fallback={heroShoe}
              aspect="aspect-square"
              onChange={(url) => set("testimonial_1_avatar_url", url)}
              label="Replace avatar 1"
            />
          </Field>
          <Field label="Avatar 2">
            <ImageField
              value={form.testimonial_2_avatar_url || null}
              fallback={heroShoe}
              aspect="aspect-square"
              onChange={(url) => set("testimonial_2_avatar_url", url)}
              label="Replace avatar 2"
            />
          </Field>
          <Field label="Avatar 3">
            <ImageField
              value={form.testimonial_3_avatar_url || null}
              fallback={heroShoe}
              aspect="aspect-square"
              onChange={(url) => set("testimonial_3_avatar_url", url)}
              label="Replace avatar 3"
            />
          </Field>
        </div>
        <Field label="Testimonials (JSON)">
          <textarea
            rows={7}
            className={inputCls}
            value={form.testimonials_json ?? ""}
            onChange={(e) => set("testimonials_json", e.target.value)}
            placeholder='[{"quote":"...","name":"...","location":"..."},{"quote":"...","name":"...","location":"..."}]'
          />
        </Field>
        <p className="text-[11px] text-muted-foreground">
          Tip: JSON fields must be valid JSON (use double quotes). If JSON is invalid, the site will fall back to
          defaults.
        </p>
      </section>

      <section className="rounded-3xl border border-border/60 bg-background p-5 md:p-7 space-y-4">
        <h2 className="font-display text-2xl">WhatsApp & extras</h2>
        <Field label="WhatsApp order number">
          <input
            className={inputCls}
            value={form.whatsapp_number ?? ""}
            onChange={(e) => set("whatsapp_number", e.target.value)}
            placeholder="+2547..."
          />
        </Field>
        <Field label="WhatsApp group link">
          <input
            className={inputCls}
            value={form.whatsapp_group_url ?? ""}
            onChange={(e) => set("whatsapp_group_url", e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
          />
        </Field>
        <Field label="Announcement">
          <input
            className={inputCls}
            value={form.announcement ?? ""}
            onChange={(e) => set("announcement", e.target.value)}
          />
        </Field>
      </section>

      <button
        onClick={submit}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save changes
      </button>
    </div>
  );
}
