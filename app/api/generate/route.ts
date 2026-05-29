import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import { getActor, resolveProviderActorId } from "@/lib/actors";
import type { GenerateInput } from "@/lib/providers/types";

const MAX_SCRIPT = 2500;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { actorId, script, voiceId, aspect } = body ?? {};

  if (!actorId || typeof actorId !== "string") {
    return NextResponse.json({ error: "actorId is required" }, { status: 400 });
  }
  if (!script || typeof script !== "string" || !script.trim()) {
    return NextResponse.json({ error: "script is required" }, { status: 400 });
  }
  if (script.length > MAX_SCRIPT) {
    return NextResponse.json(
      { error: `script too long (max ${MAX_SCRIPT} chars)` },
      { status: 400 },
    );
  }

  const actor = getActor(actorId);
  if (!actor) {
    return NextResponse.json({ error: `unknown actor: ${actorId}` }, { status: 404 });
  }

  const provider = getProvider();
  // User-chosen voice wins; otherwise fall back to the actor's provider default.
  const chosenVoice =
    typeof voiceId === "string" && voiceId
      ? voiceId
      : provider.name === "heygen"
        ? actor.heygenVoiceId
        : undefined;
  const input: GenerateInput = {
    actorId: resolveProviderActorId(actor, provider.name),
    script: script.trim(),
    voiceId: chosenVoice,
    aspect: aspect === "16:9" || aspect === "1:1" ? aspect : "9:16",
  };

  try {
    const result = await provider.generate(input);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "generation failed" },
      { status: 502 },
    );
  }
}
