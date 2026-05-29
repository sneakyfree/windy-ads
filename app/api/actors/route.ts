import { NextResponse } from "next/server";
import { ACTORS } from "@/lib/actors";

export async function GET() {
  return NextResponse.json({ actors: ACTORS });
}
