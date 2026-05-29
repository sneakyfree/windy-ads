import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeHeyGenVoices } from "../lib/voices";

const raw = [
  { voice_id: "1", name: "Brian", language: "English", gender: "male", preview_audio: "u1" },
  { voice_id: "2", name: "Brian", language: "English", gender: "male" }, // dup name -> dropped
  { voice_id: "3", name: "Hans", language: "German", gender: "male" }, // non-english -> dropped
  { voice_id: "4", name: "", language: "English" }, // empty name -> dropped
  { voice_id: "5", name: "Ivy", language: "English - American", gender: "female" },
];

test("normalizeHeyGenVoices keeps english, named, deduped", () => {
  const out = normalizeHeyGenVoices(raw);
  assert.deepEqual(out.map((v) => v.name), ["Brian", "Ivy"]);
  assert.equal(out[0].voiceId, "1");
  assert.equal(out[0].labels?.gender, "male");
  assert.equal(out[0].previewUrl, "u1");
});

test("normalizeHeyGenVoices caps at 60", () => {
  const many = Array.from({ length: 200 }, (_, i) => ({
    voice_id: String(i),
    name: "V" + i,
    language: "English",
  }));
  assert.equal(normalizeHeyGenVoices(many).length, 60);
});

test("normalizeHeyGenVoices handles empty input", () => {
  assert.deepEqual(normalizeHeyGenVoices([]), []);
});
