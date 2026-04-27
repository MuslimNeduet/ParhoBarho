import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from "node-cron";
import { getEducationNews, refreshEducationNews } from './newsService.js';
import mongoose from "mongoose";
import { addKnowledge, listKnowledge } from "./knowledgeStore.js";
import { generateCounselorReply } from "./aiService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const NEWS_CRON = process.env.NEWS_CRON || "*/15 * * * *";

app.use(
  cors({
    origin: (origin, callback) => {
      // allow same-origin / server-to-server / local tools
      if (!origin) {
        return callback(null, true);
      }

      // If FRONTEND_ORIGIN isn't set, allow all (dev-friendly).
      if (!FRONTEND_ORIGIN) {
        return callback(null, true);
      }

      const allowed = FRONTEND_ORIGIN.split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      if (allowed.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);
app.use(express.json());

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed. Falling back to file storage.", err?.message || err);
  }
}

function requireAdmin(req, res, next) {
  if (!ADMIN_TOKEN) {
    return res.status(500).json({ message: "ADMIN_TOKEN is not set on the server." });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : "";
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
}

app.get('/', (req, res) => {
  res.send('Parho Barho API is running...');
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Admin Knowledge Base
app.get("/api/admin/knowledge", requireAdmin, async (req, res) => {
  try {
    const items = await listKnowledge({ limit: 50 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Unable to load knowledge.", error: error.message });
  }
});

app.post("/api/admin/knowledge", requireAdmin, async (req, res) => {
  try {
    const { text } = req.body || {};
    const created = await addKnowledge(text);
    res.json({ ok: true, created });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

// Student AI chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    const result = await generateCounselorReply({ messages });
    res.json(result);
  } catch (error) {
    const msg = error?.message || String(error);
    const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate");
    res.status(isRateLimit ? 429 : 500).json({ message: "AI is unavailable right now.", error: msg });
  }
});

app.get('/api/khabarnama', async (req, res) => {
  try {
    const news = await getEducationNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to fetch Khabarnama news right now.',
      error: error.message,
    });
  }
});

app.post("/api/admin/khabarnama/refresh", requireAdmin, async (req, res) => {
  try {
    const data = await refreshEducationNews();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Refresh failed", error: error.message });
  }
});

function startNewsCron() {
  if (!cron.validate(NEWS_CRON)) {
    console.error(`Invalid NEWS_CRON expression: ${NEWS_CRON}`);
    return;
  }

  // Warm cache on boot, then keep it fresh in background.
  refreshEducationNews().catch((err) => {
    console.error("Initial news refresh failed:", err?.message || err);
  });

  cron.schedule(NEWS_CRON, async () => {
    try {
      await refreshEducationNews();
      console.log("Khabarnama refreshed successfully");
    } catch (err) {
      console.error("Scheduled Khabarnama refresh failed:", err?.message || err);
    }
  });

  console.log(`Khabarnama cron started with schedule: ${NEWS_CRON}`);
}

connectMongo().finally(() => {
  startNewsCron();
  app.listen(PORT, () => {
    console.log(`Server is purring on port ${PORT}`);
  });
});