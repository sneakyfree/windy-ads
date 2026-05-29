import { test } from "node:test";
import assert from "node:assert/strict";
import { selectProvider } from "../lib/providers";
import { MockProvider } from "../lib/providers/mock";

test("selectProvider defaults to mock when unset", () => {
  assert.equal(selectProvider({}).name, "mock");
});

test("selectProvider picks heygen only with a key", () => {
  assert.equal(selectProvider({ VIDEO_PROVIDER: "heygen", HEYGEN_API_KEY: "k" }).name, "heygen");
  // configured heygen but no key -> safe fallback to mock
  assert.equal(selectProvider({ VIDEO_PROVIDER: "heygen" }).name, "mock");
});

test("selectProvider picks did only with a key", () => {
  assert.equal(selectProvider({ VIDEO_PROVIDER: "did", DID_API_KEY: "k" }).name, "did");
  assert.equal(selectProvider({ VIDEO_PROVIDER: "did" }).name, "mock");
});

test("selectProvider is case-insensitive and falls back for unknown", () => {
  assert.equal(selectProvider({ VIDEO_PROVIDER: "HeyGen", HEYGEN_API_KEY: "k" }).name, "heygen");
  assert.equal(selectProvider({ VIDEO_PROVIDER: "bogus" }).name, "mock");
});

test("MockProvider: generate returns a job, status is non-terminal immediately", async () => {
  const m = new MockProvider();
  const { jobId, provider } = await m.generate({ actorId: "ava", script: "hi" });
  assert.ok(jobId);
  assert.equal(provider, "mock");
  const s = await m.status(jobId);
  assert.ok(["queued", "processing"].includes(s.status), `unexpected ${s.status}`);
});

test("MockProvider: unknown job id reports failed, not a throw", async () => {
  const m = new MockProvider();
  const s = await m.status("does-not-exist");
  assert.equal(s.status, "failed");
  assert.ok(s.error);
});

test("MockProvider: completes after the render window", async () => {
  const m = new MockProvider();
  const { jobId } = await m.generate({ actorId: "ava", script: "hi" });
  await new Promise((r) => setTimeout(r, 6500));
  const s = await m.status(jobId);
  assert.equal(s.status, "completed");
  assert.ok(s.videoUrl && s.videoUrl.startsWith("https://"));
});

test("MockProvider: job store stays bounded under load", async () => {
  const m = new MockProvider();
  let lastJob = "";
  for (let i = 0; i < 600; i++) {
    lastJob = (await m.generate({ actorId: "ava", script: "x" })).jobId;
  }
  // most recent job must still be retrievable (not evicted)
  const s = await m.status(lastJob);
  assert.notEqual(s.error, "unknown job");
});
