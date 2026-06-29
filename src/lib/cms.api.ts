import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

/* ---------- Public: read everything the storefront needs ---------- */

export async function getSiteContent() {
  const [cats, prods, sets] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("site_settings").select("key, value"),
  ]);
  if (cats.error) throw new Error(cats.error.message);
  if (prods.error) throw new Error(prods.error.message);
  if (sets.error) throw new Error(sets.error.message);

  const settings: Record<string, string> = {};
  for (const s of sets.data ?? []) settings[s.key] = s.value ?? "";

  return { categories: cats.data ?? [], products: prods.data ?? [], settings };
}

/* ---------- Auth: first signed-up user becomes the admin ---------- */

async function userHasAdminRole(userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return !!data;
}

export async function bootstrapAdmin() {
  const { error } = await supabase.rpc("bootstrap_first_admin");
  if (error) throw new Error(error.message);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false };
  return { isAdmin: await userHasAdminRole(user.id) };
}

/* ---------- Admin mutations (RLS + explicit role check) ---------- */

async function assertAdmin() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized");
  if (!(await userHasAdminRole(user.id))) {
    throw new Error("Forbidden: admin access required");
  }
  return user;
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(120),
  tagline: z.string().max(200).default(""),
  description: z.string().max(3000).default(""),
  category_id: z.string().uuid().nullable(),
  type: z.string().max(60).default(""),
  price: z.number().int().min(1).max(10_000_000),
  original_price: z.number().int().min(1).max(10_000_000).nullable(),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0).max(1_000_000),
  badge: z.string().max(20).nullable(),
  image_url: z.string().max(2000).nullable(),
  swatch: z.string().max(100).nullable(),
  colors: z.array(z.string().max(40)).max(10),
  features: z.array(z.string().max(140)).max(12),
  sizes: z.array(z.number().int().min(20).max(60)).max(20),
  is_new_arrival: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
});

export async function saveProduct(input: z.infer<typeof productSchema>) {
  await assertAdmin();
  const data = productSchema.parse(input);
  const { id, ...fields } = data;
  if (id) {
    const { error } = await supabase.from("products").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  const { data: row, error } = await supabase
    .from("products")
    .insert(fields)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: row.id };
}

export async function deleteProduct(input: { id: string }) {
  await assertAdmin();
  const data = z.object({ id: z.string().uuid() }).parse(input);
  const { error } = await supabase.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  image_url: z.string().max(2000).nullable().optional(),
  sort_order: z.number().int().min(0).max(1000).optional(),
});

export async function saveCategory(input: z.infer<typeof categorySchema>) {
  await assertAdmin();
  const data = categorySchema.parse(input);
  const { id, ...fields } = data;
  if (id) {
    const { error } = await supabase.from("categories").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
    return { id };
  }
  if (!fields.slug) throw new Error("Slug is required for a new category");
  const { data: row, error } = await supabase
    .from("categories")
    .insert({
      name: fields.name,
      slug: fields.slug,
      image_url: fields.image_url ?? null,
      sort_order: fields.sort_order ?? 99,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { id: row.id };
}

export async function deleteCategory(input: { id: string }) {
  await assertAdmin();
  const data = z.object({ id: z.string().uuid() }).parse(input);
  const { error } = await supabase.from("categories").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

const settingsSchema = z.object({
  entries: z
    .array(
      z.object({
        key: z.string().min(1).max(64).regex(/^[a-z0-9_]+$/),
        value: z.string().max(5000),
      }),
    )
    .min(1)
    .max(200),
});

export async function saveSettings(input: z.infer<typeof settingsSchema>) {
  await assertAdmin();
  const data = settingsSchema.parse(input);
  const { error } = await supabase
    .from("site_settings")
    .upsert(data.entries.map((e) => ({ key: e.key, value: e.value })), { onConflict: "key" });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export type SiteContentData = Awaited<ReturnType<typeof getSiteContent>>;
