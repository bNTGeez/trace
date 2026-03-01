import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { AuthHeader } from "@/components/auth-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trace",
  description: "Trace app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-medium text-zinc-900 dark:text-zinc-100">
                Trace
              </Link>
              {user && (
                <>
                  <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                    Dashboard
                  </Link>
                  <Link href="/logging" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                    Logging
                  </Link>
                </>
              )}
            </div>
            <AuthHeader user={user} />
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
