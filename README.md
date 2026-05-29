# Windy Ads

**AI UGC video-ad studio.** Type a script, pick an AI actor, get a realistic
talking-avatar video ad — no cameras, no crews, no studio. An open,
self-hostable take on the arcads.ai workflow.

> Built from scratch. This is **not** arcads' code — it's an independent
> implementation of the same product idea that you own and control.

## What it does

1. **Write a script** — your ad hook / copy (up to ~2,500 chars).
2. **Pick an AI actor** — choose a creator persona + voice.
3. **Generate** — the backend calls a video-generation provider and returns a
   ready-to-post talking-avatar clip you can preview and download.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Pluggable **video provider** layer: `mock` (free demo), **HeyGen**, **D-ID**
- **ElevenLabs** voice catalog (optional)
- Deployable to **Cloudflare Pages** / Vercel / any Node host

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — runs in demo mode without it
npm run dev                  # http://localhost:3000
```

With **no API keys**, the app runs in **demo mode**: the full UI works and
generation returns a sample stock video, so you can build and demo the product
for free.

## Going live (real renders)

Add keys to `.env.local`:

```env
VIDEO_PROVIDER=heygen          # or: did
HEYGEN_API_KEY=...             # from https://app.heygen.com
# or
DID_API_KEY=...                # base64 email:key from https://studio.d-id.com
ELEVENLABS_API_KEY=...         # optional, for the voice catalog
```

Then map each actor in `lib/actors.ts` to your provider's avatar id via the
`providerIds` field (HeyGen avatar id, or a D-ID presenter image URL).

## Architecture

```
app/
  page.tsx              landing page
  create/page.tsx       the studio (pick → write → generate → poll → play)
  api/
    actors/route.ts     GET  actor roster
    voices/route.ts     GET  ElevenLabs voices (or fallback)
    generate/route.ts   POST start a render → { jobId }
    status/[id]/route.ts GET poll render status → { status, videoUrl }
lib/
  actors.ts             actor roster + provider-id resolution
  elevenlabs.ts         voice catalog helper
  providers/
    index.ts            env-based provider selection (falls back to mock)
    types.ts            VideoProvider interface
    mock.ts             free demo provider
    heygen.ts           HeyGen v2 wrapper
    did.ts              D-ID talks wrapper
```

Adding a provider = implement the `VideoProvider` interface in
`lib/providers/` and register it in `index.ts`.

## License

MIT — see [LICENSE](./LICENSE).
