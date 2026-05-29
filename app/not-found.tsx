import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <div className="bg-gradient-to-r from-accent-soft to-glow bg-clip-text text-7xl font-extrabold text-transparent">
        404
      </div>
      <h1 className="mt-4 text-2xl font-bold">This page wandered off.</h1>
      <p className="mt-2 text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to making ads.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-ghost">
          ← Home
        </Link>
        <Link href="/create" className="btn-primary">
          Open the studio
        </Link>
      </div>
    </div>
  );
}
