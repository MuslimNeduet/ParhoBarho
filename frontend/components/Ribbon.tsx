"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calculator, GraduationCap } from "lucide-react";

const provinces = [
  { label: "Sindh", value: "sindh" },
  { label: "Baluchistan", value: "baluchistan" },
  { label: "Punjab", value: "punjab" },
  { label: "Khyberpakhtunkhua", value: "khyberpakhtunkhua" },
];

export default function Ribbon() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `hover:text-white transition-colors ${pathname === href ? "text-white" : "text-gray-400"}`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#050505]/80">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer flex-shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">
            Parho<span className="text-blue-500">Barho</span>
          </span>
        </Link>

        <div className="hidden lg:flex gap-6 text-[11px] font-bold uppercase tracking-[0.1em]">
          <div className="relative group">
            <button
              type="button"
              className="text-[12px] font-bold uppercase tracking-[0.1em] text-gray-300 hover:text-white transition-colors"
            >
              Universities
            </button>
            <div className="absolute left-0 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="w-[320px] rounded-2xl border border-white/10 bg-[#0b0b0b]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/40">
                <p className="text-[10px] text-blue-400 font-black tracking-[0.2em] mb-3">PROVINCE DIRECTORY</p>
                <div className="space-y-2">
                  {provinces.map((province) => (
                    <Link
                      key={province.value}
                      href={`/universities/${province.value}`}
                      className="block rounded-xl px-3 py-2 bg-white/[0.03] border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/[0.06] text-[12px] text-gray-100 font-bold uppercase tracking-[0.08em] transition-colors"
                    >
                      {province.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Resources
          </a>
          <Link href="/exams" className={linkClass("/exams")}>
            Exams
          </Link>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            Diplomas & Courses
          </a>
          <Link href="/merit-calculator" className={`${linkClass("/merit-calculator")} flex items-center gap-1.5`}>
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
  );
}
