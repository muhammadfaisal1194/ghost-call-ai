import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { buildSystemPrompt } from "@/lib/tone-prompts";
import type { StartCallPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: StartCallPayload = await req.json();
    const { caller_name, mission, phone_number, tone } = body;

    if (!caller_name?.trim() || !mission?.trim() || !phone_number?.trim() || !tone) {
      return NextResponse.json(
        { error: "Missing required fields: caller_name, mission, phone_number, tone" },
        { status: 400 }
      );
    }

    const db = getSupabaseAdmin();

    // Insert call record into Supabase
    const { data: callRecord, error: dbError } = await db
      .from("calls")
      .insert({
        caller_name: caller_name.trim(),
        mission: mission.trim(),
        phone_number: phone_number.trim(),
        tone,
        status: "pending",
      })
      .select()
      .single();

    if (dbError || !callRecord) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to create call record" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt(tone, mission, caller_name);

    // Build Vapi assistant configuration
    const vapiPayload = {
      assistant: {
        name: "GhostCall Agent",
        model: {
          provider: "anthropic",
          model: "claude-sonnet-4-5-20250929",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
          ],
          temperature: 0.7,
          maxTokens: 1000,
        },
        voice: {
          provider: "11labs",
          voiceId: "burt",
        },
        firstMessage: `Hello, my name is calling on behalf of ${caller_name}. ${
          tone === "friendly"
            ? "I hope you're having a great day! I was hoping you could help me with something."
            : tone === "firm"
            ? "I'm calling regarding an important matter and need your assistance."
            : "I need to speak with someone who can help resolve an urgent issue immediately."
        }`,
        endCallMessage: "Thank you for your time. Have a good day.",
        endCallFunctionEnabled: true,
        recordingEnabled: true,
        hipaaEnabled: false,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        backgroundSound: "off",
        metadata: {
          callId: callRecord.id,
          callerName: caller_name,
          mission,
          tone,
        },
        serverUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi-webhook`,
      },
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: phone_number.trim(),
        name: "Customer",
      },
    };

    // Trigger Vapi outbound call
    const vapiRes = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vapiPayload),
    });

    if (!vapiRes.ok) {
      const vapiError = await vapiRes.json().catch(() => ({ message: vapiRes.statusText }));
      console.error("Vapi API error:", vapiError);

      // Update call record to failed
      await db
        .from("calls")
        .update({ status: "failed", outcome_summary: `Failed to initiate call: ${vapiError.message || "Unknown error"}` })
        .eq("id", callRecord.id);

      return NextResponse.json(
        { error: `Failed to initiate call: ${vapiError.message || "Unknown Vapi error"}` },
        { status: 502 }
      );
    }

    const vapiData = await vapiRes.json();

    // Update call record with vapi call id and in_progress status
    await db
      .from("calls")
      .update({
        status: "in_progress",
        vapi_call_id: vapiData.id,
      })
      .eq("id", callRecord.id);

    return NextResponse.json({ callId: callRecord.id });
  } catch (err: unknown) {
    console.error("start-call error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
