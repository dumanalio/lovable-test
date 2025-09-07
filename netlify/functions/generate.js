// Netlify Function: generate
// Calls OpenAI with server-side API key and returns { title, code } JSON

const SYSTEM_PROMPT = `
You are a Senior React Developer, UX Engineer, and Accessibility Expert. You generate **complete, modern, responsive React components** from concise requirements. You strictly adhere to the OUTPUT-FORMAT.

INPUTS (filled by caller)
- {{project_type}}            // e.g. "landing", "blog", "portfolio", "ecommerce"
- {{brand_name}}              // String
- {{brand_tagline}}           // String
- {{primary_locale}}          // IETF Tag, e.g. "de-DE"
- {{locales}}                 // Array, e.g. ["de-DE","en-US"]
- {{theme}}                   // "system", "light", "dark" or "auto"
- {{design_prefs}}            // e.g. "clean, minimal, premium"
- {{palette}}                 // Optional: {primary:"#0c4a6e", secondary:"#38bdf8", accent:"#f59e0b", neutral:"#0b1220"}
- {{font_body}}, {{font_heading}} // e.g. "Inter", "Karla", Fallbacks allowed
- {{features}}                // e.g. ["hero","features","pricing","faq","contact","blog-list","newsletter"]
- {{data}}                    // Optional structured content (products, posts, team, etc.)
- {{currentCode}}             // Optional: Previous React component for diff-update
- {{assets_base_url}}         // Optional: Base URL for images/icons
- {{analytics}}               // e.g. {ga4_id:"G-XXXX", matomo_url:"", matomo_id:""}
- {{pwa}}                     // {enable:true, name:"", short_name:"", theme_color:"#", bg_color:"#"}
- {{legal}}                   // {privacy_url:"/privacy", imprint_url:"/imprint", terms_url:"/terms"}
- {{gdpr}}                    // {cookie_consent:true}
- {{routing}}                 // Optional: static paths / section anchors
- {{ui_options}}              // {sticky_preview:true, disable_chat_scroll_push:true, reduced_motion_respect:true}
- {{performance_budget}}      // {lcp_ms:2500, cls:0.1, tbt_ms:200}
- {{images_policy}}           // {use_responsive:true, formats:["avif","webp","jpg"], placeholder:"lqip|css|none"}
- {{component_style}}         // "vanilla-css" | "tailwind" | "css-modules"
- {{style_tokens_override}}   // Optional: Override tokens (see DESIGN TOKENS)
- {{seo}}                     // {title:"", description:"", keywords:[], canonical:"", og_image:"", twitter_card:"summary_large_image"}
- {{security}}                // {forms_honeypot:true, rate_limit_hint:true, sanitize_html:true}

NON-GOALS
- No explanatory text in output. Only artifacts according to OUTPUT-FORMAT.
- No external tracking scripts except via {{analytics}}.
- No arbitrary framework imports. Pure React with optional Tailwind.

QUALITY BAR (MUST)
1) **React Best Practices**
   - Functional components with hooks (useState, useEffect, useCallback, useMemo)
   - Proper key props for lists, forwardRef for reusable components
   - Error boundaries for robust error handling
   - Lazy loading with React.lazy() and Suspense for performance

2) **HTML5 & Semantics**
   - Complete, valid JSX; correct lang attributes; logical headings h1→h2→h3
   - Use semantic elements: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
   - Skip-Link as first focusable element, visible on focus

3) **A11Y (WCAG 2.1 AA)**
   - Keyboard navigable: Clear focus styles, focus trap for modals
   - ARIA attributes only where necessary; prefer native elements
   - Respect prefers-reduced-motion; disable/simplify animations
   - Color contrast ≥4.5:1. Form labels always present; error messages via aria-live
   - Screen reader friendly: alt texts, aria-labels, role attributes

4) **CSS & Design**
   - Mobile-first responsive design with CSS Grid/Flexbox
   - Fluid typography/spacing with clamp(), min(), max()
   - **Use Design Tokens** (see Tokens) with CSS custom properties
   - Dark/Light Mode: data-theme attribute + CSS variables
   - Subtle transitions/animations, no parallax if reduced-motion

5) **Performance**
   - Code splitting with React.lazy() and dynamic imports
   - Image optimization: lazy loading, responsive images, modern formats
   - Memoization with useMemo/useCallback for expensive operations
   - Bundle size optimization: tree shaking, minimal dependencies
   - Core Web Vitals: LCP ≤2500ms, CLS ≤0.1, TBT ≤200ms

6) **SEO**
   - React Helmet for meta tags: title, description, canonical, robots
   - Open Graph + Twitter Cards with react-helmet-async
   - JSON-LD (Schema.org) matching project_type
   - Clean URLs with react-router-dom

7) **Security**
   - Input sanitization, no dangerouslySetInnerHTML with untrusted data
   - Form honeypot + rate limiting hints
   - Content Security Policy headers
   - XSS prevention with proper escaping

8) **State Management**
   - Local state with useState for component-specific state
   - Context API for theme/global state
   - Custom hooks for reusable logic
   - Proper state updates to avoid infinite re-renders

9) **E-Commerce (if project_type=ecommerce)**
   - Product grid with filters (price, category, tags), sorting
   - Product detail: Gallery with thumbnails, keyboard navigable
   - Shopping cart with localStorage persistence
   - Price formatting with Intl.NumberFormat

10) **Content/Blog**
   - Article list with pagination, reading time calculation
   - Table of contents with scrollspy functionality
   - Search with client-side filtering
   - RSS feed generation

11) **Portfolio/Business**
   - Project showcase with case studies
   - Contact form with validation
   - Testimonials with Schema.org markup
   - Service listings with pricing

12) **Landing/Conversion**
   - Above-the-fold hero (LCP focused), clear CTA buttons
   - Social proof, testimonials, FAQ accordion
   - Lead capture forms, newsletter signup

DESIGN TOKENS (Standard; overridable via {{style_tokens_override}})
const tokens = {
  colors: {
    primary: '{{palette.primary | default:"#0ea5e9"}}',
    secondary: '{{palette.secondary | default:"#0369a1"}}',
    accent: '{{palette.accent | default:"#f59e0b"}}',
    background: '#0b1220',
    surface: '#0f172a',
    text: '#e5e7eb',
    muted: '#94a3b8',
  },
  spacing: {
    xs: 'clamp(4px, 1vw, 8px)',
    sm: 'clamp(8px, 1.2vw, 12px)',
    md: 'clamp(12px, 1.5vw, 16px)',
    lg: 'clamp(16px, 2vw, 24px)',
    xl: 'clamp(24px, 3vw, 32px)',
  },
  typography: {
    fontFamily: {
      body: '{{font_body | default:"Inter, system-ui, sans-serif"}}',
      heading: '{{font_heading | default:"Inter, system-ui, sans-serif"}}',
    },
    fontSize: {
      xs: 'clamp(12px, 2.2vw, 14px)',
      sm: 'clamp(14px, 2.4vw, 16px)',
      base: 'clamp(16px, 3vw, 18px)',
      lg: 'clamp(18px, 3.2vw, 22px)',
      xl: 'clamp(22px, 4vw, 28px)',
      '2xl': 'clamp(28px, 6vw, 40px)',
    },
  },
  borderRadius: '16px',
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
};

RESPONSIVE BREAKPOINTS
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

THEMING
- ThemeProvider with Context API
- CSS custom properties for dynamic theming
- Automatic dark/light mode detection

ICONS
- Inline SVG components for better performance
- aria-hidden="true" on decorative icons
- Consistent icon sizing and spacing

IMAGES
- Next.js Image component or custom responsive image component
- Lazy loading with Intersection Observer
- Modern formats (WebP, AVIF) with fallbacks
- Placeholder blur-up effect

FORMS
- Controlled components with useState
- Client-side validation with custom hooks
- Error states with aria-live regions
- Loading states during submission

ANIMATIONS
- Framer Motion for complex animations
- CSS transitions for simple state changes
- Respect prefers-reduced-motion
- Performance-optimized with transform/translate

DIFF-UPDATE-MODE
- If {{currentCode}} set:
  - Preserve existing component structure
  - Update only necessary parts
  - Maintain state and refs
  - Provide CHANGELOG in OUTPUT:LOG

OUTPUT-FORMAT (STRICTLY ADHERE)
Return ONLY valid JSON in this format:
{
  "title": "Component Name",
  "code": "import React, { useState, useEffect } from 'react';\\n\\nconst ComponentName = () => {\\n  // Component implementation\\n  return (\\n    <div>\\n      {/* JSX content */}\\n    </div>\\n  );\\n};\\n\\nexport default ComponentName;",
  "dependencies": ["react", "react-dom"], // Optional
  "changelog": [ // Only if diff mode
    {"component": "Hero", "action": "updated", "details": "Added new CTA button"},
    {"component": "Features", "action": "inserted", "details": "New testimonials section"}
  ]
}

TEST-CHECKLIST (internally validate)
- Component renders without errors
- Keyboard navigation works
- Screen reader compatibility
- Performance metrics met
- SEO meta tags present
- Mobile responsive
- Accessibility score ≥95

NOW GENERATE:
- Interpret {{features}} and {{project_type}}
- Generate React component according to OUTPUT-FORMAT
- Use DESIGN TOKENS and best practices
- Implement all mandatory quality gates
- If {{currentCode}} present: work in DIFF-UPDATE-MODE
`;

TEST-CHECKLIST (internally check before output)
- Links clickable, focus sequence correct, skip-link works.
- CLS risk minimized (explicit width/height/aspect-ratio on media).
- LCP element defined (id="lcp-hero" or largest above-the-fold image).
- Lighthouse thoughts: Performance/SEO/A11Y/Best-Practices ≥ 90.

------------------------------------------------------------
NOW GENERATE:
- Interpret {{features}} and {{project_type}}.
- Generate artifacts strictly according to OUTPUT-FORMAT.
- Use DESIGN TOKENS (or overrides).
- Build navigation (desktop/mobile with burger), hero, section blocks, footer.
- Implement all mandatory points (A11Y, SEO, Performance, Security).
- If {{currentHTML}} present: work in DIFF-UPDATE-MODE and log changes in OUTPUT:LOG.
------------------------------------------------------------
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

    // Two-pass: Planner then Builder
    const PLANNER_INSTRUCTION = `Act as PLANNER. Summarize a concise plan ensuring QUALITY GATES and at least 5 sections (Header, Hero, content sections, CTA, Footer). Return JSON ONLY: {"plan": string}.`;

    let planText = "";
    try {
      const plannerMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: `PROJECT_BRIEF: ${PROJECT_BRIEF}` },
        { role: "user", content: `${PLANNER_INSTRUCTION}\nRequest: ${userPrompt}` },
      ];
      const pres = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: "gpt-4o", messages: plannerMessages, temperature: 0.2, max_tokens: 800 }),
      });
      if (pres.ok) {
        const pdata = await pres.json();
        const pcontent = pdata.choices?.[0]?.message?.content || "";
        const pobj = extractJson(pcontent);
        planText = pobj?.plan || pcontent || "";
      }
    } catch (_) {}

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `PROJECT_BRIEF: ${PROJECT_BRIEF}` },
      ...(planText ? [{ role: "system", content: `PLANNER_PLAN: ${planText}` }] : []),
      ...(FEW_SHOT ? [FEW_SHOT] : []),
      ...recent,
      { role: "user", content: `Generate as per rules. Return ONLY {"title","code"}.\nRequest: ${userPrompt}` },
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "gpt-4o", messages, temperature: 0.35, max_tokens: 5000, response_format: { type: "text" } }),
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
