"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Lock, RefreshCw, Send } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type KnowledgeItem = {
  id?: string;
  text: string;
  createdAt?: string;
};

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("parhobarho_admin_token");
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("parhobarho_admin_token", token);
  }, [token]);

  const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token.trim()) {
      setItems([]);
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const resp = await fetch(`${API_BASE}/api/admin/knowledge`, { headers: authHeader, cache: "no-store" });
      if (!resp.ok) throw new Error(`Load failed (${resp.status})`);
      const data = (await resp.json()) as { items: KnowledgeItem[] };
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to load knowledge.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load when token becomes available/changes.
  useEffect(() => {
    const trimmed = token.trim();
    if (!trimmed) {
      setItems([]);
      setStatus(null);
      return;
    }

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-refresh every few seconds while the tab is visible.
  useEffect(() => {
    if (!token.trim()) return;

    const start = () => {
      if (pollRef.current) return;
      pollRef.current = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          void load();
        }
      }, 3000);
    };

    const stop = () => {
      if (!pollRef.current) return;
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    };

    start();
    document.addEventListener("visibilitychange", start);

    return () => {
      document.removeEventListener("visibilitychange", start);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setStatus(null);
    try {
      const resp = await fetch(`${API_BASE}/api/admin/knowledge`, {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = (await resp.json().catch(() => ({}))) as { message?: string; created?: KnowledgeItem };
      if (!resp.ok) throw new Error(data?.message || `Save failed (${resp.status})`);
      setText("");
      setStatus("Saved.");
      if (data?.created?.text) {
        setItems((prev) => [data.created!, ...prev]);
      }
      void load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to save knowledge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight italic">Admin Knowledge Base</h1>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-2xl">
              Paste university/process data here (admissions steps, documents, eligibility, deadlines). Students will get
              answers grounded in these entries.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-[0.1em] border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 mb-8">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Admin Token
          </label>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste ADMIN_TOKEN"
            className="mt-3 w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 text-sm placeholder:text-gray-600"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">
            Add Knowledge Entry
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: NUST admissions: NET dates, required docs, min eligibility, fee ranges..."
            className="mt-3 w-full min-h-[160px] bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue-500/50 text-sm placeholder:text-gray-600"
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">{status ? status : " "}</p>
            <button
              onClick={submit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-sm transition-all active:scale-95"
            >
              <Send className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-black tracking-[0.2em] uppercase text-gray-400 mb-4">Latest entries</h2>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id ?? `${idx}-${item.createdAt ?? "x"}`} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-black text-green-400 inline-flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Stored
                  </span>
                  {item.createdAt ? (
                    <span className="text-[10px] uppercase tracking-[0.18em] font-black text-gray-600">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{item.text}</p>
              </div>
            ))}
            {items.length === 0 ? <p className="text-sm text-gray-500">No entries yet.</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

