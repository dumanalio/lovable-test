export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `
Du bist ein Website-Architekt. 
Antworte ausschließlich mit JSON im folgenden Schema:

{
  "pageTitle": string,
  "blocks": Block[]
}

Block kann ALLES sein:
- hero:    { "type":"hero","headline":string,"sub":string,"ctaText":string,"ctaLink":string }
- features:{ "type":"features","items":[{"icon":string,"title":string,"text":string}] }
- text:    { "type":"text","title":string,"body":string }
- gallery: { "type":"gallery","images":string[] }
- faq:     { "type":"faq","items":[{"q":string,"a":string}] }
- footer:  { "type":"footer","text":string }
- logo:    { "type":"logo","text":string,"position":"left"|"center"|"right" }
- navbar:  { "type":"navbar","items":[{"text":string,"link":string}] }
- button:  { "type":"button","text":string,"color":string,"link":string }
- image:   { "type":"image","src":string,"alt":string }
- video:   { "type":"video","src":string,"title":string }
- form:    { "type":"form","fields":[{"label":string,"type":string}],"submitText":string }
- testimonial: { "type":"testimonial","quote":string,"author":string }
- cardGrid: { "type":"cardGrid","cards":[{"title":string,"text":string,"image":string}] }
- ... oder andere Strukturen, die zur Anfrage passen.

Regeln:
1. Antworte NUR mit JSON, niemals mit Text oder Markdown.
2. Wenn der User vage ist, füge sinnvolle Defaults ein.
3. Du darfst neue Blocktypen erfinden, wenn es nötig ist.
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

  // Entferne evtl. Markdown-Codeblöcke
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
