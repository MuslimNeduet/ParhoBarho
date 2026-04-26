"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { HeartPulse, Landmark, Microscope, University } from "lucide-react";

const provinceUniversityData: Record<
  string,
  {
    province: string;
    medical: string[];
    engineering: string[];
    finance: string[];
    topTier: string[];
  }
> = {
  sindh: {
    province: "Sindh",
    medical: ["Dow University of Health Sciences", "Jinnah Sindh Medical University", "Liaquat University of Medical and Health Sciences"],
    engineering: ["NED University of Engineering and Technology", "Mehran University (Jamshoro)", "Dawood University of Engineering and Technology"],
    finance: ["Institute of Business Administration Karachi", "SZABIST", "IoBM (CBM)"],
    topTier: ["University of Karachi", "IBA Karachi", "NED University", "Dow University of Health Sciences"],
  },
  baluchistan: {
    province: "Baluchistan",
    medical: ["Bolan Medical College", "Quetta Institute of Medical Sciences", "Loralai Medical College"],
    engineering: ["BUITEMS", "Balochistan University of Engineering and Technology (Khuzdar)", "Lasbela University"],
    finance: ["University of Balochistan (Management Sciences)", "BUITEMS Business School", "University of Turbat (Business Programs)"],
    topTier: ["University of Balochistan", "BUITEMS", "Sardar Bahadur Khan Women University", "Lasbela University"],
  },
  punjab: {
    province: "Punjab",
    medical: ["King Edward Medical University", "Allama Iqbal Medical College", "Fatima Jinnah Medical University"],
    engineering: ["UET Lahore", "NUST CEME (Punjab Campus)", "FAST-NUCES Lahore"],
    finance: ["LUMS", "University of the Punjab (Hailey College)", "Lahore School of Economics"],
    topTier: ["LUMS", "University of the Punjab", "UET Lahore", "FAST-NUCES Lahore"],
  },
  khyberpakhtunkhua: {
    province: "Khyberpakhtunkhua",
    medical: ["Khyber Medical University", "Ayub Medical College", "Khyber Girls Medical College"],
    engineering: ["UET Peshawar", "GIKI", "CECOS University"],
    finance: ["Institute of Management Sciences Peshawar", "City University Peshawar", "Abasyn University"],
    topTier: ["University of Peshawar", "GIKI", "UET Peshawar", "Institute of Management Sciences Peshawar"],
  },
};

const categoryCards = [
  { key: "medical", title: "Medical Universities", icon: HeartPulse, accent: "text-rose-400 border-rose-500/30" },
  { key: "engineering", title: "Engineering Universities", icon: Microscope, accent: "text-blue-400 border-blue-500/30" },
  { key: "finance", title: "Finance Universities", icon: Landmark, accent: "text-amber-400 border-amber-500/30" },
  { key: "topTier", title: "Top Tier Universities", icon: University, accent: "text-emerald-400 border-emerald-500/30" },
] as const;

export default function ProvinceUniversitiesPage() {
  const params = useParams<{ province: string }>();
  const provinceKey = params?.province;
  const data = provinceKey ? provinceUniversityData[provinceKey] : null;

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <section className="relative pt-20 pb-14 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] text-blue-400 font-black tracking-[0.2em] mb-4 uppercase">{data.province} University Intelligence</p>
          <h1 className="text-5xl md:text-7xl font-black mb-7 leading-[1.12] tracking-tight italic">
            {data.province},
            <br />
            <span className="inline-block pr-2 pb-1 not-italic bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent underline decoration-blue-500/30">
              Top Institutions by Stream
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            Explore specialized university pathways with separate tracks for Medical, Engineering, Finance, and overall
            top-tier institutions in {data.province}.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {categoryCards.map((category) => {
            const Icon = category.icon;
            const list = data[category.key];
            return (
              <article key={category.key} className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 hover:border-white/30 transition-all">
                <div className={`inline-flex items-center gap-2 mb-5 text-[10px] font-black tracking-[0.18em] uppercase px-3 py-1 rounded-full border ${category.accent}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {category.title}
                </div>
                <ul className="space-y-2">
                  {list.map((item) => (
                    <li key={item} className="text-gray-300 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
