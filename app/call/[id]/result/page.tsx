"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PhoneCall,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Bot,
  Clock,
  Target,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Call, VapiTranscriptMessage } from "@/types";

function parseTranscript(raw: string | null): VapiTranscriptMessage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as VapiTranscriptMessage[];
  } catch {
    // Fall back to plain text parsing
  }
  // Parse plain text transcript format: "Role: message\n"
  const lines = raw.split("\n").filter(Boolean);
  return lines.map((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return { role: "user" as const, message: line };
    const role = line.slice(0, colonIdx).toLowerCase().trim();
    const message = line.slice(colonIdx + 1).trim();
    return {
      role: (role === "assistant" || role === "ai" || role === "agent") ? "assistant" : "user",
      message,
    } as VapiTranscriptMessage;
  });
}

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCall() {
      try {
        const res = await fetch(`/api/call-status/${id}`);
        if (!res.ok) throw new Error("Call not found");
        const data: Call = await res.json();
        setCall(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load result");
      } finally {
        setLoading(false);
      }
    }
    fetchCall();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0B1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C4B5FD]" />
      </div>
    );
  }

  if (error || !call) {
    return (
      <div className="min-h-screen bg-[#0D0B1E] text-white flex items-center justify-center px-6">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-outfit font-bold text-2xl mb-2">Call Not Found</h1>
          <p className="text-white/55 mb-6 font-inter">{error}</p>
          <Link href="/call/new" className="text-[#C4B5FD] hover:text-white font-inter text-sm">
            Start a new call →
          </Link>
        </div>
      </div>
    );
  }

  const messages = parseTranscript(call.transcript);
  const isSuccess = call.status === "completed";
  const createdAt = new Date(call.created_at).toLocaleString();

  return (
    <div className="min-h-screen bg-[#0D0B1E] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] blur-[120px] rounded-full ${
          isSuccess ? "bg-[#2DD4BF]/12" : "bg-red-900/15"
        }`} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-inter">Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6B21A8] to-[#2DD4BF] flex items-center justify-center">
            <PhoneCall className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-outfit font-bold text-base">GhostCall AI</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8 pb-20">
        {/* Mission badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-outfit font-semibold mb-5 ${
            isSuccess
              ? "bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#2DD4BF]"
              : "bg-red-500/15 border border-red-500/30 text-red-400"
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {isSuccess ? "Mission Accomplished" : "Call Ended"}
          </div>
          <h1 className="font-outfit font-black text-4xl sm:text-5xl mb-3">
            {isSuccess ? "Call Complete" : "Call Result"}
          </h1>
          <p className="text-white/50 font-inter text-sm">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {createdAt}
          </p>
        </motion.div>

        {/* Outcome Summary */}
        {call.outcome_summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 mb-6 ${
              isSuccess
                ? "bg-[#2DD4BF]/10 border border-[#2DD4BF]/25"
                : "bg-red-500/10 border border-red-500/25"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSuccess ? "bg-[#2DD4BF]/20" : "bg-red-500/20"
              }`}>
                {isSuccess
                  ? <CheckCircle2 className="w-5 h-5 text-[#2DD4BF]" />
                  : <XCircle className="w-5 h-5 text-red-400" />
                }
              </div>
              <div>
                <p className={`font-outfit font-semibold text-sm mb-1 ${
                  isSuccess ? "text-[#2DD4BF]" : "text-red-400"
                }`}>
                  Outcome Summary
                </p>
                <p className="text-white/85 font-inter text-sm leading-relaxed">
                  {call.outcome_summary}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="font-outfit font-semibold text-base mb-4 text-white/80">Call Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-white/40 font-inter text-xs mb-1">Caller</p>
              <p className="font-outfit font-medium">{call.caller_name}</p>
            </div>
            <div>
              <p className="text-white/40 font-inter text-xs mb-1">Tone</p>
              <p className="font-outfit font-medium capitalize">
                {call.tone === "friendly" ? "😊" : call.tone === "firm" ? "💼" : "🔥"} {call.tone}
              </p>
            </div>
            <div>
              <p className="text-white/40 font-inter text-xs mb-1">Status</p>
              <p className={`font-outfit font-medium capitalize ${
                isSuccess ? "text-[#2DD4BF]" : "text-red-400"
              }`}>
                {call.status}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <p className="text-white/40 font-inter text-xs mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" /> Mission
              </p>
              <p className="text-white/80 font-inter text-sm leading-relaxed">{call.mission}</p>
            </div>
          </div>
        </motion.div>

        {/* Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="font-outfit font-semibold text-base mb-5 text-white/80">
            Full Transcript
          </h2>

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/40 font-inter text-sm">
                {call.transcript
                  ? call.transcript
                  : "No transcript available for this call."}
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "assistant" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === "assistant"
                      ? "bg-[#6B21A8]/50 border border-[#6B21A8]/50"
                      : "bg-white/10 border border-white/15"
                  }`}>
                    {msg.role === "assistant"
                      ? <Bot className="w-3.5 h-3.5 text-[#C4B5FD]" />
                      : <User className="w-3.5 h-3.5 text-white/70" />
                    }
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-inter leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-[#6B21A8]/20 border border-[#6B21A8]/25 text-white/85 rounded-tl-sm"
                      : "bg-white/8 border border-white/10 text-white/75 rounded-tr-sm"
                  }`}>
                    <span className={`text-xs font-outfit font-medium block mb-1 ${
                      msg.role === "assistant" ? "text-[#C4B5FD]" : "text-white/40"
                    }`}>
                      {msg.role === "assistant" ? "GhostCall AI" : "Representative"}
                    </span>
                    {msg.message}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/call/new"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-outfit font-bold text-base bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6B21A8] text-white transition-all duration-300 glow-purple hover:scale-105"
          >
            <PhoneCall className="w-5 h-5" />
            Make Another Call
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-outfit font-medium text-sm glass hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
