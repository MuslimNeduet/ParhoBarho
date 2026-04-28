"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Sparkles, Send, RefreshCcw, User, Bot, Info } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

type ChatRole = "user" | "assistant";
type UiRole = "user" | "ai";

export default function FindMyUniversityPage() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai" as const,
      message:
        "Assalam-o-Alaikum! I am your Parho Barho AI Counselor. I have been trained on the latest 2026 data for Pakistani Universities, including their merit formulas, fee structures, and scholarship programs like Habib's GOP and NUST's financial aid. \n\nHow can I help you navigate your career today?",
    },
  ]);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, thinking]);

  const apiMessages = useMemo(
    () =>
      chatHistory.map((m) => ({
        role: (m.role === "ai" ? "assistant" : "user") as ChatRole,
        content: m.message,
      })),
    [chatHistory]
  );

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setError(null);
    const userMessage = prompt;
    setPrompt("");
    setChatHistory((prev) => [...prev, { role: "user" as const, message: userMessage }]);

    setThinking(true);
    try {
      const resp = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...apiMessages, { role: "user", content: userMessage }] }),
      });

      const data = (await resp.json().catch(() => ({}))) as { reply?: string; message?: string; error?: string };
      if (!resp.ok) {
        throw new Error(data?.message || data?.error || `Request failed (${resp.status})`);
      }

      if (!data.reply) {
        throw new Error("Empty reply from AI.");
      }

      setChatHistory((prev) => [...prev, { role: "ai" as const, message: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI request failed.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-[#050505] text-white flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full h-full">
        <div className="w-full max-w-4xl flex flex-col flex-1 bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold">AI Admission Counselor</h2>
                <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Trained on 2026 Data
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatHistory([chatHistory[0]])}
              className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto scrollbar-hide no-scrollbar flex flex-col justify-start">
            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex gap-5 ${chat.role === ("user" as UiRole) ? "flex-row-reverse" : ""}`}>
                <div
                  className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                    chat.role === "ai"
                      ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                >
                  {chat.role === "ai" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div
                  className={`p-5 rounded-[1.5rem] text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${
                    chat.role === "ai"
                      ? "bg-white/[0.03] border border-white/5 rounded-tl-none"
                      : "bg-blue-600 text-white rounded-tr-none font-medium"
                  }`}
                >
                  {chat.message}
                </div>
              </div>
            ))}
            {thinking ? (
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border bg-blue-600/10 border-blue-500/30 text-blue-400">
                  <Bot size={20} />
                </div>
                <div className="p-5 rounded-[1.5rem] text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap bg-white/[0.03] border border-white/5 rounded-tl-none text-gray-200">
                  Thinking...
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
          </div>

          <div className="p-8 bg-white/[0.01] border-t border-white/10">
            <div className="relative flex items-center max-w-3xl mx-auto group">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !thinking && handleSend()}
                placeholder="Ask anything: 'Recommend CS in Karachi with 80% Inter'..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-16 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-gray-600"
              />
              <button
                onClick={handleSend}
                disabled={thinking}
                className="absolute right-2.5 bg-blue-600 p-3.5 rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <Info size={12} />
              Answers are grounded in admin-provided data
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[10px] text-gray-700 font-bold tracking-[0.3em] uppercase">
        Powered by Parho Barho Engine
      </footer>
    </div>
  );
}

