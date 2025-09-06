/**
 * GENERATE.JS - KI-WEBSITE-GENERATOR (Lovable-Style)
 * 
 * Ziel:
 * - User beschreibt die Website in natürlicher Sprache
 * - KI liefert eine komplette, lauffähige HTML-Datei zurück
 * - Output ist verständlich, modern und für No-Code-User editierbar
 * 
 * Besonderheiten:
 * - Nutzt OpenAI GPT-4o-mini
 * - Eingaben sind flexibel ("mach mir eine Portfolio-Seite" oder "füge einen Button hinzu")
 * - Fehlerhafte JSON-Ausgaben werden abgefangen und automatisch korrigiert
 * - Zukunftssicher: Prompt ist so geschrieben, dass er leicht erweiterbar ist
 */

export const config = { runtime: "edge" };

// ===================== SYSTEM PROMPT =====================
const SYSTEM_PROMPT = `
DU BIST EIN PROFESSIONELLER WEBENTWICKLER FÜR NO-CODE-USER. 
DEINE AUFGABE IST ES, AUS NATÜRLICHER SPRACHE EINE FERTIGE, EINZELNE HTML-DATEI ZU GENERIEREN.

WICHTIGE REGELN:
1. Antworte IMMER nur mit HTML-Code (keine Erklärungen, kein Markdown, kein Freitext).
2. Die HTML-Datei enthält:
   - <!DOCTYPE html>
   - <html lang="de">
   - <head> mit Meta-Tags, Titel, Inline-CSS
   - <body> mit Header, Hauptinhalt, Footer
   - <script> mit Vanilla JS für Interaktionen
3. Code muss responsive, barrierefrei und sauber sein.
4. Verwende CSS Grid oder Flexbox für Layouts.
5. Baue Animationen oder interaktive Elemente ein, wenn es Sinn macht.
6. Kommentiere den Code für Laien, sodass sie ihn leicht anpassen können.
7. Füge Defaults ein, wenn User unspezifisch ist (z. B. Platzhalterbilder, Texte).

BESONDERE FEATURES:
- Navigation mit Smooth Scroll
- Hero-Section mit Call-to-Action
- Formulare mit Validierung
- Portfolio/Projektgalerien mit Lightbox
- Buttons, Karten, Testimonials, Logos
- "Zurück nach oben"-Button für lange Seiten
- Mobile-First-Design mit Media Queries

FEHLERHANDLING:
- Falls die Anfrage unklar ist → generiere eine einfache Landingpage (Hero + Text + Footer).
- Stelle IMMER sicher, dass der Output gültiges HTML ist.
`;

// ==========================================================
// API-Handler
// ==========================================================
export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let input = "";
  try {
    const body = await req.json();
    input = body.input || "";
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ===================== API CALL =====================
  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
    }),
  });

  if (!aiRes.ok) {
    const txt = await aiRes.text();
    return new Response(
      JSON.stringify({ error: "OpenAI API error", detail: txt }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const data = await aiRes.json();
  let raw = data?.choices?.[0]?.message?.content?.trim() || "";

  // Entferne evtl. Markdown-Wrapper (```html ... ```)
  raw = raw.replace(/^```html\s*/g, "").replace(/```$/g, "");

  // ===================== VALIDIERUNG =====================
  // Check: Ist das überhaupt ein HTML-Dokument?
  if (!raw.includes("<html")) {
    raw = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fallback-Seite</title>
        <style>
          body { font-family: Arial; padding: 2rem; background: #fafafa; }
          h1 { color: #b21f1f; }
        </style>
      </head>
      <body>
        <h1>Oops! Fehler im Generator.</h1>
        <p>Die KI konnte deine Anfrage nicht korrekt verarbeiten. 
        Versuche es erneut oder schreibe deine Anfrage anders.</p>
      </body>
      </html>`;
  }

  return new Response(JSON.stringify({ html: raw }), {
    headers: { "Content-Type": "application/json" },
  });
}
