"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Headphones,
  CreditCard,
  Building2,
  HeartPulse,
  Package,
  BadgeCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const steps = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Enter Your Mission",
    desc: "Tell the AI what you need done — cancel a subscription, dispute a charge, request a refund, or anything else.",
  },
  {
    icon: <PhoneCall className="w-6 h-6" />,
    title: "AI Makes the Call",
    desc: "GhostCall dials the number, navigates hold menus, and handles the conversation with your chosen tone.",
  },
  {
    icon: <BadgeCheck className="w-6 h-6" />,
    title: "Get the Results",
    desc: "Receive a full transcript and outcome summary. Mission accomplished — without spending a minute on hold.",
  },
];

const useCases = [
  {
    icon: <CreditCard className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Cancel Subscriptions",
    desc: "End unwanted memberships without being put on hold for 45 minutes.",
  },
  {
    icon: <Package className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Request Refunds",
    desc: "Dispute charges and demand refunds from stubborn billing departments.",
  },
  {
    icon: <Building2 className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Negotiate Bills",
    desc: "Lower your cable, internet, or insurance rates with a firm AI negotiator.",
  },
  {
    icon: <HeartPulse className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Insurance Claims",
    desc: "Navigate complex insurance processes and get your claims approved.",
  },
  {
    icon: <Headphones className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Customer Support",
    desc: "Escalate tech issues and get real resolutions, not scripted responses.",
  },
  {
    icon: <Star className="w-5 h-5 text-[#C4B5FD]" />,
    title: "Loyalty Upgrades",
    desc: "Claim promotions, loyalty discounts, and deals you deserve.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0D0B1E] text-white overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B21A8] to-[#2DD4BF] flex items-center justify-center">
            <PhoneCall className="w-4 h-4 text-white" />
          </div>
          <span className="font-outfit font-bold text-lg tracking-tight">GhostCall AI</span>
        </div>
        <Link
          href="/call/new"
          className="flex items-center gap-1.5 text-sm font-medium text-[#C4B5FD] hover:text-white transition-colors"
        >
          Make a Call <ChevronRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-32 max-w-6xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6B21A8]/25 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#2DD4BF]/10 blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="relative z-10"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-[#C4B5FD] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              AI Voice Agent · Powered by Claude &amp; Vapi
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-outfit font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight mb-6"
          >
            We make the calls
            <br />
            <span className="text-gradient">you&apos;ve been avoiding.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 mb-10 leading-relaxed font-inter"
          >
            GhostCall AI dials customer service, navigates hold music, and handles
            the conversation — so you never have to sit on hold again.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/call/new"
              className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl font-outfit font-semibold text-base bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6B21A8] text-white transition-all duration-300 glow-purple hover:scale-105"
            >
              <PhoneCall className="w-5 h-5" />
              Make Your First Call
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-white/40 text-sm font-inter">No account needed · Free demo</span>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-12 border-t border-white/10"
          >
            {[
              { val: "< 60s", label: "Call setup" },
              { val: "3 tones", label: "Friendly to aggressive" },
              { val: "100%", label: "Full transcript" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-outfit font-bold text-2xl text-[#C4B5FD]">{s.val}</div>
                <div className="text-white/40 text-xs mt-0.5 font-inter">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#C4B5FD] text-sm font-medium tracking-widest uppercase mb-3 font-inter">How it works</p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl md:text-5xl">Three steps to mission complete</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                custom={i}
                className="relative glass glass-hover rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl bg-[#6B21A8]/30 border border-[#6B21A8]/50 flex items-center justify-center text-[#C4B5FD] mb-5">
                  {step.icon}
                </div>
                <div className="absolute top-6 right-6 font-outfit font-black text-5xl text-white/5 select-none">
                  0{i + 1}
                </div>
                <h3 className="font-outfit font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed font-inter">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Use cases */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#C4B5FD] text-sm font-medium tracking-widest uppercase mb-3 font-inter">Use cases</p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl md:text-5xl">
              Every call you&apos;ve been dreading
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                variants={fadeUp}
                custom={i}
                className="glass glass-hover rounded-xl p-6 group cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#6B21A8]/20 border border-[#6B21A8]/30 flex items-center justify-center shrink-0 group-hover:bg-[#6B21A8]/30 transition-colors">
                    {uc.icon}
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-base mb-1">{uc.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed font-inter">{uc.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Tone section */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-[#C4B5FD] text-sm font-medium tracking-widest uppercase mb-3 font-inter">Tone control</p>
            <h2 className="font-outfit font-bold text-3xl sm:text-4xl md:text-5xl">Your agent, your attitude</h2>
            <p className="mt-4 text-white/55 max-w-xl mx-auto text-base font-inter">
              Choose how assertive you want the AI to be. From a gentle nudge to a full escalation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                label: "Friendly",
                emoji: "😊",
                colorClass: "from-emerald-600/30 to-emerald-800/10",
                borderClass: "border-emerald-500/30",
                desc: "Warm and polite. Builds rapport, stays focused, accepts reasonable offers.",
              },
              {
                label: "Firm",
                emoji: "💼",
                colorClass: "from-[#6B21A8]/30 to-violet-900/10",
                borderClass: "border-[#6B21A8]/40",
                desc: "Professional and assertive. Pushes back, escalates if needed, won't be dismissed.",
              },
              {
                label: "Aggressive",
                emoji: "🔥",
                colorClass: "from-orange-600/30 to-red-900/10",
                borderClass: "border-orange-500/30",
                desc: "Relentless. Escalates immediately, references legal rights, doesn't take no for an answer.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.label}
                variants={fadeUp}
                custom={i}
                className={`rounded-2xl p-6 bg-gradient-to-br ${t.colorClass} border ${t.borderClass} backdrop-blur-sm`}
              >
                <div className="text-3xl mb-3">{t.emoji}</div>
                <h3 className="font-outfit font-bold text-xl mb-2">{t.label}</h3>
                <p className="text-white/60 text-sm leading-relaxed font-inter">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={fadeUp}
            className="relative glass rounded-3xl p-12 sm:p-16 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6B21A8]/20 to-[#2DD4BF]/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B21A8] to-[#2DD4BF] flex items-center justify-center mx-auto mb-6">
                <PhoneCall className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-outfit font-black text-4xl sm:text-5xl mb-4">
                Ready to ghost that hold music?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto font-inter">
                Enter your mission and let GhostCall AI handle the hard part.
                Free demo, no signup required.
              </p>
              <Link
                href="/call/new"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-outfit font-bold text-lg bg-gradient-to-r from-[#6B21A8] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6B21A8] text-white transition-all duration-300 glow-purple hover:scale-105"
              >
                <PhoneCall className="w-5 h-5" />
                Launch Your First Call
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6B21A8] to-[#2DD4BF] flex items-center justify-center">
            <PhoneCall className="w-3 h-3 text-white" />
          </div>
          <span className="font-outfit font-semibold text-sm">GhostCall AI</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/35 font-inter">
          <Shield className="w-3.5 h-3.5" />
          <span className="ml-1">Demo app · No real calls are recorded or stored permanently</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/35 font-inter">
          <Clock className="w-3.5 h-3.5" />
          <span className="ml-1">Powered by Vapi · Claude · Supabase</span>
        </div>
      </footer>
    </main>
  );
}
