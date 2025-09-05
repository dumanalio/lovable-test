export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `
Du bist ein Website-Architekt. Du erzeugst nur valides JSON im folgenden Schema:

{
  "pageTitle": string,
  "blocks": Block[]
}

Block ist eines von:
- hero:    { "type":"hero","headline":string,"sub":string,"ctaText":string,"ctaLink":string }
- features:{ "type":"features","items":[{"icon":string,"title":string,"text":string}] }
- text:    { "type":"text","title":string,"body":string }
- gallery: { "type":"gallery","images":string[] }
- faq:     { "type":"faq","items":[{"q":string,"a":string}] }
- footer:  { "type":"footer","text":string }

Regeln:
- Antworte nur mit JSON, keine Erklärungen.
- Keine Markdown-Fences (```).
- Wenn etwas fehlt, erfinde sinnvolle Defaults.
`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { input } = await req.json();

  const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input || '' }
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

  // Falls die KI versehentlich Code-Blöcke sendet → entfernen
  raw = raw.replace(/^```json\s*|\s*```$/g, '');

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
