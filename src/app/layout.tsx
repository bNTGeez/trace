import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trace",
  description: "Trace app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <a href="/" className="font-medium text-zinc-900 dark:text-zinc-100">
              Trace
            </a>
            {/* Nav links added in later phases */}
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
