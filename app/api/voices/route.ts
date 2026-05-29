import { NextResponse } from "next/server";
import { getVoiceCatalog } from "@/lib/voices";

export async function GET() {
  const voices = await getVoiceCatalog();
  return NextResponse.json({ voices });
}
