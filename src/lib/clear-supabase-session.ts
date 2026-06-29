import { supabase } from "@/integrations/supabase/client";

/** Wipe Supabase auth from this browser (fixes stale sessions after user recreate). */
export async function clearSupabaseSession() {
  try {
    await supabase.auth.signOut({ scope: "global" });
  } catch {
    /* ignore */
  }

  if (typeof window !== "undefined") {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    }
  }
}
