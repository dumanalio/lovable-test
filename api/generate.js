// api/generate.js
export const config = { runtime: "edge" };

/**
 * Systemprompt: erzwingt JSON (Schema) – keine Texte, kein Markdown.
 * Wir erlauben sowohl dein „structure/sections“-Schema als auch das simple „blocks[]“-Schema.
 */
const SYSTEM_PROMPT = `
Du bist ein Website-Architekt. Antworte AUSSCHLIESSLICH mit gültigem JSON.
Bevorzugtes Schema:
{
  "metadata": { "purpose": string, "targetAudience": string, "mainCTA"?: { "text": string, "action"?: string, "target"?: string }, "domainName"?: string, "seoKeywords"?: string[] },
  "design": { "aesthetic": string, "palette"?: { "primary"?: string, "secondary"?: string, "accent"?: string, "text"?: string, "background"?: string }, "typography"?: { "headingFont"?: string, "bodyFont"?: string }, "logo"?: { "src"?: string, "alt"?: string } },
  "structure": [
    { "id": string, "title": string, "path": string,
      "sections": [ { "type": string, "content": object } ]
    }
  ]
}
Unterstützte section.type: hero, text, image, gallery, cta, form, team, testimonials, faq, map, social-media, custom, features, pricing, columns, cardGrid, button, video, footer, navbar, testimonial.
Wenn die Nutzeranweisung nur eine kleine Änderung beschreibt, liefere trotzdem eine konsistente Seite.
Falls unklar: gib mindestens hero + footer (deutsche Texte).
KEIN Markdown, KEINE \`\`\` fences, KEIN Freitext.
`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  let input = "";
  try {
    const body = await req.json();
    input = body.input || "";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Call OpenAI
  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input }
      ]
    })
  });

  if (!aiRes.ok) {
    const txt = await aiRes.text();
    return new Response(JSON.stringify({
      error: "OpenAI API error",
      status: aiRes.status,
      detail: txt
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  // parse OpenAI answer safely
  let data;
  try {
    data = await aiRes.json();
  } catch {
    const txt = await aiRes.text();
    return new Response(JSON.stringify({
      error: "OpenAI did not return JSON",
      raw: txt
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  let raw = data?.choices?.[0]?.message?.content?.trim() || "{}";
  // strip accidental fences
  raw = raw.replace(/^\s*```json\s*/i, "").replace(/\s*```\s*$/i, "");

  // try parsing final JSON; if it fails, return raw for debugging
  try {
    const json = JSON.parse(raw);
    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({
      error: "Bad JSON from AI",
      raw
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
