export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `
Du bist ein Website-Builder. Antworte IMMER mit JSON im Format:
{
  "blocks": [
    { "type": "hero", "headline": "...", "sub": "...", "ctaText": "...", "ctaLink": "#" },
    { "type": "features", "items": [ { "icon": "⚡", "title": "Schnell", "text": "..." } ] },
    { "type": "faq", "items": [ { "q": "?", "a": "..." } ] },
    { "type": "form", "title": "Kontakt", "fields": [ { "label":"Name","type":"text","required":true } ], "submitButtonText":"Absenden" }
  ]
}
Antwort nur als JSON, niemals mit Text oder Markdown.
`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Nur POST erlaubt" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { input } = await req.json();

    if (!input || typeof input !== 'string') {
      return new Response(JSON.stringify({ error: "Eingabe erforderlich" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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
      throw new Error(`OpenAI API Fehler: ${aiRes.status}`);
    }

    const data = await aiRes.json();
    let raw = data?.choices?.[0]?.message?.content?.trim() || "{}";

    // Entferne evtl. Markdown
    raw = raw.replace(/^```json/, "").replace(/```$/, "");

    // Validiere JSON
    JSON.parse(raw);

    return new Response(raw, { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (e) {
    console.error("API Fehler:", e);
    return new Response(JSON.stringify({ 
      error: "Fehler beim Generieren der Website", 
      details: e.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
