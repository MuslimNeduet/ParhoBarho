"use client";
import React from 'react';
import { 
  GraduationCap, Search, Map, Zap, BookOpen, 
  ArrowRight, Award, Globe, Target, ShieldCheck
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      
      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase bg-blue-500/5 border border-blue-500/20 rounded-full">
            <Globe className="w-3 h-3" /> National Career & Education Map
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.12] tracking-tight italic">
            Your Future, <br />{" "}
            <span className="inline-block pr-2 pb-1 not-italic bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent underline decoration-blue-500/30">
              Unlocked!
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            From board exams to your dream career. Explore top universities, competitive exams like CSS/CFA, and vocational pathways.
          </p>

          {/* Unified Search Bar */}
          <div className="relative max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 group focus-within:border-blue-500/50 transition-colors shadow-2xl">
            <div className="flex-1 flex items-center w-full px-4">
              <Search className="text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search NUST, CSS Guide, or 'Police Recruitment'..." 
                className="bg-transparent w-full px-4 py-4 outline-none text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-12 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              Find My Path
            </button>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
            <Map className="w-10 h-10 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">University Directory</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Explore institutes across Pakistan. Fee structures and merits.</p>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest">Explore <ArrowRight className="w-4 h-4" /></div>
          </div>

          <div className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer">
            <BookOpen className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">Resources Hub</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Entry Test patterns (ECAT, MDCAT, NET) and syllabus bridge notes.</p>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest">Study <ArrowRight className="w-4 h-4" /></div>
          </div>

          <div className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer">
            <Target className="w-10 h-10 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">Competitive Exams</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">CSS, CFA, FPSC, and specialized Govt recruitment guides.</p>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-widest">Achieve <ArrowRight className="w-4 h-4" /></div>
          </div>

          <div className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer">
            <Zap className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">Diplomas & Courses</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">Skill-based DAE programs and top-tier tech courses.</p>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase tracking-widest">Learn <ArrowRight className="w-4 h-4" /></div>
          </div>

        </div>
      </section>

      {/* 4. THE EXAM RADAR */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex items-center gap-4 mb-12">
            <ShieldCheck className="text-orange-500 w-8 h-8" />
            <h2 className="text-3xl font-bold italic">The Exam Radar</h2>
            <div className="h-px flex-1 bg-white/10" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 group hover:border-orange-500/30 transition-colors">
                <h4 className="text-orange-400 font-black text-[10px] uppercase mb-4 tracking-widest">Elite Civil Service</h4>
                <h3 className="text-2xl font-bold mb-4">CSS / PMS</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Complete syllabus breakdown and past papers for the Bureaucracy of Pakistan.</p>
                <button className="text-white font-bold flex items-center gap-2 text-sm group-hover:gap-4 transition-all">View Guide <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                <h4 className="text-blue-400 font-black text-[10px] uppercase mb-4 tracking-widest">Finance & Professional</h4>
                <h3 className="text-2xl font-bold mb-4">CFA / ACCA</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Transition from local commerce to global finance standards with resource mapping.</p>
                <button className="text-white font-bold flex items-center gap-2 text-sm group-hover:gap-4 transition-all">View Guide <ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/5 group hover:border-green-500/30 transition-colors">
                <h4 className="text-green-400 font-black text-[10px] uppercase mb-4 tracking-widest">Government Jobs</h4>
                <h3 className="text-2xl font-bold mb-4">FPSC / Police</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Direct alerts for recruitment and test patterns for Law Enforcement roles.</p>
                <button className="text-white font-bold flex items-center gap-2 text-sm group-hover:gap-4 transition-all">View Guide <ArrowRight className="w-4 h-4" /></button>
            </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
           <GraduationCap className="text-blue-500 w-5 h-5" />
           <span className="font-bold">Parho Barho</span>
        </div>
        <p className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase">Built for the Students of Pakistan</p>
      </footer>
    </div>
  );
}