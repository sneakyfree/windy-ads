import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";

export const dynamic = "force-dynamic";

/**
 * Same-origin download proxy. The browser ignores the `download` attribute for
 * cross-origin URLs (it navigates/plays instead of saving — QA gap G2), so we
 * stream the finished render through our own origin with a Content-Disposition
 * attachment header. The video URL is re-resolved from the provider by job id,
 * so the client never supplies a URL (no SSRF / open-proxy risk).
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) return NextResponse.json({ error: "job id required" }, { status: 400 });

  let videoUrl: string | undefined;
  try {
    const state = await getProvider().status(id);
    if (state.status !== "completed" || !state.videoUrl) {
      return NextResponse.json({ error: "video not ready" }, { status: 409 });
    }
    videoUrl = state.videoUrl;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "status check failed" }, { status: 502 });
  }

  const upstream = await fetch(videoUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: `fetch failed (${upstream.status})` }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "video/mp4");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set("Content-Disposition", `attachment; filename="windy-ad-${id}.mp4"`);
  headers.set("Cache-Control", "no-store");

  return new NextResponse(upstream.body, { status: 200, headers });
}
