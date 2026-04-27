"use client";

import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

const provinces = [
  {
    value: "sindh",
    label: "Sindh",
    accent: "blue",
    overview: "Karachi-centered excellence with strong engineering, business, and medical institutions.",
  },
  {
    value: "baluchistan",
    label: "Baluchistan",
    accent: "emerald",
    overview: "Emerging academic ecosystem with STEM growth and expanding professional pathways.",
  },
  {
    value: "punjab",
    label: "Punjab",
    accent: "orange",
    overview: "Largest higher-education hub with broad options across public and private sectors.",
  },
  {
    value: "khyberpakhtunkhua",
    label: "Khyberpakhtunkhua",
    accent: "indigo",
    overview: "Strong engineering and management institutions with growing research-oriented campuses.",
  },
];

const accentClasses: Record<string, string> = {
  blue: "border-blue-500/40 bg-blue-500/[0.04] text-blue-400",
  emerald: "border-emerald-500/40 bg-emerald-500/[0.04] text-emerald-400",
  orange: "border-orange-500/40 bg-orange-500/[0.04] text-orange-400",
  indigo: "border-indigo-500/40 bg-indigo-500/[0.04] text-indigo-400",
};

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <section className="relative pt-20 pb-14 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase bg-blue-500/5 border border-blue-500/20 rounded-full">
            <MapPinned className="w-3 h-3" />
            Provincial University Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-[1.1] tracking-tighter">
            Discover Top
            <br />
            <span className="inline-block pr-2 pb-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Universities
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            Discover high-performing institutions in Sindh, Baluchistan, Punjab, and Khyberpakhtunkhua with a focused
            path for your next admission decision.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {provinces.map((province) => (
            <article key={province.value} className="rounded-[2rem] border p-8 transition-all border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between mb-5">
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full border ${accentClasses[province.accent]}`}
                  >
                    {province.label}
                  </p>
                </div>
                <h2 className="text-2xl font-bold mb-4">Provincial University Hub</h2>
                <p className="text-sm text-gray-300 mb-7 leading-relaxed">{province.overview}</p>
                <Link
                  href={`/universities/${province.value}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 hover:gap-3 transition-all"
                >
                  Go to Universities <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
          ))}
        </div>
      </section>
    </div>
  );
}
