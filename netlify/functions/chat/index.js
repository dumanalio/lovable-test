// ESM-Style (package.json hat "type": "module")
// Netlify erkennt `export async function handler` automatisch.
import { z } from "zod";

/**
 * ------------------------------------------------------------
 * CHAT FUNCTION (No-Coder-freundlich)
 * ------------------------------------------------------------
 * Ziele:
 * 1) CORS + OPTIONS sauber behandeln (für Browser-Fetch aus /public).
 * 2) POST-Request { message, projectId? } validieren.
 * 3) No-Code Intent-Heuristik:
 *    - Seitentyp (landing/portfolio/blog/shop/about)
 *    - Farbschema (blau/beige/...); extrahiert aus natürlicher Sprache.
 *    - Abschnitte (hero/features/gallery/cta/faq/footer/...)
 *    - Medienwunsch (Bildanzahl, Icons, Logo-Hinweis)
 *    - Tonalität/Design (minimalistisch, premium, verspielt, etc.)
 * 4) Strukturierte SPEC zurückgeben, die unsere Generate-Function 1:1 versteht.
 * 5) Optional: LLM-Orchestrierung (falls OPENAI_API_KEY vorhanden).
 *
 * Rückgabe:
 * {
 *   success: true,
 *   ui: { reply: "Deutscher, beruhigender Assistententext" },
 *   spec: { ... },
 *   next: { action: "generate", endpoint: "/api/generate" },
 *   trace?: { ...nur zum Debuggen... }
 * }
 */

// ------------------------------------------------------------
// 0) Hilfsfunktionen
// ------------------------------------------------------------

// CORS-Header für Browser-Calls (lokal + Netlify)
const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

// Zod Schema zur Eingabevalidierung
const BodySchema = z.object({
  message: z.string().min(1, "Bitte schreibe, was du bauen möchtest."),
  projectId: z.string().optional(),
  mode: z.enum(["spec", "spec+ai"]).optional().default("spec"), // "spec" = Heuristik; "spec+ai" = Heuristik + optional LLM
});

// Einfache Keyword-Maps (Deutsch + Englisch-Synonyme)
const PAGE_KEYWORDS = [
  { key: "landing", match: ["landing", "homepage", "startseite", "home", "hauptseite"] },
  { key: "portfolio", match: ["portfolio", "arbeiten", "referenzen", "projekte"] },
  { key: "about", match: ["about", "über mich", "über uns", "team", "vita"] },
  { key: "blog", match: ["blog", "artikel", "news"] },
  { key: "shop", match: ["shop", "store", "produkte", "verkauf", "pricing", "preise"] },
  { key: "contact", match: ["kontakt", "contact", "anfrage", "formular"] },
];

const SECTION_KEYWORDS = [
  { key: "hero", match: ["hero", "kopfbereich", "großer titel", "header", "titelbild"] },
  { key: "features", match: ["features", "merkmale", "vorteile", "funktionen"] },
  { key: "gallery", match: ["galerie", "bilder", "portfolio", "arbeiten"] },
  { key: "cta", match: ["cta", "call to action", "jetzt starten", "kontaktknopf", "button"] },
  { key: "testimonials", match: ["stimmen", "bewertungen", "testimonials", "kundenmeinungen"] },
  { key: "pricing", match: ["preise", "pricing", "pakete", "tarife"] },
  { key: "faq", match: ["faq", "fragen", "häufige fragen"] },
  { key: "footer", match: ["footer", "fußbereich", "impressum"] },
  { key: "about", match: ["über mich", "über uns", "about"] },
  { key: "contact", match: ["kontakt", "form", "formular"] },
];

const COLOR_KEYWORDS = [
  { key: "blue",  match: ["blau", "blue", "navy", "azur", "kobaltblau"] },
  { key: "beige", match: ["beige", "sand", "sandfarben", "cream", "creme"] },
  { key: "black", match: ["schwarz", "black", "noir", "anthrazit"] },
  { key: "white", match: ["weiß", "weiss", "white", "ivory"] },
  { key: "gray",  match: ["grau", "gray", "silber"] },
  { key: "green", match: ["grün", "green", "jade"] },
  { key: "red",   match: ["rot", "red", "karmin"] },
];

const TONE_KEYWORDS = [
  { key: "minimal", match: ["minimal", "minimalistisch", "clean", "aufgeräumt"] },
  { key: "premium", match: ["premium", "edel", "luxus", "hochwertig"] },
  { key: "playful", match: ["verspielt", "freundlich", "lebendig"] },
];

// Utility: Text normalisieren
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// Utility: Keywords finden
function pickByKeywords(text, groups, fallback) {
  for (const g of groups) {
    if (g.match.some((k) => text.includes(k))) return g.key;
  }
  return fallback;
}

// Utility: Zahl aus Freitext für Bildanzahl / Spalten etc.
function extractNumber(text, defaultValue = 3) {
  const m = text.match(/\b(\d{1,2})\b/);
  if (!m) return defaultValue;
  const n = parseInt(m[1], 10);
  if (Number.isNaN(n)) return defaultValue;
  return Math.max(1, Math.min(n, 12)); // simple bounds
}

// Heuristik: Abschnitte automatisch vorschlagen (No-Coder freundlich)
function suggestSections(pageType, text) {
  const s = new Set();
  // Basis je Seitentyp
  if (pageType === "landing") s.add("hero").add("features").add("cta").add("footer");
  if (pageType === "portfolio") s.add("hero").add("gallery").add("about").add("contact").add("footer");
  if (pageType === "about") s.add("hero").add("about").add("features").add("contact").add("footer");
  if (pageType === "blog") s.add("hero").add("features").add("footer");
  if (pageType === "shop") s.add("hero").add("features").add("pricing").add("cta").add("footer");

  // Nutzerwünsche ergänzen
  for (const sDef of SECTION_KEYWORDS) {
    if (sDef.match.some((m) => text.includes(m))) s.add(sDef.key);
  }

  // Immer Footer als Orientierung
  s.add("footer");
  return Array.from(s);
}

// Heuristik: Copy-Texte schnell generieren (Placeholder, verständlich)
function defaultCopy(pageType) {
  const titleByType = {
    landing: "Willkommen – Lass uns etwas Großartiges bauen.",
    portfolio: "Ausgewählte Arbeiten",
    about: "Über mich",
    blog: "Aktuelle Beiträge",
    shop: "Unsere Produkte",
    contact: "Kontaktiere uns",
  };
  return {
    hero: {
      title: titleByType[pageType] || "Deine Seite startet hier",
      subtitle: "Beschreibe links im Chat, was du brauchst – ich setze es um.",
      cta: "Jetzt starten",
    },
    features: {
      title: "Warum das passt",
      items: [
        "Klarer Aufbau – No-Code-freundlich",
        "Saubere Typografie & Abstände",
        "Später leicht erweiterbar (Formulare, Shop, Blog)",
      ],
    },
    gallery: {
      title: "Galerie",
      caption: "Beispiele oder Referenzen",
    },
    cta: {
      title: "Bereit?",
      button: "Kontaktiere uns",
    },
    pricing: {
      title: "Pakete",
      caption: "Transparent und fair",
    },
    faq: {
      title: "Häufige Fragen",
    },
    footer: {
      text: "© Dein Name – Impressum | Datenschutz",
    },
  };
}

// Optional: OpenAI-Call (nur wenn OPENAI_API_KEY gesetzt ist)
// Diese Funktion ist bewusst defensiv – läuft sauber „ohne“ weiter.
async function tryLLMRefineSpec({ message, draftSpec }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!apiKey) {
    return { used: false, spec: draftSpec, note: "Kein OPENAI_API_KEY gesetzt – Heuristik verwendet." };
  }

  const system = [
    "Du bist ein Assistent, der Web-Seiten-Spezifikationen für No-Coder erstellt.",
    "Gib eine präzise, valide JSON-Spezifikation zurück, die eine statische Seite generierbar macht.",
    "Benutze diese Felder: pageType, theme, sections[], copy, images, tone, accessibility, layout.",
    "Halte dich an das vorhandene Draft-Schema und verbessere nur, wo der Nutzer es impliziert.",
  ].join(" ");

  const user = [
    "Nutzerwunsch:",
    message,
    "",
    "Vorläufige Spec (JSON):",
    JSON.stringify(draftSpec),
    "",
    "Aufgabe: Optimiere die Spec vorsichtig (z. B. passende Farben, sinnvolle Section-Reihenfolge, kurze klare Copy).",
    "Antworte NUR mit reinem JSON (ohne Markdown).",
  ].join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }, // neuere APIs unterstützen dies; fallback ignoriert
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { used: true, spec: draftSpec, note: `LLM-Fehler ${res.status}: ${text}` };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) return { used: true, spec: draftSpec, note: "LLM gab keine Inhalte zurück." };

    // Versuche JSON zu parsen; bei Fehlern fallback auf draftSpec
    try {
      const refined = JSON.parse(content);
      // Minimale Absicherung: wichtige Felder beibehalten, wenn fehlen
      const merged = {
        ...draftSpec,
        ...refined,
        copy: { ...draftSpec.copy, ...(refined.copy || {}) },
      };
      return { used: true, spec: merged, note: "LLM-Optimierung angewendet." };
    } catch (e) {
      return { used: true, spec: draftSpec, note: "LLM-Ausgabe war kein valides JSON. Draft behalten." };
    }
  } catch (err) {
    return { used: true, spec: draftSpec, note: `LLM-Request fehlgeschlagen: ${String(err?.message || err)}` };
  }
}

// ------------------------------------------------------------
// 1) Netlify Handler
// ------------------------------------------------------------
export async function handler(event, context) {
  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: baseHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ success: false, error: "Method not allowed. Use POST." }),
    };
  }

  // Body parsen & validieren
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ success: false, error: "Ungültiges JSON im Request-Body." }),
    };
  }

  const parse = BodySchema.safeParse(body);
  if (!parse.success) {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: JSON.stringify({ success: false, error: parse.error.flatten() }),
    };
  }

  const { message, projectId = null, mode } = parse.data;
  const original = message;
  const text = normalize(original);

  // ----------------------------------------------------------
  // 2) Heuristische Intent-Analyse (No-Coder freundlich)
  // ----------------------------------------------------------
  const pageType = pickByKeywords(text, PAGE_KEYWORDS, "landing");
  const primaryColor = pickByKeywords(text, COLOR_KEYWORDS, "blue");
  const tone = pickByKeywords(text, TONE_KEYWORDS, "minimal");
  const imagesCount = extractNumber(text, 3);

  const sections = suggestSections(pageType, text);
  const copy = defaultCopy(pageType);

  // Barrierefreiheit / UX Defaults (No-Code Best Practices)
  const accessibility = {
    contrast: "AA",
    focusVisible: true,
    prefersReducedMotion: true,
    altTextRequired: true,
  };

  const layout = {
    containerWidth: "1200px",
    grid: 12,
    spacing: { sectionY: 96, blockY: 48, x: 24 },
    radius: 12,
  };

  const theme = {
    primary: primaryColor, // semantic
    background: "white",
    surface: "white",
    text: "black",
    // Tokens – unsere Generate-Function mappt semantic → echte HEX-Farben
    tokens: {
      blue: ["#0A84FF", "#0059C9", "#E6F0FF"],
      beige: ["#E9DFCF", "#C9B8A4", "#F7F3EE"],
      black: ["#000000", "#111111", "#222222"],
      white: ["#FFFFFF", "#FAFAFA", "#F2F2F2"],
      gray: ["#666666", "#888888", "#EEEEEE"],
      green: ["#10B981", "#059669", "#ECFDF5"],
      red: ["#EF4444", "#DC2626", "#FEF2F2"],
    },
    typography: {
      heading: "Inter, ui-sans-serif, system-ui",
      body: "Inter, ui-sans-serif, system-ui",
      scale: { h1: 40, h2: 28, h3: 22, body: 16 },
    },
  };

  // Draft-Spec (ohne LLM)
  const draftSpec = {
    projectId,
    pageType,
    theme,
    sections,
    copy,
    images: { desired: imagesCount, stockOk: true },
    tone,
    accessibility,
    layout,
    meta: {
      locale: "de",
      source: "chat",
      timestamp: new Date().toISOString(),
    },
  };

  // ----------------------------------------------------------
  // 3) Optional: LLM-Verfeinerung (wenn "mode=spec+ai" & OPENAI_API_KEY)
  // ----------------------------------------------------------
  let finalSpec = draftSpec;
  let llmInfo = { used: false, note: "nur Heuristik" };

  if (mode === "spec+ai") {
    const out = await tryLLMRefineSpec({ message: original, draftSpec });
    finalSpec = out.spec;
    llmInfo = { used: out.used, note: out.note };
  }

  // ----------------------------------------------------------
  // 4) Antworttext für No-Coder (verständlich + nächste Schritte)
  // ----------------------------------------------------------
  const reply = [
    "Alles klar! Ich habe verstanden, was du möchtest:",
    `• Seitentyp: ${finalSpec.pageType}`,
    `• Stil: ${finalSpec.tone}, Hauptfarbe: ${finalSpec.theme.primary}`,
    `• Abschnitte: ${finalSpec.sections.join(", ")}`,
    `• Bilder: ~${finalSpec.images.desired} vorgesehen`,
    "",
    "Wenn du willst, kann ich daraus jetzt direkt eine Vorschau bauen.",
    "Sag z. B.: „Erzeuge die Seite“ oder „Mach daraus eine Landingpage mit großer Hero-Sektion und Button“.",
  ].join("\n");

  // ----------------------------------------------------------
  // 5) Response
  // ----------------------------------------------------------
  return {
    statusCode: 200,
    headers: baseHeaders,
    body: JSON.stringify({
      success: true,
      ui: { reply },
      spec: finalSpec,
      next: { action: "generate", endpoint: "/api/generate" },
      llm: llmInfo,
      // Trace ist hilfreich beim Debuggen im Frontend (kannst du ausblenden)
      trace: {
        mode,
        heuristics: { pageType, primaryColor, tone, imagesCount, sections },
      },
    }),
  };
}
