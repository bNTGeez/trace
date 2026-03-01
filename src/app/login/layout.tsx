import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";

/**
 * If already logged in, redirect to dashboard.
 */
export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (user) redirect("/dashboard");
  return <>{children}</>;
}
