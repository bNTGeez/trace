import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for server-side usage (API routes, Server Components).
 * Use lib/supabase/client.ts in browser/client components.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component; ignore.
        }
      },
    },
  });
}

/**
 * Returns the authenticated user or null. Use in Server Components and API routes
 * to scope data by user_id and protect routes.
 * Returns null when Supabase env vars are missing so the app still loads (e.g. before .env.local is set).
 */
export async function getUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}

/**
 * Server-only Supabase client using the secret key. Use for admin operations,
 * server-side tasks that bypass RLS, or when the user session is not available.
 * Never expose this client or the secret key to the browser.
 */
export async function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY"
    );
  }

  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  return createSupabaseClient(url, secretKey);
}
