/**
 * Hardcoded Supabase config for testing / Vercel deploys without env vars.
 * The anon key is public by design. Remove or replace before production hardening.
 */
export const TEST_SUPABASE = {
  projectId: "hayishuivmxndymesgeu",
  url: "https://hayishuivmxndymesgeu.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWlzaHVpdm14bmR5bWVzZ2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjU5ODEsImV4cCI6MjA5NzkwMTk4MX0.oYgnmfnN6A3uRfm70ijQ1ZywuhkXvLzcYnx8cO3WfTc",
} as const;
