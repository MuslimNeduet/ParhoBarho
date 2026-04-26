"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  ShieldCheck,
  Target,
  Trophy,
} from "lucide-react";

const tracks = [
  {
    tag: "Elite Civil Service",
    title: "CSS Master Track",
    description:
      "Prelims-to-interview roadmap, compulsory + optional subject strategy, and smart weekly revision cycles.",
    points: ["Syllabus blueprint", "Past-paper pattern mapping", "Panel interview prep"],
    accent: "orange",
  },
  {
    tag: "Global Finance",
    title: "CFA Accelerator",
    description:
      "Level-wise prep architecture, high-yield topic sequencing, and professional study planning for working candidates.",
    points: ["Ethics and FRA deep drills", "Mock exam analytics", "Career pathway briefing"],
    accent: "blue",
  },
  {
    tag: "Public Sector Careers",
    title: "FPSC / Police Radar",
    description:
      "Centralized vacancy watch, screening-test style guides, and role-specific prep plans for govt recruitment.",
    points: ["Live opportunity stream", "Physical + written split prep", "Department-wise exam templates"],
    accent: "green",
  },
];

const accentStyles: Record<string, string> = {
  orange: "text-orange-400 border-orange-500/30 hover:border-orange-500/50",
  blue: "text-blue-400 border-blue-500/30 hover:border-blue-500/50",
  green: "text-green-400 border-green-500/30 hover:border-green-500/50",
};

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* SLIM RIBBON (MATCH HOMEPAGE) */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#050505]/80">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tighter">
              Parho<span className="text-blue-500">Barho</span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
            <a href="#" className="hover:text-white transition-colors">
              Universities
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Resources
            </a>
            <Link href="/exams" className="text-white">
              Exams
            </Link>
            <a href="#" className="hover:text-white transition-colors">
              Diplomas & Courses
            </a>
            <Link
              href="/merit-calculator"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" /> Merit Calculator
            </Link>
            <a href="#" className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors">
              <Bell className="w-3.5 h-3.5" /> Khabarnama
            </a>
          </div>

          <button className="hidden md:block bg-white text-black px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors flex-shrink-0">
            Join Now
          </button>
        </div>
      </nav>

      <section className="relative px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase bg-blue-500/5 border border-blue-500/20 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            National Competitive Exam Command Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter italic mb-7">
            Exams, Structured Like
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent underline decoration-blue-500/30">
              A High-End Career Portal
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            Choose your track and execute with confidence. From CSS civil service ambitions to CFA finance goals and
            FPSC/Police recruitment pipelines, everything is organized in one futuristic workspace.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <article
              key={track.title}
              className={`rounded-[2rem] bg-white/[0.03] border p-8 transition-all ${accentStyles[track.accent]}`}
            >
              <p className={`font-black text-[10px] uppercase tracking-widest mb-4 ${accentStyles[track.accent].split(" ")[0]}`}>
                {track.tag}
              </p>
              <h2 className="text-2xl font-bold mb-4">{track.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{track.description}</p>
              <ul className="space-y-3 mb-8">
                {track.points.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-white/80" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
                Open Track <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-white/5 pt-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
              <Target className="w-4 h-4" /> Precision Planning
            </div>
            <h3 className="text-2xl font-bold mb-3">Adaptive Study Flow</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tactical scheduling by attempt window, subject weightage, and progression checkpoints.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
              <FileText className="w-4 h-4" /> Resource Intelligence
            </div>
            <h3 className="text-2xl font-bold mb-3">Guides + Alerts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Curated material packs with timely updates on syllabi, notifications, and exam policy shifts.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center gap-2 text-green-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
              <Briefcase className="w-4 h-4" /> Career Outcomes
            </div>
            <h3 className="text-2xl font-bold mb-3">From Prep to Placement</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect preparation milestones with real-world role pathways and long-term growth tracks.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Trophy className="text-blue-500 w-5 h-5" />
          <span className="font-bold">Exam Command by Parho Barho</span>
        </div>
        <p className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">
          Designed for Future Officers and Professionals
        </p>
      </footer>
    </div>
  );
}
