// api/generate.js

export const config = { runtime: "edge" };

const SYSTEM_PROMPT = `
Du bist ein Website-Generator. Antworte IMMER mit gültigem JSON nach folgendem Schema:
{
  "metadata": {...},
  "design": {...},
  "structure": [...]
}
Keine Erklärungen, kein Text, nur JSON.
`;

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

  // Anfrage an OpenAI
  const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
    }),
  });

  // Falls die API selbst einen Fehler wirft
  if (!aiRes.ok) {
    const txt = await aiRes.text();
    return new Response(
      JSON.stringify({
        error: "OpenAI API error",
        status: aiRes.status,
        detail: txt,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Jetzt sauber parsen – egal ob JSON oder nicht
  let data;
  try {
    data = await aiRes.json();
  } catch (e) {
    const txt = await aiRes.text();
    return new Response(
      JSON.stringify({
        error: "OpenAI did not return JSON",
        raw: txt,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let raw = data?.choices?.[0]?.message?.content?.trim() || "{}";

  // Entferne evtl. Markdown-Codeblöcke ```json
  raw = raw.replace(/^```json\s*/g, "").replace(/```$/g, "");

  try {
    const json = JSON.parse(raw);
    return new Response(JSON.stringify(json), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "Bad JSON from AI",
        raw,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
