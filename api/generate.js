export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `
Du bist ein Website-Architekt. Der User beschreibt ganz normal in Alltagssprache,
was er auf seiner Website haben möchte. 

Deine Aufgabe:
- Antworte **nur mit JSON**, niemals mit Text oder Markdown.
- Erzeuge eine Liste von "blocks", die die Website repräsentieren.
- Erfinde Blocktypen frei, wenn es sinnvoll ist (z. B. "button", "image", "section", "navbar", "form").
- Nutze sinnvolle Defaultwerte, falls etwas unklar ist.

Schema:

{
  "pageTitle": string,
  "blocks": [
    { "type": "hero", "headline": string, "sub": string, "ctaText": string, "ctaLink": string },
    { "type": "features", "items": [ { "icon": string, "title": string, "text": string } ] },
    { "type": "text", "title": string, "body": string },
    { "type": "gallery", "images": string[] },
    { "type": "faq", "items": [ { "q": string, "a": string } ] },
    { "type": "button", "text": string, "link": string, "color": string },
    { "type": "image", "src": string, "alt": string },
    { "type": "footer", "text": string }
  ]
}

Regeln:
1. Baue IMMER ein Array von "blocks".
2. Wenn der User nur etwas Kleines sagt (z. B. "Button hinzufügen"), dann baue ein passendes JSON mit mind. einem Hero + Footer + dem neuen Block.
3. Nutze nur gültiges JSON, kein Markdown, keine Kommentare.
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
      temperature: 0.3,
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

  // Markdown-Block entfernen, falls GPT ihn liefert
  raw = raw.replace(/^```json\s*/g, '').replace(/```$/g, '');

  try {
    const json = JSON.parse(raw);
    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Bad JSON', raw }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
