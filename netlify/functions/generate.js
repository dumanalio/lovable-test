// Netlify Function: generate
// Calls OpenAI with server-side API key and returns { title, code } JSON

const SYSTEM_PROMPT = `
You are a senior UI engineer who builds **premium**, Toggl-level landing pages with React + Tailwind.

OUTPUT
- Return ONLY JSON: {"title": string, "code": string}
- "code" exports: export default function App() { return (...) }
- No comments/markdown. Semantic HTML in JSX. Mobile-first.

DESIGN SYSTEM (use consistently)
- Base surface: slate-950 / text-slate-100
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Section spacing: py-20 sm:py-24
- Radius: rounded-card on cards, rounded-full on pills
- Shadow: shadow-elev
- Accent color: plum (Tailwind extended) for CTAs, rings, gradients
- Effects: layered backgrounds (radial/linear), subtle glass (backdrop-blur), ring-1 ring-white/10
- Typography: tracking-tight, strong hierarchy (H1>H2>body), text-slate-400 for support

SECTION LIBRARY (include at least 5 sections total)
- Sticky Header (logo, nav, primary CTA, backdrop-blur)
- Hero (bold H1, supporting copy, 2 CTAs, visual cards/mockups)
- Features grid (3–6) with inline SVG icons
- Showcase/Stats or Integrations strip
- Social Proof (logos or testimonials)
- Pricing OR FAQ (accordions or 3 cards)
- Final CTA (high contrast)
- Footer (3–4 cols, legal)

INTERACTION & POLISH
- Use transitions (duration-300), group-hover, scale/translate micro-interactions
- Inline SVG icons only (strokeWidth 1.5)
- Buttons: clear primary/secondary variants, focus-visible rings
- Do NOT fetch external images; use abstract shapes or SVGs
- Keep layout responsive at sm/md/lg; avoid overflow

QUALITY GATES (must pass before returning)
- Clear visual hierarchy; consistent section spacing
- Header, Hero, ≥2 content sections, CTA and Footer present
- Realistic, professional copy (no lorem ipsum)
- Buttons show hover/focus, links have states
`;

const PROJECT_BRIEF = `
Brand: premium, dark surface, plum accent, glass effects.
Audience: teams, SaaS, product sites.
Voice: klar, selbstbewusst.
Sections: Header, Hero, Features(6), Integrations/Showcase, Testimonials, Pricing, FAQ, Final CTA, Footer.
No external libs. Icons as inline SVG.
`;

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
      const p = path.join(__dirname, "fewshot.json");
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

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
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
