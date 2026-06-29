import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

/* ---------- Public: read everything the storefront needs ---------- */

export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [cats, prods, sets] = await Promise.all([
    supabaseAdmin.from("categories").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("products").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("site_settings").select("key, value"),
  ]);
  if (cats.error) throw new Error(cats.error.message);
  if (prods.error) throw new Error(prods.error.message);
  if (sets.error) throw new Error(sets.error.message);

  const settings: Record<string, string> = {};
  for (const s of sets.data ?? []) settings[s.key] = s.value ?? "";

  return { categories: cats.data ?? [], products: prods.data ?? [], settings };
});

/* ---------- Auth: first signed-up user becomes the admin ---------- */

async function userHasAdminRole(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return !!data;
}

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase.rpc("bootstrap_first_admin");
    return { isAdmin: await userHasAdminRole(context.supabase, context.userId) };
  });

/* ---------- Admin mutations (RLS + explicit role check) ---------- */

async function assertAdmin(context: {
  supabase: SupabaseClient<Database>;
  userId: string;
}) {
  if (!(await userHasAdminRole(context.supabase, context.userId))) {
    throw new Error("Forbidden: admin access required");
  }
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

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("products").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: row, error } = await context.supabase
      .from("products")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

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

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => categorySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { id, ...fields } = data;
    if (id) {
      const { error } = await context.supabase.from("categories").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    if (!fields.slug) throw new Error("Slug is required for a new category");
    const { data: row, error } = await context.supabase
      .from("categories")
      .insert({ name: fields.name, slug: fields.slug, image_url: fields.image_url ?? null, sort_order: fields.sort_order ?? 99 })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

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

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => settingsSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("site_settings")
      .upsert(data.entries.map((e) => ({ key: e.key, value: e.value })), { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
