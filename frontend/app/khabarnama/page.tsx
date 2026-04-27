"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, ExternalLink, RefreshCw } from "lucide-react";

type NewsItem = {
  source: string;
  sourceKey: "hec" | "bsek" | "biek" | string;
  title: string;
  link: string;
};

type SourcePayload = {
  section?: "generic" | "universities" | "competitive" | string;
  source: string;
  sourceKey: string;
  url: string;
  items: NewsItem[];
  error: string | null;
};

type KhabarnamaPayload = {
  fetchedAt: string;
  totalItems: number;
  sections?: {
    generic?: SourcePayload[];
    universities?: SourcePayload[];
    competitive?: SourcePayload[];
  };
  sources: SourcePayload[];
};

const SOURCE_LABELS: Record<string, string> = {
  hec: "HEC Pakistan",
  bsek: "Board of Secondary Education",
  biek: "Board of Intermediate Education",
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type FlatNewsItem = NewsItem & {
  label: string;
};

function NewsTickerRow({
  items,
  direction = "left",
  secondsPerSlide = 9,
}: {
  items: FlatNewsItem[];
  direction?: "left" | "right";
  secondsPerSlide?: number;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-gray-500">
        Waiting for announcements in this lane...
      </div>
    );
  }

  const doubled = [...items, ...items];
  const duration = Math.max(36, items.length * secondsPerSlide);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div
        className={`khabarnama-ticker flex w-max gap-4 py-4 px-3 ${direction === "right" ? "khabarnama-ticker-right" : ""}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, index) => (
          <a
            key={`${item.link}-${index}`}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="group min-w-[320px] max-w-[320px] rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-3 hover:border-indigo-500/40 hover:bg-indigo-500/[0.08] transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-indigo-400 font-black">{item.label}</p>
            <p className="mt-2 text-sm text-gray-200 leading-snug group-hover:text-white line-clamp-3">{item.title}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-bold text-indigo-300">
              Open notice <ExternalLink className="w-3 h-3" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function KhabarnamaPage() {
  const [data, setData] = useState<KhabarnamaPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/khabarnama`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const payload = (await response.json()) as KhabarnamaPayload;
      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const timer = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const tickerRows = useMemo(() => {
    if (!data) {
      return [[], [], []] as FlatNewsItem[][];
    }

    const fromSection = (sectionKey: "generic" | "universities" | "competitive") => {
      const sectionSources = data.sections?.[sectionKey];
      if (Array.isArray(sectionSources)) {
        return sectionSources;
      }
      // Backward compatibility with old payloads.
      return data.sources.filter((s) => (s.section || "generic") === sectionKey);
    };

    const makeRow = (sectionKey: "generic" | "universities" | "competitive") =>
      fromSection(sectionKey).flatMap((source) =>
        source.items.map((item) => ({
          ...item,
          label: SOURCE_LABELS[source.sourceKey] || source.source,
        }))
      );

    const rows: FlatNewsItem[][] = [
      makeRow("generic"),
      makeRow("universities"),
      makeRow("competitive"),
    ];

    // If one section is empty, borrow a few from all sources to avoid blank row.
    const fallbackPool = data.sources.flatMap((source) =>
      source.items.map((item) => ({
        ...item,
        label: SOURCE_LABELS[source.sourceKey] || source.source,
      }))
    );

    rows.forEach((row, idx) => {
      if (row.length === 0) {
        rows[idx] = fallbackPool.filter((_, poolIdx) => poolIdx % 3 === idx).slice(0, 10);
      }
    });

    return rows;
  }, [data]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      <section className="relative pt-20 pb-10 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[520px] bg-indigo-600/10 blur-[150px] rounded-full -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase bg-indigo-500/5 border border-indigo-500/20 rounded-full">
            <BellRing className="w-3 h-3" />
            Live Education Alerts
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter mb-4">
            The <span className="text-indigo-400">Khabarnama</span>
            <br />
            <span className="inline-block pr-2 pb-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Live Education Feed
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
            Automatically tracking official updates from HEC, Board of Secondary Education, and Board of Intermediate
            Education.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-bold">
            {data ? `Last synced: ${new Date(data.fetchedAt).toLocaleString()}` : "Waiting for first sync"}
          </p>
          <button
            onClick={fetchNews}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.1em] border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Could not load news right now: {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black">Generic (Boards + HEC + Govt)</p>
          <NewsTickerRow items={tickerRows[0]} direction="left" secondsPerSlide={9} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black">Universities</p>
          <NewsTickerRow items={tickerRows[1]} direction="right" secondsPerSlide={9} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-black">Competitive Exams</p>
          <NewsTickerRow items={tickerRows[2]} direction="left" secondsPerSlide={9} />
        </div>
      </section>
      <style jsx global>{`
        @keyframes khabarnama-scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .khabarnama-ticker {
          animation-name: khabarnama-scroll-left;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .khabarnama-ticker-right {
          animation-direction: reverse;
        }
        .khabarnama-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
