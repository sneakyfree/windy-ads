import type { VideoProvider } from "./types";
import { MockProvider } from "./mock";
import { HeyGenProvider } from "./heygen";
import { DIDProvider } from "./did";

let cached: VideoProvider | null = null;

type ProviderEnv = Record<string, string | undefined>;

/**
 * Pure provider selection from an env-like object (compatible with
 * process.env). Falls back to the cost-free mock provider whenever the
 * configured provider has no key — so the app is always runnable, even with an
 * empty .env. Exported for unit testing.
 */
export function selectProvider(env: ProviderEnv): VideoProvider {
  const choice = (env.VIDEO_PROVIDER || "mock").toLowerCase();
  if (choice === "heygen" && env.HEYGEN_API_KEY) return new HeyGenProvider(env.HEYGEN_API_KEY);
  if (choice === "did" && env.DID_API_KEY) return new DIDProvider(env.DID_API_KEY);
  return new MockProvider();
}

/** Resolve (and cache) the active video provider from process.env. */
export function getProvider(): VideoProvider {
  if (cached) return cached;
  cached = selectProvider(process.env);
  return cached;
}

export function providerIsLive(): boolean {
  return getProvider().name !== "mock";
}
