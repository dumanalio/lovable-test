// Netlify Function: generate
// Calls OpenAI with server-side API key and returns { title, code } JSON

const SYSTEM_PROMPT = `You are a senior frontend engineer. Generate production-ready React 19 functional components styled with Tailwind CSS.

Constraints:
- Output JSON only in the shape {"title": string, "code": string}. No markdown, no backticks, no extra text.
- The "code" must be valid React (JSX) using function components. Prefer self-contained components.
- Use Tailwind CSS utility classes for styling. Avoid external CSS frameworks.
- Allowed libs (already installed): framer-motion, lucide-react. Use them only if they add value.
- Do not include explanations or comments in the code unless requested.
- If the user asks for a full page or layout, include imports and export default. Otherwise return just the component (and imports if needed).
- Keep the code minimal, accessible, and responsive.
- Avoid external network calls unless explicitly asked.
- No markdown formatting; return JSON only.`;

function extractJson(text) {
  try {
    return JSON.parse(text);
  } catch (_) {
    // Try to extract JSON substring
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {}
    }
  }
  return null;
}

exports.handler = async (event) => {
  // CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Missing OPENAI_API_KEY on server" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const userPrompt = String(body.prompt || "").trim();
    const history = Array.isArray(body.messages) ? body.messages : [];

    if (!userPrompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing prompt" }),
      };
    }

    // Convert local history to OpenAI messages (keep last 6 for brevity)
    const recent = history.slice(-6).map((m) => {
      if (m.type === "user") {
        return { role: "user", content: m.content };
      }
      // AI message: use its code as assistant content to provide context
      try {
        const c = m.content || {};
        const title = c.title ? `Title: ${c.title}\n` : "";
        const code = c.code ? `Code:\n${c.code}` : "";
        return { role: "assistant", content: `${title}${code}`.trim() };
      } catch (_) {
        return { role: "assistant", content: "" };
      }
    });

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recent,
      {
        role: "user",
        content:
          `Please generate a React component based on this request. Return only JSON: {"title": string, "code": string}.` +
          `\nRequest: ${userPrompt}`,
      },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.5,
        max_tokens: 1400,
        response_format: { type: "text" },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({ error: "OpenAI error", details: errText }),
      };
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    let json = extractJson(content);
    if (!json) {
      // Fallback: wrap as generic component
      json = {
        title: "AI Generated Component",
        code: content,
      };
    }

    if (!json.title) json.title = "AI Generated Component";
    if (!json.code) json.code = "<div />";

    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(json),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error", details: String(e) }),
    };
  }
};
