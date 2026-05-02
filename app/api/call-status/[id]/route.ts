import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing call ID" }, { status: 400 });
    }

    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("calls")
      .select("id, caller_name, mission, phone_number, tone, status, transcript, outcome_summary, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error("call-status error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
