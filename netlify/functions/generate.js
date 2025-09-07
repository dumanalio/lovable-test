// Netlify Function: generate
// Calls OpenAI with server-side API key and returns { title, code } JSON

const SYSTEM_PROMPT =
  'You are a Senior React Developer. Generate modern, responsive React components with best practices.\n\nREQUIREMENTS:\n- Use functional components with React hooks\n- Use Tailwind CSS for styling\n- Ensure accessibility (WCAG 2.1 AA)\n- Mobile-first responsive design\n- Clean, semantic JSX structure\n\nOUTPUT FORMAT:\nReturn ONLY valid JSON:\n{\n  "title": "Component Name",\n  "code": "import React from \'react\';\\\\n\\\\nconst ComponentName = () => {\\\\n  return (\\\\n    <div className=\'p-4\'>\\\\n      <h1>Hello World</h1>\\\\n    </div>\\\\n  );\\\\n};\\\\n\\\\nexport default ComponentName;"\n}\n\nGenerate a complete React component based on the user\'s request.';

const PROJECT_BRIEF = 'This is a modern React application using Vite, Tailwind CSS, and Framer Motion for animations. The app includes a landing page, admin panel, dashboard, and an AI-powered website builder.';

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

    // Load few-shot example from file to avoid inline escaping issues
    let FEW_SHOT = null;
    try {
      const fs = require("fs");
      const path = require("path");
      const p = path.join(__dirname, "fewshot_new.json");
      if (fs.existsSync(p)) {
        const sample = fs.readFileSync(p, "utf-8");
        FEW_SHOT = { role: "assistant", content: sample };
      }
    } catch (_) {}

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `PROJECT_BRIEF: ${PROJECT_BRIEF}` },
      ...(FEW_SHOT ? [FEW_SHOT] : []),
      ...recent,
      {
        role: "user",
        content: `Generate as per rules. Return ONLY {"title","code"}.\nRequest: ${userPrompt}`,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.35,
        max_tokens: 5000,
        response_format: { type: "text" },
      }),
    });

    // Add detailed logging for debugging
    console.log("Received event:", event);

    // Validate OpenAI response
    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to generate component." }),
      };
    }

    const responseBody = await response.json();
    const content = responseBody.choices[0].message.content;
    const extractedJson = extractJson(content);

    if (!extractedJson) {
      console.error("Failed to extract JSON from response:", responseBody);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Invalid response format." }),
      };
    }

    let json = extractedJson;

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
