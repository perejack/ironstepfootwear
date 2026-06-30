import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, LogOut, Package, Settings2, Shapes, ShieldX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearSupabaseSession } from "@/lib/clear-supabase-session";
import { useSiteContent } from "@/lib/content";
import { SiteTab } from "@/components/admin/SiteTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { usePageTitle } from "@/lib/use-page-title";
import { TEST_SUPABASE } from "@/lib/test-config";

const SUPABASE_PROJECT_ID =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? TEST_SUPABASE.projectId;

async function checkAdminAccess() {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      await clearSupabaseSession();
      throw new Error("Session expired or user was recreated. Please sign in again.");
    }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    await clearSupabaseSession();
    throw userError;
  }
  if (!user) return { isAdmin: false, userId: null as string | null, email: null as string | null };

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw error;

  return { isAdmin: !!data, userId: user.id, email: user.email ?? null };
}

type Tab = "site" | "categories" | "products";

const tabs: { id: Tab; label: string; Icon: typeof Settings2 }[] = [
  { id: "site", label: "Site & Hero", Icon: Settings2 },
  { id: "categories", label: "Categories", Icon: Shapes },
  { id: "products", label: "Products", Icon: Package },
];

export default function AdminPage() {
  usePageTitle("Admin Studio — Iron Step Footwear");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("site");
  const content = useSiteContent();

  const adminCheck = useQuery({
    queryKey: ["admin-check"],
    queryFn: checkAdminAccess,
    retry: false,
    refetchOnMount: "always",
  });

  const userEmail = adminCheck.data?.email ?? null;
  const userId = adminCheck.data?.userId ?? null;

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await clearSupabaseSession();
    navigate("/auth", { replace: true });
  };

  if (adminCheck.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (adminCheck.isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <ShieldX className="h-10 w-10 mx-auto text-destructive" />
          <h1 className="mt-4 font-display text-3xl">Admin check failed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {adminCheck.error instanceof Error ? adminCheck.error.message : "Could not verify admin access."}
          </p>
          <button
            onClick={() => adminCheck.refetch()}
            className="mt-6 mr-2 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium"
          >
            Try again
          </button>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  if (!adminCheck.data?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <ShieldX className="h-10 w-10 mx-auto text-destructive" />
          <h1 className="mt-4 font-display text-3xl">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account doesn't have permission to edit the store.
          </p>
          {userEmail && (
            <p className="mt-3 text-xs text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          )}
          {userId && (
            <p className="mt-2 text-[11px] text-muted-foreground break-all">
              Session user ID: <span className="font-mono text-foreground">{userId}</span>
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground text-left">
            <strong className="text-foreground">Do not use the session user ID in SQL.</strong> If
            Supabase says that ID is missing from <code className="text-[11px]">auth.users</code>,
            it is a dead session. Click &quot;Clear session&quot; below, then sign in again.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground text-left">
            App Supabase project:{" "}
            <span className="font-mono text-foreground">{SUPABASE_PROJECT_ID}</span> — confirm this
            matches the project open in your Supabase dashboard.
          </p>
          <p className="mt-3 text-xs text-muted-foreground text-left">
            In Supabase SQL Editor, list users first:
          </p>
          <pre className="mt-2 rounded-xl bg-secondary p-3 text-left text-[10px] leading-relaxed overflow-x-auto">
{`SELECT id, email FROM auth.users;

-- Then grant admin by email (not by session id):
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users
WHERE email = 'ironstepfootwear@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;`}
          </pre>
          <button
            onClick={signOut}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" /> Clear session &amp; sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-soft">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border/60">
        <div className="mx-auto max-w-5xl px-5 h-16 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display text-xl leading-none truncate">Iron Step · Studio</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Edit your storefront</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-secondary transition"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium hover:opacity-90 transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        {/* Desktop tabs */}
        <div className="hidden sm:block border-t border-border/40">
          <div className="mx-auto max-w-5xl px-5 flex gap-1 py-2">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                  tab === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-6 pb-28 sm:pb-12">
        {!content.loaded ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {tab === "site" && <SiteTab key="loaded" settings={content.settings} />}
            {tab === "categories" && <CategoriesTab categories={content.raw?.categories ?? []} />}
            {tab === "products" && (
              <ProductsTab
                products={content.raw?.products ?? []}
                categories={content.raw?.categories ?? []}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border/60">
        <div className="grid grid-cols-3">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition ${
                tab === id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
