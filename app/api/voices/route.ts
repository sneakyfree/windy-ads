import { NextResponse } from "next/server";
import { getVoiceCatalog } from "@/lib/voices";

// Live, env- and account-dependent fetch — must not be baked at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const voices = await getVoiceCatalog();
  return NextResponse.json({ voices });
}
