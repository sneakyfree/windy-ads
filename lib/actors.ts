/**
 * The AI actor roster. Each actor maps to a provider-specific avatar id via
 * `providerIds`. The `id` is our stable internal handle; `providerIds.heygen`
 * is the real HeyGen avatar_id used at render time, and `portrait` is HeyGen's
 * preview image so the gallery shows the actual avatar that will appear.
 *
 * In demo (mock) mode the `id` is used as the opaque actor id.
 */
export interface Actor {
  id: string;
  name: string;
  tagline: string;
  age: string;
  style: "casual" | "professional" | "energetic" | "calm";
  portrait: string;
  providerIds?: {
    heygen?: string;
    /** For D-ID this is a presenter image URL. */
    did?: string;
  };
  /** Gender-matched default HeyGen voice_id, used when the user picks no voice. */
  heygenVoiceId?: string;
}

export const ACTORS: Actor[] = [
  {
    id: "ava",
    name: "Ava",
    tagline: "Bubbly Gen-Z creator",
    age: "20s",
    style: "energetic",
    portrait: "https://files2.heygen.ai/avatar/v3/3c427d8c81414355b04c2b25a1e7873a_13216/preview_target.webp",
    providerIds: { heygen: "Anna_public_20240108" },
    heygenVoiceId: "4754e1ec667544b0bd18cdf4bec7d6a7",
  },
  {
    id: "marcus",
    name: "Marcus",
    tagline: "Confident founder type",
    age: "30s",
    style: "professional",
    portrait: "https://files2.heygen.ai/avatar/v3/5f57202f32dc4604845dc3da6372e5e4_53100/preview_target.webp",
    providerIds: { heygen: "Brandon_expressive2_public" },
    heygenVoiceId: "88bb9ee1c81b466eb2a08fdde86d3619",
  },
  {
    id: "sofia",
    name: "Sofia",
    tagline: "Warm lifestyle host",
    age: "30s",
    style: "calm",
    portrait: "https://files2.heygen.ai/avatar/v3/c3d1baaebbe84752b7a473373c6cd385_42780/preview_target.webp",
    providerIds: { heygen: "Adriana_BizTalk_Front_public" },
    heygenVoiceId: "42d00d4aac5441279d8536cd6b52c53c",
  },
  {
    id: "deshawn",
    name: "DeShawn",
    tagline: "Hype product reviewer",
    age: "20s",
    style: "energetic",
    portrait: "https://files2.heygen.ai/avatar/v3/a159e97bd1074405884694913633ea7f_63060/preview_target.webp",
    providerIds: { heygen: "Bryce_public_5" },
    heygenVoiceId: "453c20e1525a429080e2ad9e4b26f2cd",
  },
  {
    id: "lena",
    name: "Lena",
    tagline: "Polished corporate voice",
    age: "40s",
    style: "professional",
    portrait: "https://files2.heygen.ai/avatar/v3/51161fccd84d4c71b686cfe67c34f1b6_48010/preview_target.webp",
    providerIds: { heygen: "Ann_Business_Front_public" },
    heygenVoiceId: "b966c31caf124c2a99f19ff1479c964f",
  },
  {
    id: "kai",
    name: "Kai",
    tagline: "Chill everyday guy",
    age: "20s",
    style: "casual",
    portrait: "https://files2.heygen.ai/avatar/v3/fa717f667b7b4e41b0d7e4fd320ab080_43280/preview_talk_1.webp",
    providerIds: { heygen: "Armando_Casual_Front_public" },
    heygenVoiceId: "f38a635bee7a4d1f9b0a654a31d050d2",
  },
  {
    id: "priya",
    name: "Priya",
    tagline: "Trustworthy explainer",
    age: "30s",
    style: "calm",
    portrait: "https://files2.heygen.ai/avatar/v3/1cc18796d5e44342b3247c1aa847bc8f_52250/preview_target.webp",
    providerIds: { heygen: "Aiko_public" },
    heygenVoiceId: "cef3bc4e0a84424cafcde6f2cf466c97",
  },
  {
    id: "tom",
    name: "Tom",
    tagline: "Friendly neighbor next door",
    age: "50s",
    style: "casual",
    portrait: "https://files2.heygen.ai/avatar/v3/06885be851ed42d1a2a5192598d9ab80_52290/preview_target.webp",
    providerIds: { heygen: "Bruce_public" },
    heygenVoiceId: "7e157ec62c9c45f1adca12faae72c86f",
  },
];

export function getActor(id: string): Actor | undefined {
  return ACTORS.find((a) => a.id === id);
}

/** Resolve the actor id the active provider expects. */
export function resolveProviderActorId(actor: Actor, provider: string): string {
  if (provider === "heygen" && actor.providerIds?.heygen) return actor.providerIds.heygen;
  if (provider === "did" && actor.providerIds?.did) return actor.providerIds.did;
  return actor.id; // mock mode / unset
}
