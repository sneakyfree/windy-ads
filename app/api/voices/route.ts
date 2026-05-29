import { NextResponse } from "next/server";
import { listVoices } from "@/lib/elevenlabs";

export async function GET() {
  const voices = await listVoices();
  return NextResponse.json({ voices });
}
