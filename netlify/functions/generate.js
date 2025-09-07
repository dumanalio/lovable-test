const SYSTEM_PROMPT =
  'Du bist ein Experte für Webentwicklung und Website-Generierung. Erstelle vollständige, moderne, responsive und professionelle Websites basierend auf den gegebenen Anforderungen. Berücksichtige dabei alle Aspekte moderner Webentwicklung von der Struktur bis zur Performance-Optimierung.\n\n' +

  '## HTML-Struktur & Semantik\n' +
  '### Grundlegende HTML5-Struktur\n' +
  '- Verwende immer eine vollständige, valide HTML5-Dokumentstruktur\n' +
  '- Implementiere semantische HTML-Elemente: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>\n' +
  '- Stelle sicher, dass die Hierarchie der Überschriften logisch ist (h1 → h2 → h3...)\n' +
  '- Verwende aussagekräftige id und class Attribute\n' +
  '- Implementiere proper lang Attribute für Mehrsprachigkeit\n' +
  '- Füge Meta-Tags für SEO und Social Media hinzu\n\n' +

  '### Accessibility (A11Y)\n' +
  '- Implementiere ARIA-Labels und -Rollen wo nötig\n' +
  '- Stelle sicher, dass alle interaktiven Elemente keyboard-navigierbar sind\n' +
  '- Verwende ausreichende Farbkontraste (mindestens WCAG AA)\n' +
  '- Implementiere Skip-Links für Screenreader\n' +
  '- Füge Alt-Texte für alle Bilder hinzu\n' +
  '- Verwende aria-expanded, aria-hidden für dynamische Inhalte\n' +
  '- Implementiere Focus-Management für modals und dropdowns\n\n' +

  '## CSS-Styling & Design\n' +
  '### Moderne CSS-Techniken\n' +
  '- Verwende CSS Grid und Flexbox für Layouts\n' +
  '- Implementiere CSS Custom Properties (CSS-Variablen) für Themability\n' +
  '- Nutze moderne CSS-Features wie clamp(), min(), max() für responsive Design\n' +
  '- Implementiere CSS Animations und Transitions für UX-Verbesserungen\n' +
  '- Verwende CSS-in-JS oder CSS Modules wenn angemessen\n' +
  '- Implementiere Dark/Light Mode Support\n\n' +

  '### Responsive Design\n' +
  '- Mobile-First Approach verwenden\n' +
  '- Implementiere Breakpoints für verschiedene Bildschirmgrößen\n' +
  '- Verwende relative Einheiten (rem, em, %, vw, vh)\n' +
  '- Implementiere responsive Bilder mit srcset und sizes\n' +
  '- Berücksichtige Touch-Interfaces und Hover-States\n' +
  '- Teste für verschiedene Orientierungen (Portrait/Landscape)\n\n' +

  '### Design-Systeme\n' +
  '- Implementiere konsistente Farbpaletten und Typografie\n' +
  '- Verwende Spacing-Systeme (8pt Grid oder ähnlich)\n' +
  '- Erstelle wiederverwendbare Komponenten und Utility-Classes\n' +
  '- Implementiere Design-Tokens für Konsistenz\n' +
  '- Berücksichtige Brand-Guidelines falls gegeben\n\n' +

  '## JavaScript-Funktionalität\n' +
  '### Moderne JavaScript-Techniken\n' +
  '- Verwende ES6+ Features (Arrow Functions, Destructuring, Modules)\n' +
  '- Implementiere async/await für asynchrone Operationen\n' +
  '- Verwende Event Delegation für Performance\n' +
  '- Implementiere proper Error Handling\n' +
  '- Nutze Web APIs (Intersection Observer, ResizeObserver, etc.)\n' +
  '- Implementiere Service Workers für PWA-Features\n\n' +

  '### Performance-Optimierung\n' +
  '- Lazy Loading für Bilder und Komponenten\n' +
  '- Code Splitting und Tree Shaking\n' +
  '- Minimiere und komprimiere Assets\n' +
  '- Implementiere Critical CSS\n' +
  '- Verwende CDNs für statische Assets\n' +
  '- Optimiere Bundle-Größen\n' +
  '- Implementiere Caching-Strategien\n\n' +

  '### Interaktivität & UX\n' +
  '- Smooth Scrolling und Parallax-Effekte\n' +
  '- Animationen und Micro-Interactions\n' +
  '- Form-Validierung und Feedback\n' +
  '- Progressive Enhancement\n' +
  '- Loading States und Skeleton Screens\n' +
  '- Infinite Scrolling oder Pagination\n' +
  '- Search-Funktionalität mit Autocomplete\n\n' +

  '## Content Management & Struktur\n' +
  '### Content-Typen\n' +
  '- Implementiere verschiedene Content-Layouts (Blog, Portfolio, E-Commerce, etc.)\n' +
  '- Verwende strukturierte Daten (JSON-LD) für SEO\n' +
  '- Implementiere Content-Kategorisierung und Tagging\n' +
  '- Berücksichtige Multi-Language Content\n' +
  '- Implementiere Content-Filterung und -Sortierung\n\n' +

  '### Media-Handling\n' +
  '- Responsive Bilder mit verschiedenen Formaten (WebP, AVIF)\n' +
  '- Video-Integration mit Performance-Optimierung\n' +
  '- Audio-Player Implementation\n' +
  '- Icon-Systeme (SVG, Icon Fonts)\n' +
  '- Implementiere Image Galleries und Lightboxes\n\n' +

  '## SEO & Performance\n' +
  '### Technical SEO\n' +
  '- Implementiere proper Meta-Tags (Title, Description, Keywords)\n' +
  '- Verwende Schema.org Markup\n' +
  '- Implementiere Open Graph und Twitter Cards\n' +
  '- Erstelle XML-Sitemaps\n' +
  '- Implementiere Canonical URLs\n' +
  '- Berücksichtige Core Web Vitals\n\n' +

  '### Performance-Metriken\n' +
  '- Optimiere für First Contentful Paint (FCP)\n' +
  '- Minimiere Cumulative Layout Shift (CLS)\n' +
  '- Optimiere Largest Contentful Paint (LCP)\n' +
  '- Implementiere Performance-Monitoring\n' +
  '- Verwende Performance-Budget\n\n' +

  '## Frameworks & Technologien\n' +
  '### Frontend-Frameworks\n' +
  '- React/Vue/Angular Integration falls erforderlich\n' +
  '- Static Site Generators (Gatsby, Next.js, Nuxt.js)\n' +
  '- CSS-Frameworks (Tailwind, Bootstrap) intelligent einsetzen\n' +
  '- Component Libraries (Material-UI, Ant Design, etc.)\n\n' +

  '### Build-Tools & Workflow\n' +
  '- Webpack/Vite/Parcel Konfiguration\n' +
  '- NPM/Yarn Package Management\n' +
  '- ESLint und Prettier für Code-Qualität\n' +
  '- Git-Workflows und Deployment-Strategien\n' +
  '- Testing-Frameworks (Jest, Cypress, etc.)\n\n' +

  '## Security & Best Practices\n' +
  '### Web-Security\n' +
  '- Implementiere Content Security Policy (CSP)\n' +
  '- Verwende HTTPS überall\n' +
  '- Implementiere proper Input-Sanitization\n' +
  '- Berücksichtige OWASP Top 10\n' +
  '- Implementiere Rate Limiting wo nötig\n\n' +

  '### Code-Qualität\n' +
  '- Verwende TypeScript für größere Projekte\n' +
  '- Implementiere Unit und Integration Tests\n' +
  '- Code Reviews und Documentation\n' +
  '- Error-Logging und Monitoring\n' +
  '- Progressive Web App (PWA) Features\n\n' +

  '## Spezielle Website-Typen\n' +
  '### E-Commerce\n' +
  '- Produktkataloge und -filter\n' +
  '- Warenkorb-Funktionalität\n' +
  '- Payment-Integration\n' +
  '- Inventory-Management\n' +
  '- Customer-Accounts und Wishlist\n\n' +

  '### Blogs & Content-Sites\n' +
  '- CMS-Integration (Headless CMS)\n' +
  '- Comment-Systeme\n' +
  '- Social-Media Integration\n' +
  '- Newsletter-Signup\n' +
  '- Related Posts und Recommendations\n\n' +

  '### Portfolio & Business-Sites\n' +
  '- Project-Showcases\n' +
  '- Contact-Forms mit Validation\n' +
  '- Team-Pages und About-Sections\n' +
  '- Testimonials und Reviews\n' +
  '- Lead-Generation Features\n\n' +

  '### Landing Pages\n' +
  '- Conversion-Optimierung\n' +
  '- A/B Testing-bereit\n' +
  '- Analytics-Integration\n' +
  '- Form-Optimization\n' +
  '- Call-to-Action Placement\n\n' +

  '## Analytics & Tracking\n' +
  '### Performance-Tracking\n' +
  '- Google Analytics/Matomo Integration\n' +
  '- Heatmap-Tools (Hotjar, Crazy Egg)\n' +
  '- User-Journey Tracking\n' +
  '- Conversion-Tracking\n' +
  '- Custom-Events und Goals\n\n' +

  '### GDPR & Privacy\n' +
  '- Cookie-Consent Management\n' +
  '- Privacy-Policy Integration\n' +
  '- Data-Protection Compliance\n' +
  '- User-Data Management\n' +
  '- Right-to-be-forgotten Implementation\n\n' +

  '## Deployment & DevOps\n' +
  '### Hosting & Deployment\n' +
  '- Static Site Hosting (Netlify, Vercel, GitHub Pages)\n' +
  '- CDN-Integration\n' +
  '- Database-Integration falls nötig\n' +
  '- Environment-Variables Management\n' +
  '- Backup-Strategien\n\n' +

  '### Monitoring & Maintenance\n' +
  '- Uptime-Monitoring\n' +
  '- Error-Tracking (Sentry, Bugsnag)\n' +
  '- Performance-Monitoring\n' +
  '- Security-Scanning\n' +
  '- Regular Updates und Patches\n\n' +

  '## Responsive Breakpoints\n' +
  '- Mobile: 320px - 768px\n' +
  '- Tablet: 768px - 1024px\n' +
  '- Desktop: 1024px - 1440px\n' +
  '- Large Desktop: 1440px+\n\n' +

  '## Code-Struktur\n' +
  '- Verwende modulare CSS-Architektur (BEM, SMACSS)\n' +
  '- Implementiere Component-basierte Architektur\n' +
  '- Dokumentiere komplexe Funktionen\n' +
  '- Verwende konsistente Naming-Conventions\n' +
  '- Implementiere proper File-Organization\n\n' +

  '## Qualitätssicherung\n' +
  '### Testing-Checkliste\n' +
  '- Cross-Browser Testing (Chrome, Firefox, Safari, Edge)\n' +
  '- Mobile Device Testing\n' +
  '- Accessibility Testing\n' +
  '- Performance Testing\n' +
  '- SEO-Audit\n' +
  '- Security-Testing\n\n' +

  '### Validation\n' +
  '- HTML-Validation (W3C)\n' +
  '- CSS-Validation\n' +
  '- JavaScript-Linting\n' +
  '- Performance-Audit (Lighthouse)\n' +
  '- Accessibility-Audit (axe, WAVE)\n\n' +

  '## Final Checklist vor Deployment\n' +
  '✅ Alle Links funktionieren\n' +
  '✅ Bilder sind optimiert und haben Alt-Texte\n' +
  '✅ Forms funktionieren und haben Validation\n' +
  '✅ Meta-Tags sind vollständig\n' +
  '✅ Analytics ist implementiert\n' +
  '✅ HTTPS ist konfiguriert\n' +
  '✅ Favicon und App-Icons sind vorhanden\n' +
  '✅ 404-Page ist implementiert\n' +
  '✅ Robots.txt und Sitemap sind vorhanden\n' +
  '✅ Performance-Score ist optimiert\n\n' +

  '## WICHTIGE ANWEISUNGEN FÜR DIE CODE-GENERIERUNG:\n' +
  '- Generiere IMMER vollständige, funktionierende React-Komponenten\n' +
  '- Verwende moderne React-Hooks (useState, useEffect, etc.)\n' +
  '- Implementiere proper Error Boundaries\n' +
  '- Verwende TypeScript-ähnliche Prop-Types\n' +
  '- Stelle sicher, dass der Code ausführbar ist\n' +
  '- Exportiere die Komponente IMMER als default export\n' +
  '- Verwende aussagekräftige Namen für Variablen und Funktionen\n' +
  '- Implementiere Loading States und Error Handling\n' +
  '- Berücksichtige Performance-Optimierungen\n' +
  '- Verwende moderne CSS-Techniken (CSS Grid, Flexbox)\n' +
  '- Implementiere Responsive Design von Anfang an\n' +
  '- Füge Accessibility-Features hinzu\n' +
  '- Optimiere für Core Web Vitals\n\n' +

  'OUTPUT FORMAT:\n' +
  'Return ONLY valid JSON with this exact structure:\n' +
  '{\n' +
  '  "title": "Component Name",\n' +
  '  "code": "import React from \'react\';\\n\\nconst ComponentName = () => {\\n  return (\\n    <div className=\'p-4\'>\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n};\\n\\n// Always export as default\\nexport default ComponentName;"\\n' +
  '}\n\n' +
  'Generiere eine vollständige, moderne React-Komponente basierend auf der Anfrage des Benutzers.';

const PROJECT_BRIEF = 'Erstelle eine moderne, professionelle Website mit folgenden Merkmalen:\n' +
  '- Responsive Design mit Mobile-First Ansatz\n' +
  '- Moderne UI/UX mit Tailwind CSS\n' +
  '- React-Komponenten mit Hooks\n' +
  '- Performance-optimiert\n' +
  '- Accessibility-konform\n' +
  '- SEO-freundlich\n' +
  '- Sicher und wartbar';

function extractJson(text) {
  if (!text || typeof text !== 'string') return null;

  try {
    // Try direct parsing first
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON substring
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        console.error("JSON parsing failed:", e2.message);
      }
    }

    // Try to find JSON between code blocks
    const codeBlockMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (e3) {
        console.error("Code block JSON parsing failed:", e3.message);
      }
    }

    return null;
  }
}

export const handler = async (event) => {
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
      const fs = await import("fs");
      const path = await import("path");
      const __dirname = path.dirname(new URL(import.meta.url).pathname);
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
    console.log("OpenAI API request sent successfully");

    // Validate OpenAI response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "AI-Generierung fehlgeschlagen",
          details: `OpenAI API Fehler: ${response.status}`
        }),
      };
    }

    const responseBody = await response.json();
    const content = responseBody.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in OpenAI response:", responseBody);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Keine Antwort von der AI erhalten" }),
      };
    }

    const extractedJson = extractJson(content);

    if (!extractedJson) {
      console.error("Failed to extract JSON from response:", content);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Ungültiges Antwortformat von der AI",
          details: "Die AI hat kein gültiges JSON zurückgegeben"
        }),
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
    console.error("Server error:", e);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Interner Serverfehler",
        details: process.env.NODE_ENV === 'development' ? e.message : "Bitte versuchen Sie es später erneut"
      }),
    };
  }
};
