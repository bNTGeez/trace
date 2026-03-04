import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase service client using the service role key.
 *
 * - This client bypasses Row Level Security (RLS).
 * - Use ONLY in server-side code (API routes, background tasks, server actions)
 * - NEVER import in client components or expose to the browser
 * - Always explicitly scope queries by user_id to prevent cross-tenant bugs
 *
 * Purpose:
 * - Background task processing without user session
 * - Admin operations
 * - Simulating future worker-level access patterns
 */

let serviceClient: ReturnType<typeof createClient> | null = null;

export function getServiceClient() {
  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. " +
        "Service client requires service role key for background processing.",
    );
  }

  serviceClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serviceClient;
}
