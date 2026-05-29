import type { GenerateInput, GenerateResult, JobState, VideoProvider } from "./types";

/**
 * Demo provider. No external calls, no API key, no cost. Pretends to render
 * for a few seconds then returns a royalty-free sample clip. Lets the entire
 * product be developed and demoed before wiring a paid provider.
 */
// Verified cross-origin-playable in a <video> element (the old
// storage.googleapis.com/gtv-videos-bucket URLs get ORB-blocked by Chromium
// and render as a black player — see QA finding F2).
const SAMPLE_VIDEOS = [
  "https://media.w3.org/2010/05/sintel/trailer.mp4",
  "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
];

// In-memory job store. Fine for a single dev instance; swap for KV/Redis in prod.
const jobs = new Map<string, { startedAt: number; videoUrl: string }>();

// Deterministic-ish id without Math.random (kept simple and dependency-free).
let counter = 0;
function makeId() {
  counter += 1;
  return `mock_${counter}_${Buffer.from(String(counter)).toString("hex")}`;
}

export class MockProvider implements VideoProvider {
  readonly name = "mock";

  async generate(input: GenerateInput): Promise<GenerateResult> {
    const jobId = makeId();
    const pick = SAMPLE_VIDEOS[counter % SAMPLE_VIDEOS.length];
    jobs.set(jobId, { startedAt: Date.now(), videoUrl: pick });
    return { jobId, provider: this.name };
  }

  async status(jobId: string): Promise<JobState> {
    const job = jobs.get(jobId);
    if (!job) return { jobId, status: "failed", error: "unknown job" };
    const elapsed = Date.now() - job.startedAt;
    const RENDER_MS = 6000;
    if (elapsed >= RENDER_MS) {
      return { jobId, status: "completed", videoUrl: job.videoUrl, progress: 100 };
    }
    return {
      jobId,
      status: "processing",
      progress: Math.min(95, Math.round((elapsed / RENDER_MS) * 100)),
    };
  }
}
