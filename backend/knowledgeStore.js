import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { KnowledgeEntry } from "./models/KnowledgeEntry.js";

const FILE_PATH = path.join(process.cwd(), "data", "knowledge.json");

async function ensureDir() {
  const dir = path.dirname(FILE_PATH);
  await fs.mkdir(dir, { recursive: true });
}

async function fileReadAll() {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((x) => x && typeof x.text === "string");
  } catch {
    return [];
  }
}

async function fileAppend(text) {
  await ensureDir();
  const items = await fileReadAll();
  const entry = { text, createdAt: new Date().toISOString() };
  items.unshift(entry);
  await fs.writeFile(FILE_PATH, JSON.stringify(items.slice(0, 200), null, 2), "utf8");
  return entry;
}

function hasMongoConnection() {
  return mongoose.connection?.readyState === 1;
}

export async function addKnowledge(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) {
    throw new Error("Text is required");
  }

  if (hasMongoConnection()) {
    const doc = await KnowledgeEntry.create({ text: trimmed });
    return { id: String(doc._id), text: doc.text, createdAt: doc.createdAt.toISOString() };
  }

  return await fileAppend(trimmed);
}

export async function listKnowledge({ limit = 20 } = {}) {
  const safeLimit = Math.max(1, Math.min(50, Number(limit) || 20));

  if (hasMongoConnection()) {
    const docs = await KnowledgeEntry.find().sort({ createdAt: -1 }).limit(safeLimit).lean();
    return docs.map((d) => ({
      id: String(d._id),
      text: d.text,
      createdAt: new Date(d.createdAt).toISOString(),
    }));
  }

  const items = await fileReadAll();
  return items.slice(0, safeLimit);
}

