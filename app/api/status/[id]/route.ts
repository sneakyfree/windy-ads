import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "job id required" }, { status: 400 });
  }
  try {
    const state = await getProvider().status(id);
    return NextResponse.json(state);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "status check failed" },
      { status: 502 },
    );
  }
}
