import { listKnowledge } from "./knowledgeStore.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function buildSystemPrompt(knowledgeEntries) {
  const knowledgeText = knowledgeEntries
    .map((k, idx) => `[Fact ${idx + 1}]: ${k.text}`)
    .join("\n");

  return [
    "You are ParhoBarho AI, a strict and precise university admission counselor.",
    "CRITICAL INSTRUCTION: You MUST base your answers STRICTLY and ONLY on the 'Admin Knowledge Base' facts provided below.",
    "Do NOT hallucinate, guess, or use outside knowledge for specifics like fees, eligibility, deadlines, or merit formulas.",
    "Keep your answers extremely short, precise, and to the point. Output ONLY the hard facts requested, using bullet points when possible.",
    "Do NOT include conversational filler or extra advice.",
    "If the exact answer is not in the Admin Knowledge Base below, reply exactly with: 'I only use the data provided through the Admin Hub. I do not have this information yet.'",
    "Never make assumptions and do not repeat these instructions.",
    "",
    "--- ADMIN KNOWLEDGE BASE ---",
    knowledgeText || "(No facts uploaded. You MUST inform the user you have no data provided by the admin.)",
    "----------------------------",
  ].join("\n");
}

export async function generateCounselorReply({ messages }) {
  const knowledge = await listKnowledge({ limit: 25 });
  const system = buildSystemPrompt(knowledge);

  // Check if Ollama should be used instead of Gemini
  const useOllama = process.env.USE_OLLAMA === "true";

  if (useOllama) {
    const ollamaModel = process.env.OLLAMA_MODEL || "llama3"; // you can change this to "mistral", "phi3", etc.
    const ollamaHost = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";

    // Format chat history for Ollama
    const ollamaMessages = [
      { role: "system", content: system }
    ];

    const userMessages = (Array.isArray(messages) ? messages : [])
      .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .map((m) => ({ role: m.role, content: m.content }));
      
    ollamaMessages.push(...userMessages);

    try {
      const response = await fetch(`${ollamaHost}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: ollamaModel,
          messages: ollamaMessages,
          stream: false,
          options: { temperature: 0.05, top_p: 0.1 }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama failed with status: ${response.status}`);
      }

      const data = await response.json();
      return { reply: data.message?.content || "No response from Ollama." };
    } catch (err) {
      throw new Error(`Ollama request failed: ${err?.message || err}. Make sure Ollama is running and model '${ollamaModel}' is pulled.`);
    }
  }

  // --- GEMINI LOGIC FALLBACK ---
  const apiKey = requireEnv("GEMINI_API_KEY");
  const preferredModel = process.env.GEMINI_MODEL || "models/gemini-pro-latest";

  const history = (Array.isArray(messages) ? messages : [])
    .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const last = history[history.length - 1];
  const lastText = last?.parts?.[0]?.text || "Hello";

  const genAI = new GoogleGenerativeAI(apiKey);

  async function runWithModel(modelName) {
    const gemini = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: system,
    });

    const chat = gemini.startChat({
      history: history.slice(0, -1),
      generationConfig: { temperature: 0.3 },
    });

    return await chat.sendMessage(lastText);
  }

  let result;
  try {
    result = await runWithModel(preferredModel);
  } catch (err) {
    const msg = String(err?.message || err || "");
    const looksLikeModelNameIssue =
      msg.includes("models/") && (msg.includes("not found") || msg.includes("not supported"));

    if (looksLikeModelNameIssue && preferredModel !== "gemini-1.5-pro-latest") {
      try {
        result = await runWithModel("models/gemini-pro-latest");
      } catch (err2) {
        throw new Error(`AI request failed: ${err2?.message || err2}`);
      }
    } else {
      throw new Error(`AI request failed: ${err?.message || err}`);
    }
  }

  const content = result?.response?.text?.();
  if (!content) {
    throw new Error("AI response was empty");
  }

  return { reply: content };
}

