import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Windy Ads — AI UGC video ads in minutes",
  description:
    "Type a script, pick an AI actor, get a realistic talking-avatar video ad. No cameras, no crews, no studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <header className="sticky top-0 z-50 border-b border-edge/60 bg-ink/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="inline-block h-6 w-6 rounded-lg bg-gradient-to-br from-accent to-glow" />
              Windy<span className="text-accent-soft">Ads</span>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/#how" className="hidden text-zinc-300 hover:text-white sm:inline">
                How it works
              </Link>
              <Link href="/#actors" className="hidden text-zinc-300 hover:text-white sm:inline">
                Actors
              </Link>
              <Link href="/create" className="btn-primary">
                Create an ad
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-edge/60 px-5 py-10 text-center text-sm text-zinc-500">
          <p>
            Windy Ads — an open AI UGC ad studio. Built by{" "}
            <a className="text-accent-soft hover:underline" href="https://github.com/sneakyfree">
              sneakyfree
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
