/**
 * ElevenLabs voice catalog helper. Returns the account's available voices,
 * or a curated static fallback when no key is set (demo mode).
 * Docs: https://elevenlabs.io/docs/api-reference/voices
 */
export interface Voice {
  voiceId: string;
  name: string;
  labels?: Record<string, string>;
  previewUrl?: string;
}

const FALLBACK_VOICES: Voice[] = [
  { voiceId: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", labels: { accent: "american", gender: "female" } },
  { voiceId: "AZnzlk1XvdvUeBnXmlld", name: "Domi", labels: { accent: "american", gender: "female" } },
  { voiceId: "EXAVITQu4vr4xnSDxMaL", name: "Bella", labels: { accent: "american", gender: "female" } },
  { voiceId: "ErXwobaYiN019PkySvjV", name: "Antoni", labels: { accent: "american", gender: "male" } },
  { voiceId: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", labels: { accent: "american", gender: "male" } },
  { voiceId: "VR6AewLTigWG4xSOukaG", name: "Arnold", labels: { accent: "american", gender: "male" } },
];

export async function listVoices(): Promise<Voice[]> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return FALLBACK_VOICES;

  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": key },
      // voices change rarely — let Next cache for an hour
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK_VOICES;
    const json = await res.json();
    const voices: Voice[] = (json?.voices ?? []).map((v: any) => ({
      voiceId: v.voice_id,
      name: v.name,
      labels: v.labels,
      previewUrl: v.preview_url,
    }));
    return voices.length ? voices : FALLBACK_VOICES;
  } catch {
    return FALLBACK_VOICES;
  }
}
