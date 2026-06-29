import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Upload an image to storage (admin only, enforced by storage policies) and return a long-lived URL. */
export async function uploadSiteImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("site-images")
    .upload(path, file, { contentType: file.type || "image/jpeg" });
  if (error) throw new Error(error.message);

  const { data, error: signErr } = await supabase.storage
    .from("site-images")
    .createSignedUrl(path, TEN_YEARS);
  if (signErr || !data?.signedUrl) throw new Error(signErr?.message ?? "Could not create image URL");

  return data.signedUrl;
}
