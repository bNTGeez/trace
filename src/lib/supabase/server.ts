import { createClient as createSupabaseClientLib } from "@supabase/supabase-js";

/**
 * Supabase client for server-side usage (API routes, Server Components).
 * Use lib/supabase/client.ts in browser/client components.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createSupabaseClientLib(url, anonKey);
}
