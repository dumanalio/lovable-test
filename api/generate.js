export const config = { runtime: "edge" };

/**
 * System Prompt:
 * - JSON only
 * - Blocks-Modell (einfach und stabil)
 * - Unterstützte Typen inkl. Formular mit select/checkbox/radio/textarea
 */
const SYSTEM_PROMPT = `
Du bist ein Website-Builder. Antworte AUSSCHLIESSLICH mit gültigem JSON im Format:
{
  "blocks": Block[]
}
Block ist eines von:
- navbar:   { "type":"navbar","brand"?:string,"items"?: [{"text":string,"link":string}],"cta"?:{"text":string,"link":string} }
- hero:     { "type":"hero","headline":string,"sub"?:string,"ctaText"?:string,"ctaLink"?:string,"backgroundGradient"?:string }
- features: { "type":"features","items":[{"icon"?:string,"title":string,"text"?:string}] }
- text:     { "type":"text","title"?:string,"body":string }
- gallery:  { "type":"gallery","title"?:string,"images":(string|{"src":string,"alt"?:string})[] }
- pricing:  { "type":"pricing","title"?:string,"plans":[{"name":string,"price":string,"features"?:string[],"ctaText"?:string,"ctaLink"?:string}] }
- faq:      { "type":"faq","title"?:string,"items":[{"q":string,"a":string}] }
- form:     { "type":"form","title"?:string,"fields":[FormField], "submitButtonText"?:string }
- image:    { "type":"image","src":string,"alt"?:string,"caption"?:string }
- video:    { "type":"video","title"?:string,"src":string }
- button:   { "type":"button","text":string,"link"?:string,"color"?:string }
- footer:   { "type":"footer","text":string }

FormField:
- { "label":string, "type": "text"|"email"|"textarea"|"checkbox"|"select"|"radio", "required"?: boolean, "options"?: string[], "placeholder"?: string }

Regeln:
- Antworte nur mit JSON, niemals mit Freitext oder Markdown.
- Gib sinnvolle Defaults, wenn der Nutzer ungenau ist.
- Wenn unklar, erzeuge mindestens hero + footer (deutsche Texte).
- Nutze vorhandene Struktur weiter (keine komplette Löschung, wenn der Nutzer "füge ___ hinzu" sagt).
`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Nur POST erlaubt" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  let input = "";
  try {
    const body = await req.json();
    input = (body?.input || "").toString();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input }
        ]
      })
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: "OpenAI API Fehler", detail: txt }), {
        status: aiRes.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Antwort robust parsen
    let data;
    try { data = await aiRes.json(); }
    catch {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: "OpenAI gab kein JSON zurück", raw: txt }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    let raw = data?.choices?.[0]?.message?.content?.trim() || "{}";
    // ggf. Codeblöcke entfernen
    raw = raw.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    if (!raw.startsWith("{") && !raw.startsWith("[")) {
      return new Response(JSON.stringify({ error: "Antwort war kein JSON", raw }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const json = JSON.parse(raw);
    // Minimal-Validierung
    if (!Array.isArray(json.blocks)) {
      return new Response(JSON.stringify({ error: "Ungültiges Format: 'blocks' fehlt", raw: json }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: "Serverfehler", detail: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
