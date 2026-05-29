import Link from "next/link";
import { ACTORS } from "@/lib/actors";

const STEPS = [
  { n: "01", title: "Write your script", body: "Paste your ad copy or hook. Up to ~2,500 characters." },
  { n: "02", title: "Pick an AI actor", body: "Choose from a roster of realistic UGC creators and voices." },
  { n: "03", title: "Generate & download", body: "Get a ready-to-post talking-avatar video in minutes." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-glow">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 text-center">
          <span className="inline-block rounded-full border border-edge bg-panel px-4 py-1 text-xs font-medium text-accent-soft">
            AI UGC ad studio
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Turn a script into a{" "}
            <span className="bg-gradient-to-r from-accent-soft to-glow bg-clip-text text-transparent">
              real-looking video ad
            </span>{" "}
            in minutes.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-400">
            No cameras, no actors, no crews. Type your hook, pick an AI creator, and Windy Ads
            renders a realistic talking-avatar UGC ad you can post anywhere.
          </p>
          <div className="mt-9 flex items-center justify-center gap-4">
            <Link href="/create" className="btn-primary px-7 py-4 text-base">
              Create your first ad →
            </Link>
            <Link href="#how" className="btn-ghost px-7 py-4 text-base">
              See how it works
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            Runs in free demo mode out of the box — add a HeyGen or D-ID key for real renders.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center text-3xl font-bold">Three steps. That&apos;s it.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-7">
              <div className="text-sm font-mono text-accent-soft">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-zinc-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Actors */}
      <section id="actors" className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Meet the cast</h2>
          <Link href="/create" className="text-sm text-accent-soft hover:underline">
            Use them →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {ACTORS.map((a) => (
            <div key={a.id} className="card group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.portrait}
                alt={a.name}
                className="aspect-[3/4] w-full object-cover transition group-hover:scale-105"
              />
              <div className="p-4">
                <div className="font-semibold">{a.name}</div>
                <div className="text-sm text-zinc-500">{a.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 className="text-4xl font-extrabold">Your next winning ad is one script away.</h2>
        <Link href="/create" className="btn-primary mt-8 px-8 py-4 text-base">
          Open the studio
        </Link>
      </section>
    </>
  );
}
