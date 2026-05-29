export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface GenerateInput {
  /** Provider-specific avatar / actor id */
  actorId: string;
  /** The ad script the actor will speak */
  script: string;
  /** Provider-specific voice id (TTS). Optional — provider default used if absent. */
  voiceId?: string;
  /** Output aspect ratio. */
  aspect?: "9:16" | "16:9" | "1:1";
}

export interface GenerateResult {
  /** Opaque job id used to poll status. */
  jobId: string;
  provider: string;
}

export interface JobState {
  jobId: string;
  status: JobStatus;
  /** Present when status === "completed". */
  videoUrl?: string;
  /** Present when status === "failed". */
  error?: string;
  /** 0-100 best-effort. */
  progress?: number;
}

export interface VideoProvider {
  readonly name: string;
  generate(input: GenerateInput): Promise<GenerateResult>;
  status(jobId: string): Promise<JobState>;
}
