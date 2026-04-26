"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Sparkles, Send, 
  RefreshCcw, User, Bot, Info
} from 'lucide-react';

export default function MeritCalculator() {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { 
        role: 'ai', 
        message: "Assalam-o-Alaikum! I am your Parho Barho AI Counselor. I have been trained on the latest 2026 data for Pakistani Universities, including their merit formulas, fee structures, and scholarship programs like Habib's GOP and NUST's financial aid. \n\nHow can I help you navigate your career today?" 
    }
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { role: 'user', message: prompt }]);
    
    // Placeholder for AI logic - You will connect your Backend API here later
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      
      {/* 1. SLIM NAV (Logo is now Clickable) */}
      <nav className="h-16 border-b border-white/10 flex justify-between items-center px-8 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">
            Parho<span className="text-blue-500">Barho</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                Merit AI v2.0
            </span>
            <Link href="/" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                Back to Home
            </Link>
        </div>
      </nav>

      {/* 2. CENTERED AI INTERFACE */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        
        <div className="w-full max-w-4xl flex flex-col h-[80vh] bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5">
          
          {/* AI Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl"><Sparkles className="w-5 h-5 text-white" /></div>
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

          {/* Chat Bubble Area */}
          <div className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide">
            {chatHistory.map((chat, index) => (
              <div key={index} className={`flex gap-5 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border ${
                    chat.role === 'ai' 
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}>
                  {chat.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed max-w-[80%] whitespace-pre-wrap ${
                    chat.role === 'ai' 
                    ? 'bg-white/[0.03] border border-white/5 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none font-medium'
                }`}>
                  {chat.message}
                </div>
              </div>
            ))}
          </div>

          {/* Centered Input Area */}
          <div className="p-8 bg-white/[0.01] border-t border-white/10">
            <div className="relative flex items-center max-w-3xl mx-auto group">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything: 'Recommend CS in Karachi with 80% Inter'..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-16 outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all text-sm placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2.5 bg-blue-600 p-3.5 rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <Info size={12} />
                AI is trained on the latest HEC and University Merit Policies for 2026
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