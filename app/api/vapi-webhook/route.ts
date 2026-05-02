import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { VapiMessage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: VapiMessage = await req.json();

    // Only process end-of-call events
    if (body.type !== "end-of-call-report") {
      return NextResponse.json({ received: true });
    }

    const vapiCallId = body.call?.id;
    if (!vapiCallId) {
      return NextResponse.json({ received: true });
    }

    const db = getSupabaseAdmin();

    // Look up the call record by vapi_call_id
    const { data: callRecord, error: lookupError } = await db
      .from("calls")
      .select("*")
      .eq("vapi_call_id", vapiCallId)
      .single();

    if (lookupError || !callRecord) {
      console.warn("Could not find call by vapi_call_id:", vapiCallId);
      return NextResponse.json({ received: true });
    }

    // Extract transcript from the event
    const messages = body.artifact?.messages ?? [];
    let transcriptText = "";

    if (messages.length > 0) {
      transcriptText = JSON.stringify(
        messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({ role: m.role, message: m.message }))
      );
    } else if (body.artifact?.transcript) {
      transcriptText = body.artifact.transcript;
    }

    // Generate outcome summary using Claude
    let outcomeSummary = "The call has ended.";

    if (transcriptText && process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const summaryResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 300,
          system: `You are an AI assistant that summarizes phone call outcomes.
Given a call transcript and the original mission, write a 2-3 sentence outcome summary.
Be specific about what was accomplished or not accomplished.
Start with "The call" or "During the call".
Keep it factual and concise.`,
          messages: [
            {
              role: "user",
              content: `Mission: ${callRecord.mission}\n\nTranscript:\n${transcriptText}\n\nSummarize the outcome of this call in 2-3 sentences.`,
            },
          ],
        });

        const textBlock = summaryResponse.content.find((b) => b.type === "text");
        if (textBlock && textBlock.type === "text") {
          outcomeSummary = textBlock.text.trim();
        }
      } catch (claudeErr) {
        console.error("Claude summary error:", claudeErr);
        outcomeSummary = `The call ended. ${body.endedReason ? `End reason: ${body.endedReason}` : ""}`;
      }
    }

    // Update the call record
    await db
      .from("calls")
      .update({
        status: "completed",
        transcript: transcriptText || null,
        outcome_summary: outcomeSummary,
      })
      .eq("id", callRecord.id);

    return NextResponse.json({ received: true, callId: callRecord.id });
  } catch (err: unknown) {
    console.error("vapi-webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
