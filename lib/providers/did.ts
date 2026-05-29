import type { GenerateInput, GenerateResult, JobState, JobStatus, VideoProvider } from "./types";

/**
 * D-ID "Clips" / "Talks" video provider. Wraps the talks API.
 * Docs: https://docs.d-id.com/reference/createtalk
 *
 * Auth: header `Authorization: Basic <DID_API_KEY>` (the key is already the
 * base64 `email:key` pair D-ID issues).
 */
const BASE = "https://api.d-id.com";

export class DIDProvider implements VideoProvider {
  readonly name = "did";
  constructor(private apiKey: string) {}

  private headers() {
    return {
      Authorization: `Basic ${this.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async generate(input: GenerateInput): Promise<GenerateResult> {
    // For D-ID, actorId is a presenter image URL or a stored presenter id.
    const body: Record<string, unknown> = {
      script: {
        type: "text",
        input: input.script,
        provider: input.voiceId
          ? { type: "elevenlabs", voice_id: input.voiceId }
          : { type: "microsoft", voice_id: "en-US-JennyNeural" },
      },
      source_url: input.actorId,
    };

    const res = await fetch(`${BASE}/talks`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`D-ID generate failed (${res.status}): ${await res.text()}`);
    }
    const json = await res.json();
    if (!json?.id) throw new Error(`D-ID generate returned no id: ${JSON.stringify(json)}`);
    return { jobId: json.id, provider: this.name };
  }

  async status(jobId: string): Promise<JobState> {
    const res = await fetch(`${BASE}/talks/${encodeURIComponent(jobId)}`, {
      headers: this.headers(),
    });
    if (!res.ok) {
      return { jobId, status: "failed", error: `status ${res.status}: ${await res.text()}` };
    }
    const json = await res.json();
    const s: string = json?.status ?? "unknown";
    const map: Record<string, JobStatus> = {
      created: "queued",
      started: "processing",
      done: "completed",
      error: "failed",
      rejected: "failed",
    };
    return {
      jobId,
      status: map[s] ?? "processing",
      videoUrl: json?.result_url,
      error: json?.error?.description,
    };
  }
}
