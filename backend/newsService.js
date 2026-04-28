import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_SOURCES_BY_SECTION = {
  generic: [
    {
      key: "hec",
      name: "HEC Pakistan",
      url: "https://www.hec.gov.pk/english/news/Pages/default.aspx",
    },
    {
      key: "bsek",
      name: "Board of Secondary Education Karachi",
      url: "https://www.bsek.edu.pk/News",
    },
    {
      key: "biek",
      name: "Board of Intermediate Education Karachi",
      url: "https://www.biek.edu.pk/News",
    },
  ],
  universities: [
    {
      key: "uok",
      name: "University of Karachi",
      url: "https://uok.edu.pk/news.php",
    },
    {
      key: "nust",
      name: "NUST",
      url: "https://nust.edu.pk/news/",
    },
  ],
  competitive: [
    {
      key: "fpsc",
      name: "FPSC",
      url: "https://www.fpsc.gov.pk/",
    },
    {
      key: "spsc",
      name: "SPSC",
      url: "https://www.spsc.gov.pk/",
    },
  ],
};

const CACHE_MS = 15 * 60 * 1000;
let newsCache = {
  updatedAt: 0,
  data: null,
};

function normalizeSections(parsed) {
  const sectionNames = ["generic", "universities", "competitive"];
  const output = {
    generic: [],
    universities: [],
    competitive: [],
  };

  for (const section of sectionNames) {
    const list = Array.isArray(parsed?.[section]) ? parsed[section] : [];
    output[section] = list
      .filter((s) => s && typeof s.key === "string" && typeof s.name === "string" && typeof s.url === "string")
      .map((s) => ({ key: s.key, name: s.name, url: s.url }));
  }

  const total = output.generic.length + output.universities.length + output.competitive.length;
  return total > 0 ? output : DEFAULT_SOURCES_BY_SECTION;
}

async function getSourcesBySection() {
  const fromEnvRaw = process.env.NEWS_SOURCES_JSON;
  if (fromEnvRaw) {
    try {
      return normalizeSections(JSON.parse(fromEnvRaw));
    } catch {
      // Continue to file/default fallback.
    }
  }

  const fromFile = process.env.NEWS_SOURCES_FILE || path.join(__dirname, "newsSources.config.json");
  try {
    const raw = await fs.readFile(fromFile, "utf8");
    return normalizeSections(JSON.parse(raw));
  } catch {
    return DEFAULT_SOURCES_BY_SECTION;
  }
}

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function isBeforeJan2026(text) {
  const jan2026 = new Date("2026-01-01T00:00:00Z");

  // Scan text for generic years
  const yearPattern = /\b(20\d{2})\b/g;
  const yearMatches = text.match(yearPattern);
  if (yearMatches) {
    for (const yr of yearMatches) {
      if (parseInt(yr, 10) < 2026) {
        return true; // Discard anything from 2025 or older
      }
    }
  }

  // Scan text for long formatted date like "April 15, 2025" or "12/03/2025"
  const datePattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?[\s,]+(20\d{2})|\d{1,2}[\/-]\d{1,2}[\/-](20\d{2})|(20\d{2})[\/-]\d{1,2}[\/-]\d{1,2}/gi;
  const matches = text.match(datePattern);
  if (matches) {
    for (const match of matches) {
      const parsedDate = new Date(match.replace(/(st|nd|rd|th)/, ''));
      if (!isNaN(parsedDate.getTime()) && parsedDate < jan2026) {
        return true;
      }
    }
  }

  return false; // Assumed 2026 or newer if no date found
}

function parseNewsItems(html, source) {
  const $ = cheerio.load(html);
  const items = [];

  $("a").each((_, anchor) => {
    const parentText = normalizeText($(anchor).parent().text() || "");
    const title = normalizeText($(anchor).text() || "");
    const href = $(anchor).attr("href");

    if (!title || title.length < 20 || !href) {
      return;
    }

    // Exclude anything strictly from before Jan 2026
    if (isBeforeJan2026(title) || isBeforeJan2026(parentText)) {
      return;
    }

    const lower = title.toLowerCase();
    const looksLikeNews =
      lower.includes("notice") ||
      lower.includes("admission") ||
      lower.includes("scholarship") ||
      lower.includes("result") ||
      lower.includes("test") ||
      lower.includes("date sheet") ||
      lower.includes("news") ||
      lower.includes("announcement") ||
      lower.includes("bsc") ||
      lower.includes("msc") ||
      lower.includes("phd") ||
      lower.includes("bs") ||
      lower.includes("ms ") ||
      lower.includes("requirement");

    if (!looksLikeNews) {
      return;
    }

    const fullUrl = new URL(href, source.url).toString();
    items.push({
      source: source.name,
      sourceKey: source.key,
      title,
      link: fullUrl,
    });
  });

  // Keep only unique and latest-looking entries.
  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    if (seen.has(item.title)) {
      continue;
    }
    seen.add(item.title);
    deduped.push(item);
    if (deduped.length >= 10) {
      break;
    }
  }

  return deduped;
}

async function fetchSourceNews(source, section) {
  try {
    const response = await fetch(source.url, {
      headers: { "User-Agent": "ParhoBarho-NewsBot/1.0" },
    });

    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }

    const html = await response.text();
    const items = parseNewsItems(html, source);

    return {
      section,
      source: source.name,
      sourceKey: source.key,
      url: source.url,
      items,
      error: null,
    };
  } catch (error) {
    return {
      section,
      source: source.name,
      sourceKey: source.key,
      url: source.url,
      items: [],
      error: error.message,
    };
  }
}

export async function getEducationNews() {
  const now = Date.now();
  if (newsCache.data && now - newsCache.updatedAt < CACHE_MS) {
    return newsCache.data;
  }

  const sections = await getSourcesBySection();
  const flat = [
    ...sections.generic.map((source) => ({ section: "generic", source })),
    ...sections.universities.map((source) => ({ section: "universities", source })),
    ...sections.competitive.map((source) => ({ section: "competitive", source })),
  ];

  const results = await Promise.all(flat.map(({ source, section }) => fetchSourceNews(source, section)));
  const allItems = results.flatMap((entry) => entry.items);

  const bySection = {
    generic: results.filter((r) => r.section === "generic"),
    universities: results.filter((r) => r.section === "universities"),
    competitive: results.filter((r) => r.section === "competitive"),
  };

  const payload = {
    fetchedAt: new Date().toISOString(),
    totalItems: allItems.length,
    sections: bySection,
    sources: results,
  };

  newsCache = {
    updatedAt: now,
    data: payload,
  };

  return payload;
}

export async function refreshEducationNews() {
  // Force-refresh cache by clearing it before fetch.
  newsCache = { updatedAt: 0, data: null };
  return getEducationNews();
}
