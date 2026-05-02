"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, ArrowLeft, Clock, Mic, Loader2 } from "lucide-react";
import type { Call } from "@/types";

const statusMessages = [
  "Dialing the number...",
  "Waiting for someone to answer...",
  "Navigating the phone menu...",
  "Speaking with a representative...",
  "Handling the conversation...",
  "Wrapping up the call...",
];

export default function StatusPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [call, setCall] = useState<Call | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const msgRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_WAIT_SECONDS = 90;

  useEffect(() => {
    // Elapsed timer — force redirect after MAX_WAIT_SECONDS if still in_progress
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => {
        const next = s + 1;
        if (next >= MAX_WAIT_SECONDS) {
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          clearInterval(msgRef.current!);
          router.push(`/call/${id}/result`);
        }
        return next;
      });
    }, 1000);

    // Cycling status messages
    msgRef.current = setInterval(() => {
      setMessageIndex((i) => (i + 1) % statusMessages.length);
    }, 4500);

    // Poll for status
    async function poll() {
      try {
        const res = await fetch(`/api/call-status/${id}`);
        if (!res.ok) return;
        const data: Call = await res.json();
        setCall(data);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          clearInterval(msgRef.current!);

          // Small delay so user sees the final state
          setTimeout(() => {
            router.push(`/call/${id}/result`);
          }, 1500);
        }
      } catch {
        // silently continue polling
      }
    }

    poll();
    pollRef.current = setInterval(poll, 3000);

    return () => {
      clearInterval(pollRef.current!);
      clearInterval(timerRef.current!);
      clearInterval(msgRef.current!);
    };
  }, [id, router]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const isCompleted = call?.status === "completed";
  const isFailed = call?.status === "failed";
  const isDone = isCompleted || isFailed;

  return (
    <div className="min-h-screen bg-[#0D0B1E] text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#6B21A8]/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[#2DD4BF]/8 blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto w-full">
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

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg text-center">
          {/* Pulse orb */}
          <div className="relative flex items-center justify-center mb-12">
            {/* Outer rings */}
            {!isDone && (
              <>
                <motion.div
                  className="absolute w-48 h-48 rounded-full border border-[#6B21A8]/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-36 h-36 rounded-full border border-[#6B21A8]/30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute w-28 h-28 rounded-full border border-[#6B21A8]/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                />
              </>
            )}

            {/* Center orb */}
            <motion.div
              className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                isDone
                  ? isCompleted
                    ? "bg-gradient-to-br from-[#2DD4BF] to-emerald-600"
                    : "bg-gradient-to-br from-red-600 to-red-800"
                  : "bg-gradient-to-br from-[#6B21A8] to-[#7C3AED]"
              }`}
              animate={isDone ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }}
              transition={isDone ? { duration: 0.4 } : { duration: 2, repeat: Infinity }}
            >
              {isDone ? (
                isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PhoneCall className="w-8 h-8 text-white" />
                  </motion.div>
                ) : (
                  <PhoneCall className="w-8 h-8 text-white opacity-50" />
                )
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}

              {/* Glow */}
              {!isDone && (
                <div className="absolute inset-0 rounded-full bg-[#6B21A8]/50 blur-xl -z-10" />
              )}
            </motion.div>
          </div>

          {/* Status text */}
          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="font-outfit font-black text-3xl sm:text-4xl mb-3">
                  {isCompleted ? "Call Complete!" : "Call Ended"}
                </h1>
                <p className="text-white/60 font-inter">
                  {isCompleted
                    ? "Redirecting to your results..."
                    : "The call has ended. Redirecting..."}
                </p>
                <Loader2 className="w-5 h-5 animate-spin text-[#C4B5FD] mx-auto mt-4" />
              </motion.div>
            ) : (
              <motion.div
                key="in-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="font-outfit font-black text-3xl sm:text-4xl mb-3">
                  Call in Progress
                </h1>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.35 }}
                    className="text-[#C4B5FD] font-inter text-lg"
                  >
                    {statusMessages[messageIndex]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call info card */}
          {call && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 text-left mb-6"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                <div className="col-span-2">
                  <p className="text-white/40 font-inter text-xs mb-1">Mission</p>
                  <p className="text-white/80 font-inter text-sm leading-relaxed">{call.mission}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Timer */}
          {!isDone && (
            <div className="flex items-center justify-center gap-2 text-white/40 font-inter text-sm">
              <Clock className="w-4 h-4" />
              <span>Elapsed: {formatTime(elapsedSeconds)}</span>
            </div>
          )}

          {/* Wave animation */}
          {!isDone && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-[#6B21A8]"
                  animate={{ height: ["8px", "28px", "8px"] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
