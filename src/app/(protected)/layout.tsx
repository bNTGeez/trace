import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

/**
 * Protects all routes under (protected): redirect to /login if not authenticated.
 * Dashboard and logging pages require auth.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return <>{children}</>;
}
