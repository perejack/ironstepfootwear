import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bootstrapAdmin } from "@/lib/cms.api";
import { clearSupabaseSession } from "@/lib/clear-supabase-session";
import { usePageTitle } from "@/lib/use-page-title";

export default function AuthPage() {
  usePageTitle("Admin Sign In — Iron Step Footwear");
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!error && data.user) {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (!refreshError) {
          navigate("/admin", { replace: true });
          return;
        }
      }
      await clearSupabaseSession();
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("Enter your email and a password of at least 6 characters");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Check your inbox — confirm your email, then come back and sign in.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
      try {
        await bootstrapAdmin();
      } catch {
        /* role check happens again on the admin page */
      }
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="relative rounded-[2rem] border border-border/60 bg-background shadow-soft p-8 md:p-10 overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-50"
              style={{ background: "radial-gradient(closest-side, var(--mustard), transparent)" }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-[11px] tracking-widest uppercase">
                <Sparkles className="h-3 w-3 text-primary" /> Iron Step Studio
              </div>
              <h1 className="mt-4 font-display text-4xl">
                {mode === "login" ? "Welcome back." : "Create your account."}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to edit your storefront — products, prices, images and more."
                  : "The first account created becomes the store admin."}
              </p>

              {notice && (
                <div className="mt-5 rounded-2xl bg-accent/20 border border-accent/40 px-4 py-3 text-sm">
                  {notice}
                </div>
              )}

              <form onSubmit={submit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Email
                  </span>
                  <div className="mt-1.5 relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Password
                  </span>
                  <div className="mt-1.5 relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "login" ? "Sign in" : "Create account"}
                </button>
              </form>

              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-foreground transition"
              >
                {mode === "login"
                  ? "First time here? Create the admin account →"
                  : "Already have an account? Sign in →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
