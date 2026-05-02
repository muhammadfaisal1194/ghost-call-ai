"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  PhoneCall,
  ArrowLeft,
  Loader2,
  User,
  Target,
  Phone,
  Volume2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CallTone, StartCallPayload } from "@/types";

const toneOptions: { value: CallTone; label: string; emoji: string; desc: string; color: string }[] = [
  {
    value: "friendly",
    label: "Friendly",
    emoji: "😊",
    desc: "Warm & polite, stays focused on the goal",
    color: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/15",
  },
  {
    value: "firm",
    label: "Firm",
    emoji: "💼",
    desc: "Professional & assertive, escalates if needed",
    color: "border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/15",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    emoji: "🔥",
    desc: "Relentless, references rights, won't back down",
    color: "border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/15",
  },
];

const missionExamples = [
  "Cancel my Spotify Premium subscription",
  "Request a refund for my last charge",
  "Negotiate a lower rate on my internet bill",
  "Dispute an unauthorized charge on my account",
];

export default function NewCallPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<StartCallPayload>({
    caller_name: "",
    mission: "",
    phone_number: "",
    tone: "firm",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function setTone(tone: CallTone) {
    setForm((prev) => ({ ...prev, tone }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.caller_name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.mission.trim()) {
      toast.error("Please describe your mission");
      return;
    }
    if (!form.phone_number.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/start-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start call");
      }

      toast.success("Call initiated! Connecting...");
      router.push(`/call/${data.callId}/status`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0B1E] text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#6B21A8]/20 blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-inter">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6B21A8] to-[#2DD4BF] flex items-center justify-center">
            <PhoneCall className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-outfit font-bold text-base">GhostCall AI</span>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="font-outfit font-black text-4xl sm:text-5xl mb-3">
              Brief your agent
            </h1>
            <p className="text-white/55 font-inter">
              Tell the AI what to say and how to say it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Caller Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <Label className="flex items-center gap-2 text-white/80 font-outfit font-medium text-sm mb-3">
                <User className="w-4 h-4 text-[#C4B5FD]" />
                Your Name
              </Label>
              <Input
                name="caller_name"
                value={form.caller_name}
                onChange={handleChange}
                placeholder="e.g. Alex Johnson"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#6B21A8] focus:ring-[#6B21A8]/20 rounded-xl h-11 font-inter"
                disabled={loading}
              />
              <p className="text-white/35 text-xs mt-2 font-inter">
                The AI will identify itself as calling on behalf of this name.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-6"
            >
              <Label className="flex items-center gap-2 text-white/80 font-outfit font-medium text-sm mb-3">
                <Target className="w-4 h-4 text-[#C4B5FD]" />
                Mission
              </Label>
              <Textarea
                name="mission"
                value={form.mission}
                onChange={handleChange}
                placeholder="Describe exactly what you want the AI to accomplish on this call..."
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#6B21A8] focus:ring-[#6B21A8]/20 rounded-xl min-h-[110px] resize-none font-inter text-sm"
                disabled={loading}
              />
              <div className="mt-3">
                <p className="text-white/35 text-xs mb-2 font-inter">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {missionExamples.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, mission: ex }))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#6B21A8]/30 border border-white/10 hover:border-[#6B21A8]/50 text-white/60 hover:text-[#C4B5FD] transition-all font-inter"
                      disabled={loading}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <Label className="flex items-center gap-2 text-white/80 font-outfit font-medium text-sm mb-3">
                <Phone className="w-4 h-4 text-[#C4B5FD]" />
                Phone Number to Call
              </Label>
              <Input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="+1 (800) 555-0100"
                type="tel"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-[#6B21A8] focus:ring-[#6B21A8]/20 rounded-xl h-11 font-inter"
                disabled={loading}
              />
              <p className="text-white/35 text-xs mt-2 font-inter">
                Include country code (e.g. +1 for US). The AI will call this number.
              </p>
            </motion.div>

            {/* Tone */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-6"
            >
              <Label className="flex items-center gap-2 text-white/80 font-outfit font-medium text-sm mb-4">
                <Volume2 className="w-4 h-4 text-[#C4B5FD]" />
                Agent Tone
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {toneOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTone(option.value)}
                    disabled={loading}
                    className={`relative rounded-xl p-4 border text-left transition-all duration-200 ${
                      form.tone === option.value
                        ? option.color + " ring-2 ring-offset-0 ring-offset-transparent " +
                          (option.value === "friendly"
                            ? "ring-emerald-500/60"
                            : option.value === "firm"
                            ? "ring-violet-500/60"
                            : "ring-orange-500/60")
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    <div className="text-xl mb-2">{option.emoji}</div>
                    <div className="font-outfit font-semibold text-sm mb-1">{option.label}</div>
                    <div className="text-white/50 text-xs leading-relaxed font-inter">{option.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-outfit font-bold text-base bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6B21A8] text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-100 glow-purple"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initiating Call...
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-5 h-5" />
                    Launch Call
                  </>
                )}
              </button>
              <p className="text-center text-white/30 text-xs mt-3 font-inter">
                By continuing, you confirm you have permission to call this number.
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
