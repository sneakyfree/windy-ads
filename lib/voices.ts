import type { Voice } from "./elevenlabs";
import { listVoices as listElevenLabsVoices } from "./elevenlabs";

/**
 * Returns the voice catalog for the active video provider. The voice_ids must
 * match what the provider's generate() expects:
 *  - HeyGen → HeyGen voice_ids (from /v2/voices)
 *  - otherwise → ElevenLabs voices (or the static fallback)
 */
export async function getVoiceCatalog(): Promise<Voice[]> {
  const provider = (process.env.VIDEO_PROVIDER || "mock").toLowerCase();
  if (provider === "heygen" && process.env.HEYGEN_API_KEY) {
    const hg = await listHeyGenVoices(process.env.HEYGEN_API_KEY);
    if (hg.length) return hg;
  }
  return listElevenLabsVoices();
}

async function listHeyGenVoices(apiKey: string): Promise<Voice[]> {
  try {
    const res = await fetch("https://api.heygen.com/v2/voices", {
      headers: { "X-Api-Key": apiKey },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const raw: any[] = json?.data?.voices ?? [];
    // English only, named, deduped by display name, capped for a usable dropdown.
    const seen = new Set<string>();
    const out: Voice[] = [];
    for (const v of raw) {
      const lang = String(v.language || "").toLowerCase();
      const name = String(v.name || "").trim();
      if (!lang.startsWith("english") || !name) continue;
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({
        voiceId: v.voice_id,
        name,
        labels: { gender: v.gender, accent: v.language },
        previewUrl: v.preview_audio,
      });
      if (out.length >= 60) break;
    }
    return out;
  } catch {
    return [];
  }
}
