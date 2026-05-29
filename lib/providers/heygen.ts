import type { GenerateInput, GenerateResult, JobState, JobStatus, VideoProvider } from "./types";

/**
 * HeyGen video provider. Wraps the v2 video generation API.
 * Docs: https://docs.heygen.com/reference/create-an-avatar-video-v2
 *
 * Auth: header `X-Api-Key: <HEYGEN_API_KEY>`.
 */
const BASE = "https://api.heygen.com";

function dims(aspect: GenerateInput["aspect"]) {
  switch (aspect) {
    case "16:9":
      return { width: 1280, height: 720 };
    case "1:1":
      return { width: 720, height: 720 };
    case "9:16":
    default:
      return { width: 720, height: 1280 };
  }
}

export class HeyGenProvider implements VideoProvider {
  readonly name = "heygen";
  constructor(private apiKey: string) {}

  private headers() {
    return { "X-Api-Key": this.apiKey, "Content-Type": "application/json" };
  }

  async generate(input: GenerateInput): Promise<GenerateResult> {
    const { width, height } = dims(input.aspect);
    const body = {
      video_inputs: [
        {
          character: { type: "avatar", avatar_id: input.actorId, avatar_style: "normal" },
          voice: input.voiceId
            ? { type: "text", input_text: input.script, voice_id: input.voiceId }
            : { type: "text", input_text: input.script },
        },
      ],
      dimension: { width, height },
    };

    const res = await fetch(`${BASE}/v2/video/generate`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HeyGen generate failed (${res.status}): ${await res.text()}`);
    }
    const json = await res.json();
    const jobId = json?.data?.video_id;
    if (!jobId) throw new Error(`HeyGen generate returned no video_id: ${JSON.stringify(json)}`);
    return { jobId, provider: this.name };
  }

  async status(jobId: string): Promise<JobState> {
    const res = await fetch(`${BASE}/v1/video_status.get?video_id=${encodeURIComponent(jobId)}`, {
      headers: this.headers(),
    });
    if (!res.ok) {
      return { jobId, status: "failed", error: `status ${res.status}: ${await res.text()}` };
    }
    const json = await res.json();
    const s: string = json?.data?.status ?? "unknown";
    const map: Record<string, JobStatus> = {
      pending: "queued",
      waiting: "queued",
      processing: "processing",
      completed: "completed",
      failed: "failed",
    };
    const status = map[s] ?? "processing";
    return {
      jobId,
      status,
      videoUrl: json?.data?.video_url,
      error: json?.data?.error?.message,
    };
  }
}
