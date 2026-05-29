import type { VideoProvider } from "./types";
import { MockProvider } from "./mock";
import { HeyGenProvider } from "./heygen";
import { DIDProvider } from "./did";

let cached: VideoProvider | null = null;

/**
 * Resolve the active video provider from env. Falls back to the cost-free
 * mock provider whenever the configured provider has no key — so the app is
 * always runnable, even with an empty .env.
 */
export function getProvider(): VideoProvider {
  if (cached) return cached;

  const choice = (process.env.VIDEO_PROVIDER || "mock").toLowerCase();

  if (choice === "heygen" && process.env.HEYGEN_API_KEY) {
    cached = new HeyGenProvider(process.env.HEYGEN_API_KEY);
  } else if (choice === "did" && process.env.DID_API_KEY) {
    cached = new DIDProvider(process.env.DID_API_KEY);
  } else {
    cached = new MockProvider();
  }
  return cached;
}

export function providerIsLive(): boolean {
  return getProvider().name !== "mock";
}
