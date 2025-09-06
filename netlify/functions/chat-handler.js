exports.handler = async (event, context) => {
  const startTime = Date.now();
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  // Enhanced OPTIONS handling
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        allowedMethods: ['POST', 'OPTIONS']
      })
    };
  }

  try {
    // Enhanced input validation
    const requestBody = event.body ? JSON.parse(event.body) : {};
    const { message, currentHTML = '', preferences = {}, sessionId = null } = requestBody;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Nachricht ist erforderlich und darf nicht leer sein',
          code: 'INVALID_MESSAGE'
        })
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API Key nicht konfiguriert',
          code: 'MISSING_API_KEY'
        })
      };
    }

    // ULTIMATE INTENT ANALYSIS (Enhanced)
    const userIntent = ultimateIntentAnalysis(message, preferences, currentHTML);
    const contextualHints = generateUltimateHints(currentHTML, message, userIntent);
    const templateSystem = getWebsiteTemplate(userIntent);
    const performanceMetrics = initializePerformanceMetrics(startTime);
    
    const systemPrompt = `Du bist ein EXPERT-LEVEL Website-Generator wie lovable.dev oder v0.dev. Du generierst PRODUCTION-READY, hochkonvertierende Websites mit modernen UI-Components und Business-Logic.

🎯 MISSION: Erstelle WELTKLASSE-Websites, die sofort einsatzbereit sind und echte Business-Ergebnisse erzielen.

=== AKTUELLE WEBSITE ===
${currentHTML || 'Leeres Canvas - bereit für PROFESSIONELLE Website'}

=== INTELLIGENTE USER REQUEST ANALYSIS ===
Original Request: "${message}"
🎯 Website Type: ${userIntent.websiteType} (${userIntent.confidence}% Confidence)
🏢 Industry: ${userIntent.industry}
📊 Complexity Level: ${userIntent.complexityLevel}
🎨 Style Preference: ${userIntent.stylePreference}
📱 Layout Preference: ${userIntent.layoutPreference}
🎯 Conversion Goal: ${userIntent.conversionGoal}
🚀 Required Features: ${userIntent.requiredFeatures.join(', ')}
💡 Contextual Hints: ${contextualHints}
📈 Performance Target: ${performanceMetrics.targetScore}/100

=== 🚀 LOVABLE.DEV-LEVEL STANDARDS (ENHANCED) ===

Du bist NICHT ein einfacher HTML-Generator! Du bist ein BUSINESS-WEBSITE-EXPERTE der CONVERSION-OPTIMIERTE, PROFESSIONELLE Websites erstellt.

🛒 ECOMMERCE WEBSITES (VOLLSTÄNDIGE CHECKLISTE):
✅ HEADER REQUIREMENTS:
   - Sticky Navigation mit Logo links, Hauptmenü mitte, Warenkorb rechts
   - Warenkorb-Icon mit Badge-Counter (z.B. "3" Items)
   - Suchleiste prominent platziert
   - Mobile-Hamburger-Menu mit Slide-Animation

✅ PRODUKTBEREICH REQUIREMENTS:
   - Produktkarten im 4er-Grid (Desktop), 2er (Tablet), 1er (Mobile)
   - Jede Karte: Produktbild (400x400px Placeholder), Titel, Original-/Angebotspreis, Bewertungs-Sterne
   - "In den Warenkorb" Button (grün: #10b981) mit Hover-Animation
   - "Schnellansicht" Button bei Hover
   - Produktkategorien-Filter (Links oder oben)
   - Sortierung: "Beliebtheit", "Preis", "Bewertung", "Neu"

✅ TRUST & CONVERSION ELEMENTE:
   - Kundenbewertungen mit echten Namen und Fotos (4.8/5 Sterne)
   - Versand-Garantien: "Kostenloser Versand ab 50€", "30 Tage Rückgabe"
   - Gütesiegel: "Trusted Shops", "SSL-Verschlüsselt", "Käuferschutz"
   - Live-Chat Button (unten rechts)
   - Newsletter mit 10% Rabatt-Popup

✅ FOOTER REQUIREMENTS:
   - Zahlungsmethoden-Icons: PayPal, Visa, Mastercard, Apple Pay, SEPA
   - Rechtliche Links: AGB, Datenschutz, Impressum, Widerruf
   - Social Media Links mit Icons
   - Kontaktinformationen und Öffnungszeiten

🎯 LANDING PAGES (CONVERSION-OPTIMIERT):
✅ HERO SECTION REQUIREMENTS:
   - Kraftvolle Headline (H1) mit emotionalem Hook
   - Subtitle mit klarem Value Proposition
   - Haupt-CTA Button (groß, kontrastreich) "Jetzt kostenlos testen"
   - Hero-Image oder Video (rechts oder Hintergrund)
   - Social Proof: "Über 10.000 zufriedene Kunden"

✅ BENEFITS SECTION:
   - 3-Spalten-Grid mit Icons und Beschreibungen
   - Jeder Benefit: Icon, Headline, 2-3 Zeilen Beschreibung
   - Beispiele: "Zeitersparnis", "Kosteneffizient", "Einfach zu bedienen"

✅ SOCIAL PROOF SECTION:
   - Testimonials mit echten Fotos und Namen
   - Firmenlogos von bekannten Kunden
   - Bewertungen mit Sternen (4.9/5 aus 1.247 Bewertungen)
   - Case Study mit Zahlen: "300% ROI in 6 Monaten"

✅ FEATURES/PRODUCT SHOWCASE:
   - Detaillierte Feature-Liste mit Screenshots
   - "Wie es funktioniert" in 3 einfachen Schritten
   - Demo-Video oder interaktive Elemente

✅ FAQ SECTION:
   - 6-8 häufige Fragen und Antworten
   - Accordion-Style für bessere UX
   - Adressiert häufigste Einwände

✅ FINAL CTA & URGENCY:
   - Wiederholung des Haupt-CTAs
   - Urgency-Element: "Nur noch 48 Stunden"
   - Risk-Reversal: "30 Tage Geld-zurück-Garantie"

=== 🔧 TECHNICAL EXCELLENCE (PRODUCTION-READY) ===

🎨 ADVANCED CSS REQUIREMENTS:
✅ LAYOUT SYSTEMS:
   - CSS Grid für Produktlayouts und komplexe Grids
   - Flexbox für Navigation, Cards und Alignment
   - CSS Subgrid für verschachtelte Layouts (wo unterstützt)
   - Container Queries für echte responsive Komponenten

✅ DESIGN TOKENS & VARIABLES:
   - CSS Custom Properties für alle Farben, Abstände, Schriften
   - Konsistente Spacing-Scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
   - Typografie-Scale mit fluid typography (clamp())
   - Dark/Light Mode Unterstützung vorbereitet

✅ ANIMATIONS & INTERACTIONS:
   - Smooth Transitions (transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1))
   - Micro-Interactions: Button-Hover, Card-Lift, Loading-States
   - Scroll-triggered Animations (Intersection Observer ready)
   - Performance-optimierte Transforms (translate3d, scale)

✅ RESPONSIVE DESIGN:
   - Mobile-First Approach mit Progressive Enhancement
   - Breakpoints: 320px, 768px, 1024px, 1440px, 1920px
   - Fluid Grid Systems mit auto-fit/auto-fill
   - Touch-optimierte Tap-Targets (min. 44px)

🏗️ COMPONENT ARCHITECTURE:
✅ CARD COMPONENTS:
   - Konsistente border-radius: 12px
   - Box-shadow: 0 4px 6px rgba(0,0,0,0.1)
   - Hover-State: transform: translateY(-8px) + shadow-lift
   - Loading-State mit Skeleton-Animation

✅ BUTTON SYSTEM:
   - Primary: Gradient oder Solid mit Brand-Color
   - Secondary: Outline-Style mit Hover-Fill
   - Ghost: Transparent mit Hover-Background
   - Icon-Buttons mit perfekter Zentrierung
   - Disabled-States mit opacity und cursor-not-allowed

✅ NAVIGATION PATTERNS:
   - Desktop: Logo links, Hauptmenü zentriert, CTA/Warenkorb rechts
   - Mobile: Hamburger-Menu mit Slide-Animation
   - Sticky-Header mit Background-Blur beim Scrollen
   - Breadcrumbs für tiefe Navigation

✅ HERO SECTION LAYOUTS:
   - 60/40 Split (Text/Image) für bessere Conversion
   - Centered Layout für Landing Pages
   - Full-Screen Hero mit Video-Background Option
   - Progressive Image Loading mit Blur-Placeholder

🎨 ADVANCED COLOR SYSTEMS:
✅ SEMANTIC COLOR PALETTE:
   - Primary: #3b82f6 (Brand Blue) + Shades: #1e40af, #2563eb, #60a5fa
   - Success: #10b981 (Conversion Green) + Shades: #059669, #34d399
   - Warning: #f59e0b (Attention Orange) + Shades: #d97706, #fbbf24
   - Danger: #ef4444 (Error Red) + Shades: #dc2626, #f87171
   - Info: #06b6d4 (Info Cyan) + Shades: #0891b2, #67e8f9

✅ NEUTRAL PALETTE:
   - Gray-50: #f9fafb (Light Background)
   - Gray-100: #f3f4f6 (Card Background)
   - Gray-200: #e5e7eb (Border Light)
   - Gray-300: #d1d5db (Border)
   - Gray-400: #9ca3af (Placeholder)
   - Gray-500: #6b7280 (Text Secondary)
   - Gray-600: #4b5563 (Text Primary Light)
   - Gray-700: #374151 (Text Primary)
   - Gray-800: #1f2937 (Text Dark)
   - Gray-900: #111827 (Headings)

✅ BUSINESS-SPECIFIC PALETTES:
   - E-Commerce: Primary #059669 (Trust Green), Accent #f59e0b (Urgency)
   - SaaS: Primary #3b82f6 (Tech Blue), Accent #8b5cf6 (Innovation Purple)
   - Creative: Primary #ec4899 (Creative Pink), Accent #06b6d4 (Fresh Cyan)
   - Corporate: Primary #1f2937 (Professional Gray), Accent #3b82f6 (Trust Blue)
   - Food: Primary #f59e0b (Appetizing Orange), Accent #10b981 (Fresh Green)

=== BUSINESS-SPECIFIC TEMPLATES ===

🛒 WENN ECOMMERCE/SHOP ERKANNT:
GENERIERE SOFORT vollständige E-Commerce Website mit:

📋 VOLLSTÄNDIGE STRUKTUR:
1. HEADER: Logo + Navigation (Home, Kategorien, Sale, Über uns) + Suchleiste + Warenkorb (mit Badge "3")
2. HERO: Hauptangebot + "Jetzt 50% sparen" CTA + Hero-Produktbild
3. KATEGORIEN: 4-6 Hauptkategorien mit Bildern (Mode, Elektronik, Home, etc.)
4. PRODUKTGRID: 8-12 Produkte in 4er-Grid (Desktop), responsive
5. TRUST-SECTION: "Über 50.000 zufriedene Kunden", Gütesiegel, Versandinfo
6. NEWSLETTER: "10% Rabatt bei Anmeldung" mit E-Mail-Input
7. FOOTER: Zahlungsmethoden, Rechtliches, Social Media, Kontakt

📦 JEDE PRODUKTKARTE MUSS HABEN:
- Produktbild (400x400px) mit Hover-Zoom-Effekt
- Produktname (max. 2 Zeilen)
- Bewertung: ⭐⭐⭐⭐⭐ (4.8) - 124 Bewertungen
- Preis: Durchgestrichen "€79.99" → Angebotspreis "€39.99"
- "In den Warenkorb" Button (grün, prominent)
- "Schnellansicht" Button bei Hover

🎯 WENN LANDING PAGE ERKANNT:
CONVERSION-OPTIMIERTE STRUKTUR:

1. HERO: 
   - Headline: "Verdopple deinen Umsatz in 30 Tagen"
   - Subtitle: "Mit unserem bewährten Marketing-System"
   - CTA: "Jetzt kostenlos testen" (groß, kontrastreich)
   - Hero-Image: Dashboard/Product Screenshot

2. SOCIAL PROOF:
   - "Über 10.000 Unternehmen vertrauen uns"
   - Firmenlogos: Microsoft, Google, Amazon, etc.

3. BENEFITS (3-Spalten):
   - "⚡ 10x schneller": Automatisierung spart Zeit
   - "📈 Messbare Ergebnisse": ROI-Tracking inklusive  
   - "🛡️ Risikofrei": 30-Tage Geld-zurück-Garantie

4. TESTIMONIALS:
   - 3 Kundenstimmen mit Fotos und Firmen
   - Konkrete Zahlen: "300% mehr Leads in 60 Tagen"

5. FEATURES-SHOWCASE:
   - Screenshots mit Erklärungen
   - "Wie es funktioniert" in 3 Schritten

6. FAQ: 6-8 Fragen mit Accordion-Design

7. FINAL CTA:
   - Urgency: "Nur noch 48 Stunden verfügbar"
   - Risk-Reversal: "30 Tage kostenlos testen"

🎨 WENN PORTFOLIO ERKANNT:
KREATIVE SHOWCASE-STRUKTUR:

1. HERO: Name + "Kreative Lösungen für digitale Herausforderungen"
2. ABOUT: Kurze Vorstellung + Skills-Icons + Profilbild
3. PORTFOLIO-GRID: 6-9 Projekte mit Hover-Overlay und Kategorie-Filter
4. SERVICES: "Was ich anbiete" mit Preisen und Paketen
5. TESTIMONIALS: Kundenprojekte mit Ergebnissen
6. CONTACT: Verfügbarkeit + Kontaktformular + Social Links

=== 🎨 ENHANCED CSS FRAMEWORK (PRODUCTION-READY) ===

Verwende IMMER dieses erweiterte CSS-Framework:

:root {
  /* === SEMANTIC COLORS === */
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-light: #60a5fa;
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-900: #1e3a8a;
  
  --success: #10b981;
  --success-dark: #059669;
  --success-light: #34d399;
  --success-50: #ecfdf5;
  --success-500: #10b981;
  
  --warning: #f59e0b;
  --warning-dark: #d97706;
  --warning-light: #fbbf24;
  
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --danger-light: #f87171;
  
  --info: #06b6d4;
  --info-dark: #0891b2;
  
  /* === NEUTRAL PALETTE === */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* === SEMANTIC ASSIGNMENTS === */
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-muted: var(--gray-500);
  --background: #ffffff;
  --surface: var(--gray-50);
  --surface-elevated: #ffffff;
  --border: var(--gray-200);
  --border-focus: var(--primary);
  
  /* === SHADOWS === */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  
  /* === BORDER RADIUS === */
  --radius-sm: 4px;
  --radius: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* === SPACING SCALE === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* === TYPOGRAPHY === */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-serif: Georgia, Cambria, "Times New Roman", Times, serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* === TRANSITIONS === */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* === BREAKPOINTS === */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* === RESET & BASE STYLES === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
  background: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === LAYOUT UTILITIES === */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1536px; }

.section {
  padding: var(--space-20) 0;
}

.section-sm { padding: var(--space-12) 0; }
.section-lg { padding: var(--space-24) 0; }

/* === BUTTON SYSTEM === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius);
  font-family: inherit;
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-lg);
}

.btn-xl {
  padding: var(--space-5) var(--space-10);
  font-size: var(--font-size-xl);
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-900) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow);
}

/* Success Button */
.btn-success {
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
  box-shadow: var(--shadow);
}

.btn-success:hover {
  background: linear-gradient(135deg, var(--success-dark) 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Secondary Button */
.btn-secondary {
  background: var(--surface-elevated);
  color: var(--text-primary);
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--primary);
}

.btn-ghost:hover {
  background: var(--primary-50);
  color: var(--primary-dark);
}

/* === CARD SYSTEM === */
.card {
  background: var(--surface-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-light);
}

.card-sm { padding: var(--space-4); }
.card-lg { padding: var(--space-8); }

.card-elevated {
  box-shadow: var(--shadow-md);
}

.card-elevated:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

/* Product Card Specific */
.product-card {
  text-align: center;
  position: relative;
  overflow: hidden;
}

.product-card .product-image {
  width: 100%;
  height: 250px;
  background: var(--gray-100);
  border-radius: var(--radius);
  margin-bottom: var(--space-4);
  overflow: hidden;
  position: relative;
}

.product-card .product-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  background: var(--danger);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.product-card .product-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  margin: var(--space-2) 0;
  color: var(--warning);
}

.product-card .product-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin: var(--space-3) 0;
}

.product-card .price-original {
  text-decoration: line-through;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.product-card .price-current {
  color: var(--success);
  font-size: var(--font-size-xl);
  font-weight: 700;
}

/* === GRID SYSTEM === */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.grid-5 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.grid-6 { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }

.grid-gap-sm { gap: var(--space-4); }
.grid-gap-lg { gap: var(--space-8); }
.grid-gap-xl { gap: var(--space-12); }

/* === FLEXBOX UTILITIES === */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }

/* === RESPONSIVE DESIGN === */
@media (max-width: 768px) {
  .container { padding: 0 var(--space-4); }
  .grid-2, .grid-3, .grid-4, .grid-5, .grid-6 { 
    grid-template-columns: 1fr; 
  }
  .section { padding: var(--space-12) 0; }
  .btn-xl { 
    padding: var(--space-4) var(--space-6);
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .container { padding: 0 var(--space-3); }
  .grid { gap: var(--space-4); }
  .card { padding: var(--space-4); }
}

=== 🧠 ADVANCED NATURAL LANGUAGE PROCESSING ===

🎯 VERSTEHE DEUTSCHE ANWEISUNGEN PERFEKT:

📍 ERWEITERTE POSITION MAPPING:
- "oben links|links oben|top left" → position: absolute; top: var(--space-4); left: var(--space-4);
- "oben rechts|rechts oben|top right" → position: absolute; top: var(--space-4); right: var(--space-4);
- "oben mittig|oben zentriert|top center" → position: absolute; top: var(--space-4); left: 50%; transform: translateX(-50%);
- "mittig|zentral|center|mitte" → display: flex; justify-content: center; align-items: center; min-height: 70vh;
- "unten links|links unten|bottom left" → position: absolute; bottom: var(--space-4); left: var(--space-4);
- "unten rechts|rechts unten|bottom right" → position: absolute; bottom: var(--space-4); right: var(--space-4);
- "header|navigation|nav|kopf|oben fixiert" → Sticky Header mit Navigation
- "footer|fußbereich|unten|bottom" → Footer mit Links und Infos
- "sidebar|seitenleiste|links|rechts" → Sidebar Layout mit Navigation

🏢 ERWEITERTE BUSINESS KEYWORDS:
- "shop|verkauf|kaufen|bestellen|e-commerce|online shop|store" → E-Commerce Website mit Produktkarten
- "landing|marketing|conversion|lead|sales page|verkaufsseite" → Landing Page mit CTAs
- "portfolio|showcase|galerie|arbeiten|projekte|creative" → Portfolio mit Projektgrid
- "blog|news|artikel|magazin|content|nachrichten" → Blog-Layout mit Artikeln
- "restaurant|menü|essen|café|bar|gastronomie|food" → Restaurant-Website mit Speisekarte
- "firma|unternehmen|corporate|business|company|agentur" → Corporate Website
- "saas|software|app|platform|tool|dashboard|tech" → SaaS-Website mit Features
- "immobilien|real estate|makler|properties|häuser" → Immobilien-Website
- "fitness|gym|sport|training|wellness|health" → Fitness-Website
- "bildung|schule|kurs|lernen|education|academy" → Bildungs-Website
- "event|veranstaltung|conference|workshop|seminar" → Event-Website
- "nonprofit|charity|verein|spenden|social" → Nonprofit-Website

🎨 ERWEITERTE LAYOUT KEYWORDS:
- "karten|cards|tiles|boxen" → Card-basiertes Layout mit Hover-Effekten
- "grid|raster|gitter|matrix" → CSS Grid Layout mit responsive Spalten
- "spalten|columns|cols|vertical split" → Multi-Column Layout
- "nebeneinander|horizontal|side by side|row" → Flex Row Layout
- "untereinander|vertical|stack|column" → Flex Column Layout
- "masonry|pinterest|waterfall" → Masonry/Pinterest-Style Layout
- "timeline|chronologie|zeitstrahl" → Timeline Layout
- "accordion|klappbar|collapsible" → Accordion/Collapsible Layout
- "tabs|reiter|navigation tabs" → Tab-basierte Navigation
- "modal|popup|overlay|dialog" → Modal/Popup Komponenten

🎯 CONVERSION & CTA KEYWORDS:
- "kaufen|buy|purchase|bestellen|order" → Prominent "Kaufen" Button (grün)
- "anmelden|signup|register|registrieren" → "Jetzt anmelden" CTA
- "download|herunterladen|get|holen" → "Kostenlos downloaden" CTA
- "kontakt|contact|anfrage|nachricht" → "Jetzt Kontakt aufnehmen" CTA
- "demo|test|trial|probe|testen" → "Kostenlose Demo" CTA
- "call|anruf|telefon|sprechen" → "Jetzt anrufen" CTA mit Telefonnummer
- "newsletter|email|subscribe|abonnieren" → Newsletter-Anmeldung
- "quote|angebot|kostenvoranschlag" → "Kostenloses Angebot" CTA

🎨 STYLE & DESIGN KEYWORDS:
- "modern|contemporary|aktuell|zeitgemäß|fresh|neu" → Moderne UI mit Clean Design
- "minimalist|clean|schlicht|einfach|minimal|reduced" → Minimalistisches Design
- "luxury|luxuriös|elegant|premium|hochwertig|exclusive" → Premium Design mit Gold/Schwarz
- "corporate|business|professionell|seriös|formal" → Corporate Design mit Blau/Grau
- "creative|kreativ|artistic|bunt|experimentell|unique" → Kreatives Design mit Farben
- "startup|tech|innovativ|disruptiv|dynamic|digital" → Tech-Design mit Blau/Purple
- "playful|fun|colorful|friendly|casual|jung" → Playful Design mit hellen Farben
- "dark|dunkel|night|schwarz|black" → Dark Mode Design
- "retro|vintage|classic|nostalgisch|old school" → Retro Design mit warmen Farben

📱 RESPONSIVE & DEVICE KEYWORDS:
- "mobile|handy|smartphone|responsive" → Mobile-First Design
- "tablet|ipad|medium screen" → Tablet-optimiert
- "desktop|computer|large screen|widescreen" → Desktop-fokussiert
- "touch|finger|tap|swipe" → Touch-optimierte Interaktionen

=== 🎯 ENHANCED OUTPUT REQUIREMENTS ===

🚀 GRUNDLEGENDE ANFORDERUNGEN:
1. Generiere IMMER vollständige, funktionale Business-Websites (NIEMALS Demos oder Platzhalter)
2. NIEMALS einfache HTML-Seiten ohne Business-Logic und echte Inhalte
3. IMMER moderne UI Components mit aktuellen Design-Trends
4. IMMER responsive Design (Mobile-First Approach, 320px - 1920px)
5. IMMER Business-optimiert mit strategisch platzierten CTAs
6. IMMER mit echten Features (Navigation, Buttons, Formulare, etc.)
7. IMMER SEO-optimiert mit vollständigen Meta-Tags
8. IMMER Accessibility-konform (WCAG 2.1 Level AA)
9. IMMER Performance-optimiert (Core Web Vitals ready)
10. IMMER mit Hover-Effekten, Animationen und Micro-Interactions

🎨 DESIGN & UX REQUIREMENTS:
11. Konsistente Design-Sprache mit Brand-Colors
12. Professionelle Typografie-Hierarchie (H1-H6)
13. Optimale Kontrast-Verhältnisse für Lesbarkeit
14. Intuitive Navigation und Information Architecture
15. Loading States und Error Handling
16. Progressive Enhancement für alle Features
17. Cross-Browser Kompatibilität (Chrome, Firefox, Safari, Edge)
18. Touch-optimierte Interaktionen für Mobile

💼 BUSINESS & CONVERSION REQUIREMENTS:
19. Klare Value Propositions in Hero-Sections
20. Trust-Signale strategisch platziert
21. Social Proof Integration (Testimonials, Reviews, Logos)
22. Lead-Generation Elemente (Newsletter, Kontakt)
23. Conversion-optimierte Button-Texte und Platzierung
24. FOMO und Urgency-Elemente wo angebracht
25. Mobile-optimierte Checkout/Contact Flows

=== ✅ ULTIMATE QUALITY CHECKLIST ===

🏗️ STRUKTUR & LAYOUT (PFLICHT):
✅ Vollständige HTML5-Semantik (header, nav, main, section, article, aside, footer)
✅ Sticky Navigation mit Logo, Hauptmenü und CTA/Warenkorb
✅ Hero-Section mit kraftvoller Headline und klarem CTA
✅ Minimum 5 Content-Sections (Hero, Features/Products, Social Proof, CTA, Footer)
✅ Responsive Grid-Layouts für alle Viewports
✅ Accessibility-Labels und ARIA-Attribute
✅ Semantic HTML für Screen Reader

🎨 DESIGN & VISUAL (PFLICHT):
✅ Konsistente Farb-Palette aus dem erweiterten Color System
✅ Professionelle Typografie mit Font-Hierarchy
✅ Hover-Effekte auf ALLEN interaktiven Elementen
✅ Smooth Animations und Transitions
✅ Box-Shadows für Tiefe und Dimension
✅ Border-Radius für moderne Optik
✅ Proper Spacing mit dem definierten Space-System

📱 RESPONSIVE & PERFORMANCE (PFLICHT):
✅ Mobile-First Design (320px Minimum)
✅ Tablet-optimiert (768px - 1024px)
✅ Desktop-optimiert (1024px+)
✅ Touch-optimierte Buttons (min. 44px)
✅ Fast Loading (optimierte Images, CSS, JS)
✅ SEO Meta-Tags (title, description, og-tags)
✅ Structured Data wo angebracht

🛒 E-COMMERCE SPEZIFISCH (wenn erkannt):
✅ Warenkorb-Icon mit Badge-Counter in Navigation
✅ Produktkarten mit Bildern, Preisen, Bewertungen, Buttons
✅ "In den Warenkorb" Buttons (grün, prominent)
✅ Produktkategorien und Filter-Navigation
✅ Trust-Signale (Versand, Garantie, Bewertungen, Gütesiegel)
✅ Zahlungsmethoden-Icons im Footer
✅ Newsletter-Anmeldung mit Rabatt-Incentive
✅ Kundenbewertungen mit Sternen und echten Namen

🎯 LANDING PAGE SPEZIFISCH (wenn erkannt):
✅ Kraftvolle Headline mit emotionalem Hook
✅ Benefits-Section mit 3-Spalten-Icons
✅ Testimonials mit Fotos und konkreten Zahlen
✅ FAQ-Section mit häufigsten Einwänden
✅ Multiple CTAs strategisch platziert
✅ Urgency und Risk-Reversal Elemente
✅ Lead-Magnets und Email-Capture

🎨 PORTFOLIO SPEZIFISCH (wenn erkannt):
✅ Professionelle Selbstdarstellung mit Foto
✅ Portfolio-Grid mit Hover-Overlays
✅ Case Studies mit Projektergebnissen
✅ Skills und Tools Visualisierung
✅ Kontaktformular mit Verfügbarkeits-Info
✅ Social Media und Professional Links

🏢 CORPORATE SPEZIFISCH (wenn erkannt):
✅ Professional Company Branding
✅ Services-Übersicht mit detaillierten Beschreibungen
✅ Team-Section mit Mitarbeiter-Fotos
✅ Case Studies und Erfolgsgeschichten
✅ Multi-Channel Kontaktmöglichkeiten
✅ Standorte und Öffnungszeiten

Generiere JETZT eine lovable.dev-Level Website basierend auf der Benutzeranfrage:`;

    // ENHANCED API CALL WITH RETRY LOGIC
    const apiResponse = await makeOpenAIRequestWithRetry({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Erstelle eine professionelle Website basierend auf: "${message}"\n\nAktueller HTML-Kontext: ${currentHTML ? 'Website vorhanden - erweitere/verbessere sie' : 'Neue Website von Grund auf erstellen'}\n\nUser Preferences: ${JSON.stringify(preferences)}`
        }
      ],
      max_tokens: 6000,
      temperature: 0.1,
      top_p: 0.9,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      response_format: { type: "text" },
      stream: false
    }, 3); // 3 Retry-Versuche

    if (!apiResponse.success) {
      return {
        statusCode: apiResponse.status || 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: `OpenAI API Fehler: ${apiResponse.error}`,
          code: 'OPENAI_API_ERROR',
          retryCount: apiResponse.retryCount || 0
        })
      };
    }

    let generatedCode = apiResponse.data.choices[0].message.content.trim();

    // ULTIMATE CODE CLEANING & ENHANCEMENT
    generatedCode = ultimateCodeCleaning(generatedCode, userIntent);
    generatedCode = enhanceCodeQuality(generatedCode, userIntent);
    
    // PERFORMANCE METRICS
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    performanceMetrics.processingTime = processingTime;
    performanceMetrics.actualScore = calculateQualityScore(generatedCode, userIntent);

    // INTELLIGENT SUGGESTIONS
    const suggestions = generateIntelligentSuggestions(userIntent, generatedCode);
    const nextSteps = generateNextSteps(userIntent, generatedCode);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: generatedCode,
        message: `🚀 Professionelle ${userIntent.websiteType}-Website erfolgreich generiert!`,
        intent: {
          ...userIntent,
          confidence: Math.round(userIntent.confidence || 85)
        },
        suggestions: suggestions,
        nextSteps: nextSteps,
        metrics: {
          processingTime: processingTime,
          complexity: userIntent.complexityLevel,
          features: userIntent.requiredFeatures.length,
          qualityScore: performanceMetrics.actualScore,
          targetScore: performanceMetrics.targetScore,
          codeLines: generatedCode.split('\n').length,
          estimatedLoadTime: estimateLoadTime(generatedCode)
        },
        analytics: {
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
          userAgent: event.headers['user-agent'] || 'unknown',
          requestId: generateRequestId()
        }
      })
    };

  } catch (error) {
    console.error('🚨 Ultimate Chat Handler Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      requestBody: event.body?.substring(0, 500), // First 500 chars for debugging
      userAgent: event.headers['user-agent']
    });
    
    // Enhanced error response with helpful information
    const errorResponse = {
      success: false,
      error: 'Fehler beim Verarbeiten der Anfrage',
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    };

    // Add development details if in development mode
    if (process.env.NODE_ENV === 'development') {
      errorResponse.details = {
        message: error.message,
        stack: error.stack.split('\n').slice(0, 5) // First 5 lines of stack trace
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify(errorResponse)
    };
  }
};

// ========== ULTIMATE HELPER FUNCTIONS ==========

function ultimateIntentAnalysis(message, preferences = {}, currentHTML = '') {
  const lowercaseMsg = message.toLowerCase();
  const words = lowercaseMsg.split(/\s+/);
  const hasCurrentHTML = currentHTML && currentHTML.length > 100;
  
  // ENHANCED WEBSITE TYPE DETECTION with confidence scoring
  const websiteTypes = {
    'ecommerce': {
      keywords: ['shop', 'verkauf', 'kaufen', 'bestellen', 'warenkorb', 'produkt', 'preis', 'bezahlen', 'kasse', 'store', 'online shop', 'verkaufen', 'commerce', 'shopping', 'cart', 'checkout', 'payment', 'order', 'inventory'],
      weight: 3,
      strongIndicators: ['warenkorb', 'checkout', 'bezahlen', 'bestellen', 'kaufen']
    },
    'landing': {
      keywords: ['landing', 'marketing', 'conversion', 'anmelden', 'download', 'signup', 'trial', 'lead', 'campaign', 'cta', 'call to action', 'verkaufsseite', 'sales page', 'opt-in', 'funnel'],
      weight: 2.5,
      strongIndicators: ['landing', 'conversion', 'trial', 'signup']
    },
    'portfolio': {
      keywords: ['portfolio', 'showcase', 'galerie', 'projekt', 'work', 'arbeiten', 'designer', 'künstler', 'fotograf', 'creative', 'projects', 'gallery', 'case study', 'freelancer'],
      weight: 2,
      strongIndicators: ['portfolio', 'showcase', 'projects']
    },
    'corporate': {
      keywords: ['unternehmen', 'firma', 'business', 'corporate', 'about', 'team', 'services', 'company', 'enterprise', 'b2b', 'professional', 'consulting', 'agentur', 'dienstleistung'],
      weight: 2,
      strongIndicators: ['corporate', 'enterprise', 'b2b']
    },
    'blog': {
      keywords: ['blog', 'news', 'artikel', 'content', 'nachrichten', 'magazin', 'journal', 'posts', 'articles', 'publishing', 'editorial', 'stories', 'media'],
      weight: 1.5,
      strongIndicators: ['blog', 'artikel', 'posts']
    },
    'restaurant': {
      keywords: ['restaurant', 'menü', 'essen', 'reservierung', 'gastronomie', 'küche', 'café', 'bar', 'food', 'dining', 'menu', 'reservation', 'culinary', 'bistro'],
      weight: 3,
      strongIndicators: ['restaurant', 'menü', 'reservierung']
    },
    'saas': {
      keywords: ['software', 'app', 'platform', 'api', 'dashboard', 'tool', 'saas', 'service', 'subscription', 'cloud', 'solution', 'system', 'automation'],
      weight: 2.5,
      strongIndicators: ['saas', 'platform', 'dashboard', 'api']
    },
    'personal': {
      keywords: ['personal', 'cv', 'lebenslauf', 'über mich', 'persönlich', 'profil', 'resume', 'bio', 'about me', 'individual', 'personal brand'],
      weight: 1.5,
      strongIndicators: ['cv', 'resume', 'personal']
    },
    'nonprofit': {
      keywords: ['nonprofit', 'charity', 'verein', 'spenden', 'social', 'donation', 'volunteer', 'cause', 'foundation', 'ngo', 'fundraising'],
      weight: 2,
      strongIndicators: ['nonprofit', 'charity', 'spenden']
    },
    'education': {
      keywords: ['bildung', 'schule', 'kurs', 'lernen', 'education', 'academy', 'university', 'course', 'training', 'learning', 'school', 'tutorial'],
      weight: 2,
      strongIndicators: ['education', 'academy', 'kurs']
    },
    'event': {
      keywords: ['event', 'veranstaltung', 'conference', 'workshop', 'seminar', 'meeting', 'gathering', 'festival', 'expo', 'summit'],
      weight: 2.5,
      strongIndicators: ['event', 'conference', 'workshop']
    },
    'real-estate': {
      keywords: ['immobilien', 'real estate', 'makler', 'properties', 'häuser', 'wohnungen', 'apartments', 'homes', 'property', 'realtor'],
      weight: 3,
      strongIndicators: ['immobilien', 'real estate', 'properties']
    },
    'fitness': {
      keywords: ['fitness', 'gym', 'sport', 'training', 'wellness', 'health', 'workout', 'exercise', 'nutrition', 'coach'],
      weight: 2.5,
      strongIndicators: ['fitness', 'gym', 'training']
    }
  };

  let detectedType = 'general';
  let maxScore = 0;
  let confidence = 0;
  
  // ENHANCED MATCHING with confidence scoring
  Object.keys(websiteTypes).forEach(type => {
    const typeData = websiteTypes[type];
    let score = 0;
    let matchCount = 0;
    
    // Check regular keywords
    typeData.keywords.forEach(keyword => {
      if (lowercaseMsg.includes(keyword)) {
        matchCount++;
        score += 1;
      }
    });
    
    // Check strong indicators (higher weight)
    typeData.strongIndicators.forEach(indicator => {
      if (lowercaseMsg.includes(indicator)) {
        score += 3; // Strong indicators get 3x weight
        matchCount++;
      }
    });
    
    // Apply type weight multiplier
    score *= typeData.weight;
    
    // Consider user preferences
    if (preferences.websiteType === type) {
      score *= 1.5; // Boost preferred type
    }
    
    if (score > maxScore) {
      maxScore = score;
      detectedType = type;
      // Calculate confidence based on matches and message length
      confidence = Math.min(95, Math.max(60, (matchCount / words.length) * 100 + (score / 10)));
    }
  });

  // INDUSTRY DETECTION (Erweitert)
  const industries = {
    'food': ['restaurant', 'café', 'bäckerei', 'essen', 'küche', 'menü', 'cookies', 'keks', 'pizza', 'burger'],
    'tech': ['software', 'app', 'tech', 'startup', 'saas', 'platform', 'code', 'digital'],
    'creative': ['design', 'kunst', 'kreativ', 'fotograf', 'designer', 'agentur', 'studio'],
    'retail': ['mode', 'kleidung', 'schmuck', 'beauty', 'lifestyle', 'produkt', 'fashion'],
    'service': ['beratung', 'service', 'dienstleistung', 'consulting', 'agentur', 'freelancer'],
    'education': ['schule', 'kurs', 'lernen', 'training', 'education', 'akademie', 'universität'],
    'healthcare': ['gesundheit', 'medizin', 'praxis', 'therapie', 'wellness', 'fitness'],
    'finance': ['bank', 'versicherung', 'finanzen', 'investment', 'steuer', 'beratung']
  };

  let detectedIndustry = 'general';
  Object.keys(industries).forEach(industry => {
    if (industries[industry].some(keyword => lowercaseMsg.includes(keyword))) {
      detectedIndustry = industry;
    }
  });

  // FEATURE DETECTION (Erweitert)
  const features = [];
  const featureKeywords = {
    'navigation': ['nav', 'navigation', 'menü', 'menu', 'header'],
    'hero': ['hero', 'banner', 'hauptbereich', 'jumbotron'],
    'gallery': ['galerie', 'bilder', 'fotos', 'gallery', 'images'],
    'contact': ['kontakt', 'contact', 'formular', 'anfrage'],
    'testimonials': ['testimonials', 'bewertungen', 'meinungen', 'reviews'],
    'pricing': ['preise', 'pricing', 'tarife', 'kosten', 'plans'],
    'team': ['team', 'über uns', 'mitarbeiter', 'about'],
    'blog': ['blog', 'news', 'artikel', 'posts'],
    'cart': ['warenkorb', 'cart', 'einkauf', 'shopping'],
    'search': ['suche', 'search', 'filter', 'find'],
    'social': ['social media', 'facebook', 'instagram', 'twitter'],
    'newsletter': ['newsletter', 'signup', 'email', 'subscribe']
  };

  Object.keys(featureKeywords).forEach(feature => {
    if (featureKeywords[feature].some(keyword => lowercaseMsg.includes(keyword))) {
      features.push(feature);
    }
  });

  // STYLE PREFERENCE (Erweitert)
  const styleKeywords = {
    'modern': ['modern', 'contemporary', 'aktuell', 'zeitgemäß', 'fresh'],
    'minimalist': ['minimalist', 'clean', 'schlicht', 'einfach', 'minimal'],
    'luxury': ['luxuriös', 'elegant', 'premium', 'hochwertig', 'exclusive'],
    'corporate': ['corporate', 'business', 'professionell', 'seriös', 'formal'],
    'creative': ['kreativ', 'artistic', 'bunt', 'experimentell', 'unique'],
    'startup': ['startup', 'tech', 'innovativ', 'disruptiv', 'dynamic'],
    'playful': ['playful', 'fun', 'colorful', 'friendly', 'casual']
  };

  let stylePreference = 'modern';
  Object.keys(styleKeywords).forEach(style => {
    if (styleKeywords[style].some(keyword => lowercaseMsg.includes(keyword))) {
      stylePreference = style;
    }
  });

  // COMPLEXITY LEVEL
  const complexityIndicators = features.length + (lowercaseMsg.split(' ').length > 10 ? 2 : 0);
  const complexityLevel = complexityIndicators > 5 ? 'high' : complexityIndicators > 2 ? 'medium' : 'low';

  return {
    websiteType: detectedType,
    industry: detectedIndustry,
    primaryIntent: maxScore > 0 ? detectedType : 'general',
    targetAudience: detectedType === 'ecommerce' ? 'customers' : detectedType === 'corporate' ? 'business' : 'general',
    complexityLevel,
    layoutPreference: detectLayoutPreference(lowercaseMsg),
    stylePreference,
    requiredFeatures: features,
    hasSpecificBranding: detectBranding(lowercaseMsg),
    conversionGoal: detectConversionGoal(lowercaseMsg, detectedType),
    confidence: Math.round(confidence),
    isEnhancement: hasCurrentHTML,
    estimatedPages: estimatePageCount(lowercaseMsg, detectedType),
    urgencyLevel: detectUrgencyLevel(lowercaseMsg),
    technicalRequirements: detectTechnicalRequirements(lowercaseMsg),
    contentStrategy: detectContentStrategy(lowercaseMsg, detectedType)
  };
}

function detectLayoutPreference(message) {
  if (message.includes('zwei spalten') || message.includes('2 column')) return 'two-column';
  if (message.includes('drei spalten') || message.includes('3 column')) return 'three-column';
  if (message.includes('vier spalten') || message.includes('4 column')) return 'four-column';
  if (message.includes('grid') || message.includes('karten') || message.includes('cards')) return 'grid';
  if (message.includes('sidebar') || message.includes('seitenleiste')) return 'sidebar';
  return 'single-column';
}

function detectBranding(message) {
  const brandingKeywords = ['logo', 'brand', 'marke', 'corporate design', 'farben', 'colors', 'branding'];
  return brandingKeywords.some(keyword => message.includes(keyword));
}

function detectConversionGoal(message, type) {
  if (type === 'ecommerce') return 'purchase';
  if (message.includes('anmelden') || message.includes('signup')) return 'signup';
  if (message.includes('kontakt') || message.includes('anfrage')) return 'contact';
  if (message.includes('download') || message.includes('herunterladen')) return 'download';
  if (message.includes('call') || message.includes('anruf')) return 'call';
  return 'engagement';
}

function generateUltimateHints(currentHTML, message, intent) {
  const hints = [];
  
  if (intent.websiteType === 'ecommerce') {
    hints.push('E-Commerce Focus: Warenkorb-Icon, Produktkarten, Preise, Trust-Signale, Zahlungsmethoden');
  }
  
  if (intent.industry === 'food') {
    hints.push('Food Industry: Appetitliche Bilder, Menü-Darstellung, Reservierungs-Option');
  }
  
  if (intent.complexityLevel === 'high') {
    hints.push('High Complexity: Multi-Section Layout, Advanced Features, Professional Design');
  }
  
  if (intent.stylePreference === 'luxury') {
    hints.push('Luxury Style: Premium Colors, Elegant Typography, High-end Feel');
  }
  
  if (!currentHTML.includes('container') || currentHTML.includes('<!-- Hier wird deine Website erstellt -->')) {
    hints.push('Fresh Start: Create complete semantic structure from scratch');
  } else {
    hints.push('Enhancement: Build upon existing structure, improve and extend');
  }
  
  return hints.join(' | ');
}

function getWebsiteTemplate(intent) {
  const templates = {
    ecommerce: `
E-COMMERCE TEMPLATE:
- Header: Logo + Navigation (Home, Produkte, Über uns, Kontakt) + Warenkorb-Icon mit Counter
- Hero: Hauptangebot + "Jetzt shoppen" CTA + Hero-Produktbild
- Produktgrid: 3-4 Spalten Desktop, 1-2 Mobile, Hover-Effekte, Preise hervorgehoben
- Produktkarten: Produktbild-Placeholder, Titel, Preis, "In den Warenkorb" Button
- Trust-Section: Kundenbewertungen, Gütesiegel, Versandgarantie, 4.8/5 Sterne
- Newsletter: E-Mail-Sammlung mit Rabatt-Angebot
- Footer: Zahlungsmethoden (PayPal, Visa, Mastercard), AGB, Datenschutz, Social Media
`,
    landing: `
LANDING PAGE TEMPLATE:
- Hero: Kraftvolle Überschrift + Subtitle + Haupt-CTA + Hero-Image
- Benefits: 3 Hauptvorteile mit Icons in Grid-Layout
- Social Proof: Testimonials mit echten Namen und Fotos
- Features: Detaillierte Feature-Liste mit Icons
- FAQ: 5-6 häufige Fragen und Antworten
- Final CTA: Conversion-optimierter Abschluss mit Urgency
`,
    portfolio: `
PORTFOLIO TEMPLATE:
- Hero: Name + Tagline + "Projekte ansehen" CTA
- About: Kurze Vorstellung + Profilbild + Skills
- Portfolio Grid: Filterable Projekt-Galerie mit Overlay-Effekten
- Services: Was ich anbiete mit Preisen
- Testimonials: Kundenmeinungen mit Namen und Projekten
- Contact: Kontaktformular + Social Links + Verfügbarkeit
`,
    corporate: `
CORPORATE TEMPLATE:
- Hero: Company Value Proposition + "Mehr erfahren" CTA
- Services: Detaillierte Leistungsübersicht
- About: Team, Mission, Vision, Values, Firmengeschichte
- Case Studies: Erfolgsgeschichten mit Zahlen
- Testimonials: Kundenstimmen mit Firmenlogos
- Contact: Multi-Channel Kontaktmöglichkeiten
`
  };
  
  return templates[intent.websiteType] || 'Standard responsive Website-Template mit Header, Main Content, Footer';
}

function ultimateCodeCleaning(code, intent) {
  let cleanCode = code.trim();
  
  // Remove markdown code blocks
  cleanCode = cleanCode.replace(/```html\n?/g, '').replace(/```\n?$/g, '');
  cleanCode = cleanCode.replace(/```\n?/g, '');
  
  // Ensure DOCTYPE
  if (!cleanCode.includes('<!DOCTYPE html>')) {
    if (cleanCode.startsWith('<html')) {
      cleanCode = '<!DOCTYPE html>\n' + cleanCode;
    }
  }

  // Add meta viewport if missing
  if (!cleanCode.includes('viewport')) {
    cleanCode = cleanCode.replace('<head>', '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }

  // Add charset if missing
  if (!cleanCode.includes('charset')) {
    cleanCode = cleanCode.replace('<head>', '<head>\n    <meta charset="UTF-8">');
  }

  // Add SEO meta tags for business websites
  if (intent.websiteType === 'ecommerce' || intent.websiteType === 'corporate') {
    if (!cleanCode.includes('meta name="description"')) {
      const description = intent.websiteType === 'ecommerce' 
        ? 'Professioneller Online-Shop mit sicherer Zahlung und schnellem Versand'
        : 'Professionelle Unternehmenswebsite mit umfassenden Informationen und Services';
      cleanCode = cleanCode.replace('</head>', `    <meta name="description" content="${description}">\n</head>`);
    }
  }

  // Add Open Graph tags for social sharing
  if (intent.websiteType === 'ecommerce' || intent.websiteType === 'landing') {
    if (!cleanCode.includes('og:title')) {
      cleanCode = cleanCode.replace('</head>', 
        '    <meta property="og:title" content="Professionelle Website">\n' +
        '    <meta property="og:description" content="Erstellt mit KI-Website-Builder">\n' +
        '    <meta property="og:type" content="website">\n' +
        '</head>'
      );
    }
  }

  return cleanCode.trim();
}

// NEW HELPER FUNCTIONS

function estimatePageCount(message, type) {
  const pageKeywords = ['seite', 'page', 'unterseite', 'subpage'];
  const multiPageIndicators = ['navigation', 'menü', 'about', 'kontakt', 'impressum'];
  
  let pageCount = 1; // Default single page
  
  if (type === 'corporate') pageCount = 5; // Home, About, Services, Team, Contact
  else if (type === 'ecommerce') pageCount = 4; // Home, Products, Cart, Checkout
  else if (type === 'portfolio') pageCount = 3; // Home, Portfolio, Contact
  
  // Check for explicit page mentions
  pageKeywords.forEach(keyword => {
    if (message.includes(keyword)) pageCount += 1;
  });
  
  return Math.min(pageCount, 8); // Cap at 8 pages
}

function detectUrgencyLevel(message) {
  const urgencyKeywords = {
    high: ['sofort', 'dringend', 'schnell', 'asap', 'urgent', 'heute', 'morgen'],
    medium: ['bald', 'zeitnah', 'diese woche', 'soon'],
    low: ['irgendwann', 'später', 'eventually', 'when possible']
  };
  
  if (urgencyKeywords.high.some(keyword => message.includes(keyword))) return 'high';
  if (urgencyKeywords.medium.some(keyword => message.includes(keyword))) return 'medium';
  return 'low';
}

function detectTechnicalRequirements(message) {
  const requirements = [];
  
  const techKeywords = {
    'responsive': ['mobile', 'tablet', 'responsive', 'device'],
    'seo': ['seo', 'google', 'search', 'ranking', 'optimization'],
    'analytics': ['analytics', 'tracking', 'statistics', 'metrics'],
    'forms': ['formular', 'contact', 'newsletter', 'signup'],
    'animations': ['animation', 'hover', 'transition', 'interactive'],
    'accessibility': ['accessibility', 'a11y', 'screen reader', 'barrier-free']
  };
  
  Object.keys(techKeywords).forEach(tech => {
    if (techKeywords[tech].some(keyword => message.includes(keyword))) {
      requirements.push(tech);
    }
  });
  
  return requirements;
}

function detectContentStrategy(message, type) {
  const strategies = {
    ecommerce: 'product-focused',
    landing: 'conversion-focused',
    portfolio: 'showcase-focused',
    corporate: 'trust-focused',
    blog: 'content-focused'
  };
  
  return strategies[type] || 'general';
}

function initializePerformanceMetrics(startTime) {
  return {
    startTime: startTime,
    targetScore: 95, // Target quality score
    actualScore: 0,
    processingTime: 0
  };
}

function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function makeOpenAIRequestWithRetry(requestData, maxRetries = 3) {
  return new Promise(async (resolve) => {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return resolve({
          success: true,
          data: data,
          retryCount: attempt - 1
        });
        
      } catch (error) {
        lastError = error;
        console.warn(`OpenAI API attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Exponential backoff: wait 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        }
      }
    }
    
    return resolve({
      success: false,
      error: lastError?.message || 'Max retries exceeded',
      retryCount: maxRetries
    });
  });
}

function enhanceCodeQuality(code, intent) {
  // Add performance optimizations
  if (!code.includes('loading="lazy"')) {
    code = code.replace(/<img /g, '<img loading="lazy" ');
  }
  
  // Add missing alt attributes
  code = code.replace(/<img([^>]*?)(?!alt=)([^>]*?)>/g, '<img$1 alt="Produktbild"$2>');
  
  // Ensure proper semantic HTML
  if (!code.includes('<main>')) {
    code = code.replace(/<body([^>]*)>/, '<body$1>\n<main>');
    code = code.replace(/<\/body>/, '</main>\n</body>');
  }
  
  return code;
}

function calculateQualityScore(code, intent) {
  let score = 60; // Base score
  
  // Check for responsive design
  if (code.includes('@media')) score += 10;
  if (code.includes('viewport')) score += 5;
  
  // Check for semantic HTML
  if (code.includes('<main>')) score += 5;
  if (code.includes('<header>')) score += 5;
  if (code.includes('<nav>')) score += 5;
  
  // Check for accessibility
  if (code.includes('alt=')) score += 5;
  if (code.includes('aria-')) score += 5;
  
  // Check for performance
  if (code.includes('loading="lazy"')) score += 5;
  
  return Math.min(score, 100);
}

function estimateLoadTime(code) {
  const sizeKB = new Blob([code]).size / 1024;
  // Rough estimate: 1KB = ~10ms load time
  return Math.round(sizeKB * 10);
}

function generateNextSteps(intent, code) {
  const steps = [];
  
  if (intent.websiteType === 'ecommerce') {
    steps.push('Füge echte Produktbilder hinzu');
    steps.push('Implementiere Zahlungsintegration');
    steps.push('Erstelle Produktdetailseiten');
  } else if (intent.websiteType === 'landing') {
    steps.push('A/B-teste verschiedene Headlines');
    steps.push('Füge Lead-Tracking hinzu');
    steps.push('Optimiere Conversion-Rate');
  }
  
  steps.push('Teste auf verschiedenen Geräten');
  steps.push('Optimiere für Suchmaschinen');
  
  return steps;
}

function generateIntelligentSuggestions(intent, code) {
  const suggestions = {
    ecommerce: [
      'Füge Produktbewertungen und Sterne hinzu',
      'Erstelle eine Checkout-Seite mit Formular',
      'Implementiere Produktfilter und Suche',
      'Füge einen Newsletter-Bereich mit Rabatt hinzu',
      'Erstelle eine Wishlist-Funktion',
      'Füge Produktvergleich hinzu'
    ],
    landing: [
      'Optimiere die Call-to-Action Buttons',
      'Füge mehr Testimonials mit Fotos hinzu',
      'Erstelle eine Thank-You Page',
      'Implementiere A/B-Test Varianten',
      'Füge Urgency-Elemente hinzu (Timer, limitierte Angebote)',
      'Erstelle eine FAQ-Sektion'
    ],
    portfolio: [
      'Füge mehr Projekte mit Case Studies hinzu',
      'Erstelle detaillierte Projektbeschreibungen',
      'Implementiere ein Kontaktformular mit Verfügbarkeit',
      'Füge einen Blog-Bereich hinzu',
      'Erstelle eine Services-Preisliste',
      'Implementiere Projekt-Filter nach Kategorien'
    ],
    corporate: [
      'Füge ein Team-Bereich mit Mitarbeiterfotos hinzu',
      'Erstelle eine Karriere-Seite',
      'Implementiere Case Studies mit Zahlen',
      'Füge ein News/Blog-Bereich hinzu',
      'Erstelle eine Standorte-Übersicht',
      'Implementiere Unternehmens-Timeline'
    ]
  };

  const defaultSuggestions = [
    'Verbessere die mobile Ansicht',
    'Füge mehr interaktive Elemente hinzu',
    'Optimiere die Ladegeschwindigkeit',
    'Implementiere SEO-Optimierungen',
    'Füge Animationen und Hover-Effekte hinzu',
    'Erstelle zusätzliche Unterseiten'
  ];

  return suggestions[intent.websiteType] || defaultSuggestions;
}
