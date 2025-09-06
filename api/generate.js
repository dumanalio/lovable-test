export const config = { runtime: 'edge' };

/**
 * Lovable-Style System Prompt:
 * - natürliche Sprache → Website-Blöcke
 * - striktes JSON, keine Markdown-Codeblöcke, kein Freitext
 * - frei definierbare Blocktypen, sinnvolle Defaults
 */
const SYSTEM_PROMPT = `
Du bist ein Website-Architekt (Lovable-Style).
Der Nutzer schreibt in Alltagssprache, was er will (z. B. "Logo links, Hero, roter Button, Galerie...").
Du wandelst das in JSON um.

WICHTIG:
- Antworte AUSSCHLIESSLICH mit gültigem JSON, KEIN Markdown, KEIN Text außerhalb des JSON.
- Nutze dieses Top-Level-Schema:

{
  "pageTitle": string,
  "theme"?: { "brand"?: string, "bg"?: string, "fg"?: string, "muted"?: string, "font"?: string },
  "blocks": Block[]
}

"Block" ist flexibel. Erlaubte (nicht abschließende) Beispiele:
- { "type": "navbar",  "brand"?: string, "brandImage"?: string, "items"?: [{ "text": string, "link": string }], "cta"?: { "text": string, "link": string }, "sticky"?: boolean }
- { "type": "logo",    "text": string, "position"?: "left" | "center" | "right" }
- { "type": "hero",    "headline": string, "sub"?: string, "ctaText"?: string, "ctaLink"?: string, "ctaColor"?: string, "ctaTextColor"?: string, "backgroundGradient"?: string, "align"?: "left" | "center" | "right", "h1Size"?: string }
- { "type": "section", "title"?: string, "body"?: string, "children"?: Block[] }
- { "type": "columns", "count"?: number, "columns": (Block | Block[])[] }
- { "type": "features","title"?: string, "items": [{ "icon"?: string, "title": string, "text"?: string }] }
- { "type": "cardGrid","title"?: string, "cards": [{ "title": string, "text"?: string, "image"?: string, "link"?: string }] }
- { "type": "pricing", "title"?: string, "plans": [{ "name": string, "price": string, "features"?: string[], "ctaText"?: string, "ctaLink"?: string }] }
- { "type": "testimonial","quote": string, "author"?: string }
- { "type": "gallery", "title"?: string, "images": string[] }
- { "type": "image",   "src": string, "alt"?: string }
- { "type": "video",   "title"?: string, "src": string }
- { "type": "faq",     "title"?: string, "items": [{ "q": string, "a": string }] }
- { "type": "form",    "title"?: string, "fields": [{ "label": string, "type": "text" | "email" | "textarea" | "select" | "tel" | "url" | "number", "placeholder"?: string, "options"?: string[], "name"?: string }], "submitText"?: string }
- { "type": "button",  "text": string, "link"?: string, "color"?: string }
- { "type": "footer",  "text": string }

Regeln:
1) Immer "pageTitle" + ein "blocks"-Array liefern.
2) Wenn der Nutzer nur Teilwünsche äußert (z. B. "Button hinzufügen"), liefere trotzdem eine KONSISTENTE Seite (mind. Hero + Footer + gewünschter Block).
3) Verwende sinnvolle Defaultwerte und halte dich an einfache Felder (Strings/Arrays), vermeide HTML im JSON.
4) KEIN Markdown, KEINE \`\`\`-Fences – nur JSON.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let input = "";
  try {
    const body = await req.json();
    input = body.input || "";
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input }
      ]
    })
  });

  if (!aiRes.ok) {
    const txt = await aiRes.text();
    return new Response(JSON.stringify({ error: 'OpenAI API error', detail: txt }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await aiRes.json();
  let raw = data?.choices?.[0]?.message?.content?.trim() || '{}';

  // Falls die KI doch Fences liefert, entfernen
  raw = raw.replace(/^\s*```json\s*/i, '').replace(/\s*```\s*$/i, '');

  try {
    const json = JSON.parse(raw);
    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    // Notfall: bestmöglichen JSON-Chunk extrahieren
    const start = raw.indexOf('{');
    const end   = raw.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        const fixed = JSON.parse(raw.slice(start, end + 1));
        return new Response(JSON.stringify(fixed), { headers: { 'Content-Type': 'application/json' } });
      } catch(_) {}
    }
    return new Response(JSON.stringify({ error: 'Bad JSON', raw }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
