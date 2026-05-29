import { test } from "node:test";
import assert from "node:assert/strict";
import { ACTORS, getActor, resolveProviderActorId } from "../lib/actors";

test("roster is non-empty and every actor is well-formed", () => {
  assert.ok(ACTORS.length >= 1);
  for (const a of ACTORS) {
    assert.ok(a.id && a.name && a.portrait, `actor ${a.id} missing fields`);
    assert.ok(a.providerIds?.heygen, `actor ${a.id} missing heygen avatar id`);
    assert.ok(a.heygenVoiceId, `actor ${a.id} missing heygen voice id`);
  }
});

test("actor ids are unique", () => {
  const ids = ACTORS.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("getActor finds known and rejects unknown", () => {
  assert.equal(getActor(ACTORS[0].id)?.id, ACTORS[0].id);
  assert.equal(getActor("nope-not-real"), undefined);
});

test("resolveProviderActorId maps to provider avatar id, falls back to internal id", () => {
  const a = ACTORS[0];
  assert.equal(resolveProviderActorId(a, "heygen"), a.providerIds!.heygen);
  assert.equal(resolveProviderActorId(a, "mock"), a.id); // no mapping -> internal id
  assert.equal(resolveProviderActorId(a, "did"), a.id); // no did mapping -> internal id
});
