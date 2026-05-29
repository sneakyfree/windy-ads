/**
 * The AI actor roster. Each actor maps to a provider-specific avatar id via
 * `providerIds`. In demo (mock) mode the portrait + metadata drive the UI and
 * `id` is used as the opaque actor id. When you go live, fill `providerIds`
 * with the real avatar ids from your HeyGen / D-ID account.
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
}

export const ACTORS: Actor[] = [
  {
    id: "ava",
    name: "Ava",
    tagline: "Bubbly Gen-Z creator",
    age: "20s",
    style: "energetic",
    portrait: "https://i.pravatar.cc/480?img=49",
  },
  {
    id: "marcus",
    name: "Marcus",
    tagline: "Confident founder type",
    age: "30s",
    style: "professional",
    portrait: "https://i.pravatar.cc/480?img=12",
  },
  {
    id: "sofia",
    name: "Sofia",
    tagline: "Warm lifestyle host",
    age: "30s",
    style: "calm",
    portrait: "https://i.pravatar.cc/480?img=45",
  },
  {
    id: "deshawn",
    name: "DeShawn",
    tagline: "Hype product reviewer",
    age: "20s",
    style: "energetic",
    portrait: "https://i.pravatar.cc/480?img=33",
  },
  {
    id: "lena",
    name: "Lena",
    tagline: "Polished corporate voice",
    age: "40s",
    style: "professional",
    portrait: "https://i.pravatar.cc/480?img=27",
  },
  {
    id: "kai",
    name: "Kai",
    tagline: "Chill everyday guy",
    age: "20s",
    style: "casual",
    portrait: "https://i.pravatar.cc/480?img=15",
  },
  {
    id: "priya",
    name: "Priya",
    tagline: "Trustworthy explainer",
    age: "30s",
    style: "calm",
    portrait: "https://i.pravatar.cc/480?img=44",
  },
  {
    id: "tom",
    name: "Tom",
    tagline: "Friendly neighbor next door",
    age: "50s",
    style: "casual",
    portrait: "https://i.pravatar.cc/480?img=51",
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
