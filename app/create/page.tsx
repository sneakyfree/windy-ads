"use client";

import { useEffect, useState } from "react";
import type { Actor } from "@/lib/actors";
import type { Voice } from "@/lib/elevenlabs";

type Phase = "idle" | "submitting" | "rendering" | "done" | "error";
type Aspect = "9:16" | "16:9" | "1:1";

export default function CreatePage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [actorId, setActorId] = useState<string>("");
  const [voiceId, setVoiceId] = useState<string>("");
  const [aspect, setAspect] = useState<Aspect>("9:16");
  const [script, setScript] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/actors")
      .then((r) => r.json())
      .then((d) => {
        setActors(d.actors || []);
        if (d.actors?.[0]) setActorId(d.actors[0].id);
      })
      .catch(() => {});
    fetch("/api/voices")
      .then((r) => r.json())
      .then((d) => setVoices(d.voices || []))
      .catch(() => {});
  }, []);

  async function poll(jobId: string) {
    // Poll status until completed/failed. Simple interval, capped.
    for (let i = 0; i < 150; i++) {
      await new Promise((res) => setTimeout(res, 2000));
      const r = await fetch(`/api/status/${encodeURIComponent(jobId)}`);
      const s = await r.json();
      if (typeof s.progress === "number") setProgress(s.progress);
      if (s.status === "completed" && s.videoUrl) {
        setVideoUrl(s.videoUrl);
        setProgress(100);
        setPhase("done");
        return;
      }
      if (s.status === "failed") {
        setError(s.error || "Render failed.");
        setPhase("error");
        return;
      }
    }
    setError("Timed out waiting for the render.");
    setPhase("error");
  }

  async function onGenerate() {
    if (!actorId || !script.trim()) return;
    setPhase("submitting");
    setError("");
    setVideoUrl("");
    setJobId("");
    setProgress(0);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actorId, script, voiceId: voiceId || undefined, aspect }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Generation request failed.");
      setJobId(d.jobId);
      setPhase("rendering");
      poll(d.jobId);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setPhase("error");
    }
  }

  const busy = phase === "submitting" || phase === "rendering";
  const selectedActor = actors.find((a) => a.id === actorId);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-bold">AI Ad Studio</h1>
      <p className="mt-2 text-zinc-400">
        Pick an actor, write your script, and generate a video ad.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: controls */}
        <div className="space-y-8">
          {/* Actor picker */}
          <section>
            <label className="mb-3 block text-sm font-semibold text-zinc-300">1 · Choose an actor</label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {actors.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setActorId(a.id)}
                  className={`card overflow-hidden text-left transition ${
                    actorId === a.id ? "ring-2 ring-accent" : "hover:border-accent/60"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.portrait} alt={a.name} className="aspect-square w-full object-cover" />
                  <div className="px-2 py-1.5 text-xs">
                    <div className="font-medium">{a.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Script */}
          <section>
            <label className="mb-3 block text-sm font-semibold text-zinc-300">2 · Write your script</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              maxLength={2500}
              rows={6}
              placeholder="Hey! I just tried the new… and honestly, I'm obsessed. Here's why you need it…"
              className="w-full resize-y rounded-xl border border-edge bg-panel p-4 text-sm outline-none focus:border-accent"
            />
            <div className="mt-1 text-right text-xs text-zinc-600">{script.length}/2500</div>
          </section>

          {/* Options */}
          <section className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-300">Voice</label>
              <select
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
                className="w-full rounded-xl border border-edge bg-panel p-3 text-sm outline-none focus:border-accent"
              >
                <option value="">Actor default</option>
                {voices.map((v) => (
                  <option key={v.voiceId} value={v.voiceId}>
                    {v.name}
                    {v.labels?.accent ? ` · ${v.labels.accent}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-300">Aspect ratio</label>
              <div className="flex gap-2">
                {(["9:16", "1:1", "16:9"] as Aspect[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspect(r)}
                    className={`flex-1 rounded-xl border px-3 py-3 text-sm ${
                      aspect === r ? "border-accent text-white" : "border-edge text-zinc-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <button onClick={onGenerate} disabled={busy || !script.trim()} className="btn-primary w-full py-4 text-base">
            {busy ? "Rendering…" : "Generate ad"}
          </button>
        </div>

        {/* Right: preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex aspect-[9/16] items-center justify-center bg-ink">
              {phase === "done" && videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="h-full w-full object-contain" />
              ) : busy ? (
                <div className="px-6 text-center">
                  <div className="mx-auto mb-4 h-1.5 w-40 overflow-hidden rounded-full bg-edge">
                    {progress > 0 ? (
                      // Determinate: provider reports real progress (e.g. mock).
                      <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                    ) : (
                      // Indeterminate: provider gives no progress (e.g. HeyGen) —
                      // show a moving bar so it never reads as a stuck "0%".
                      <div className="h-full w-1/3 animate-pulse rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">
                    {phase === "submitting"
                      ? "Submitting…"
                      : progress > 0
                        ? `Rendering… ${progress}%`
                        : "Rendering… this can take a minute"}
                  </p>
                </div>
              ) : phase === "error" ? (
                <p className="px-6 text-center text-sm text-red-400">{error}</p>
              ) : selectedActor ? (
                <div className="px-6 text-center text-zinc-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedActor.portrait}
                    alt={selectedActor.name}
                    className="mx-auto mb-3 h-24 w-24 rounded-full object-cover opacity-60"
                  />
                  <p className="text-sm">Your ad with {selectedActor.name} previews here.</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-600">Preview</p>
              )}
            </div>
          </div>
          {phase === "done" && videoUrl && jobId && (
            <a href={`/api/download/${encodeURIComponent(jobId)}`} download className="btn-ghost mt-4 w-full">
              ↓ Download video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
