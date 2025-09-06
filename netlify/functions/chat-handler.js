exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, currentHTML = '' } = JSON.parse(event.body);

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API Key nicht konfiguriert'
        })
      };
    }

    // ULTIMATE INTENT ANALYSIS
    const userIntent = ultimateIntentAnalysis(message);
    const contextualHints = generateUltimateHints(currentHTML, message, userIntent);
    const templateSystem = getWebsiteTemplate(userIntent);
    
    const systemPrompt = `Du bist ein EXPERT-LEVEL Website-Generator wie lovable.dev oder v0.dev. Du generierst PRODUCTION-READY, hochkonvertierende Websites mit modernen UI-Components und Business-Logic.

=== AKTUELLE WEBSITE ===
${currentHTML || 'Leeres Canvas - bereit für PROFESSIONELLE Website'}

=== USER REQUEST ANALYSIS ===
Original: "${message}"
Website Type: ${userIntent.websiteType}
Industry: ${userIntent.industry}
Complexity: ${userIntent.complexityLevel}

=== LOVABLE.DEV-LEVEL STANDARDS ===

Du bist NICHT ein einfacher HTML-Generator! Du bist ein BUSINESS-WEBSITE-EXPERTE der CONVERSION-OPTIMIERTE, PROFESSIONELLE Websites erstellt.

ECOMMERCE WEBSITES MÜSSEN HABEN:
🛒 WARENKORB-ICON in Navigation mit Counter
💳 PRODUKTKARTEN mit echten Produkt-Layouts
💰 PREISE prominent hervorgehoben  
🔘 "IN DEN WARENKORB" Buttons (grün/blau)
⭐ BEWERTUNGEN/Sterne bei Produkten
🏆 TRUST-SIGNALE (Gütesiegel, Garantien)
📱 RESPONSIVE Product Grid (3-4 Spalten Desktop, 1-2 Mobile)
🎨 MODERNE UI mit Hover-Effekte und Animations
💼 PROFESSIONELLER Footer mit Zahlungsmethoden

LANDING PAGES MÜSSEN HABEN:
🎯 HERO Section mit großem CTA
✨ BENEFITS Section (3-Spalten Icons + Text)
💬 TESTIMONIALS mit Fotos und Namen
❓ FAQ Section
📧 EMAIL-SIGNUP mit Lead-Magnet
📱 MOBILE-OPTIMIZED überall

=== TECHNICAL EXCELLENCE ===

CSS REQUIREMENTS:
- CSS Grid für Produktlayouts
- Flexbox für Navigation
- CSS Variables für Farbsystem
- Smooth Animations (transition: all 0.3s ease)
- Hover-Effekte auf allen Buttons
- Box-shadows für Tiefe
- Responsive Breakpoints (768px, 1024px)

COMPONENT PATTERNS:
- Card Components mit border-radius: 12px
- Button Styles mit gradient/solid + hover
- Navigation mit Logo links, Links mitte, CTA rechts
- Footer mit 3-4 Spalten
- Hero mit 50/50 Split (Text + Image)

COLOR SYSTEMS:
- Primary: #3b82f6 (blau)
- Success: #10b981 (grün für "Kaufen")
- Warning: #f59e0b (orange für "Warenkorb")
- Text: #1f2937 (dunkelgrau)
- Background: #ffffff
- Border: #e5e7eb

=== BUSINESS-SPECIFIC TEMPLATES ===

WENN ECOMMERCE/SHOP erkannt:
GENERIERE SOFORT vollständige E-Commerce Website mit:
- Header mit Logo + Navigation + Warenkorb-Icon (mit Counter)
- Hero-Section mit Hauptangebot und "Jetzt shoppen" CTA
- Produktgrid mit mindestens 6 Produktkarten
- Jede Produktkarte hat: Produktbild-Placeholder, Titel, Preis, "In den Warenkorb" Button
- Trust-Section mit Versand, Garantie, Bewertungen
- Footer mit Zahlungsmethoden (PayPal, Visa, etc.)

WENN LANDING PAGE erkannt:
- Hero mit Headline + Subtitle + Haupt-CTA
- Benefits-Section (3 Spalten mit Icons)
- Testimonials mit Namen und Fotos
- FAQ-Section (5-6 Fragen)
- Final CTA + Email-Signup

WENN PORTFOLIO erkannt:
- Hero mit Name + Tagline
- About-Section mit Profilbild
- Portfolio-Grid mit Projekt-Karten
- Services-Übersicht
- Kontakt-Section

=== CSS FRAMEWORK STANDARDS ===

Verwende IMMER dieses CSS-Framework:

:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --success: #10b981;
  --success-dark: #059669;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text: #1f2937;
  --text-light: #6b7280;
  --background: #ffffff;
  --surface: #f9fafb;
  --border: #e5e7eb;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --radius-lg: 12px;
  --spacing: 1rem;
  --spacing-lg: 2rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: var(--background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-success {
  background: var(--success);
  color: white;
}

.btn-success:hover {
  background: var(--success-dark);
  transform: translateY(-2px);
}

.card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.grid {
  display: grid;
  gap: var(--spacing-lg);
}

.grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

@media (max-width: 768px) {
  .container { padding: 0 var(--spacing); }
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}

=== NATURAL LANGUAGE PROCESSING ===

VERSTEHE DEUTSCHE ANWEISUNGEN PERFEKT:

POSITION MAPPING:
- "oben links|links oben" → position: absolute; top: 20px; left: 20px;
- "oben rechts|rechts oben" → position: absolute; top: 20px; right: 20px;
- "mittig|zentral|center|mitte" → display: flex; justify-content: center; align-items: center; min-height: 70vh;
- "header|navigation|nav|kopf" → Sticky Header mit Navigation
- "footer|fußbereich|unten" → Footer mit Links und Infos

BUSINESS KEYWORDS:
- "shop|verkauf|kaufen|bestellen" → E-Commerce Website mit Produktkarten
- "landing|marketing|conversion" → Landing Page mit CTAs
- "portfolio|showcase|galerie" → Portfolio mit Projektgrid
- "blog|news|artikel" → Blog-Layout mit Artikeln
- "restaurant|menü|essen" → Restaurant-Website mit Speisekarte
- "firma|unternehmen|corporate" → Corporate Website

LAYOUT KEYWORDS:
- "karten|cards" → Card-basiertes Layout
- "grid|raster" → CSS Grid Layout
- "spalten|columns" → Multi-Column Layout
- "nebeneinander|horizontal" → Flex Row Layout
- "untereinander|vertical" → Flex Column Layout

=== OUTPUT REQUIREMENTS ===

1. Generiere IMMER vollständige, funktionale Business-Websites
2. NIEMALS einfache HTML-Seiten ohne Business-Logic
3. IMMER moderne UI Components
4. IMMER responsive Design (Mobile-First)
5. IMMER Business-optimiert mit CTAs
6. IMMER mit echten Features (Navigation, Buttons, etc.)
7. IMMER SEO-optimiert mit Meta-Tags
8. IMMER Accessibility-konform
9. IMMER Performance-optimiert
10. IMMER mit Hover-Effekten und Animationen

=== QUALITY CHECKLIST ===

Jede Website MUSS haben:
✓ Sticky Navigation mit Logo und Links
✓ Hero-Section mit klarem Value Proposition
✓ Minimum 3 Content-Sections
✓ Call-to-Action Buttons
✓ Footer mit relevanten Links
✓ Responsive Design (320px - 1920px)
✓ Hover-Effekte auf interaktiven Elementen
✓ Professionelle Typografie und Spacing
✓ Konsistente Farb- und Design-Sprache
✓ Loading-Optimiert und Performance-ready

Für E-COMMERCE zusätzlich:
✓ Warenkorb-Icon in Navigation
✓ Produktkarten mit Bildern, Preisen, Buttons
✓ "In den Warenkorb" Buttons
✓ Trust-Signale (Versand, Garantie, Bewertungen)
✓ Zahlungsmethoden im Footer

Generiere JETZT eine lovable.dev-Level Website basierend auf der Benutzeranfrage:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: `OpenAI API Fehler: ${errorData.error?.message || 'Unbekannter Fehler'}`
        })
      };
    }

    const data = await response.json();
    let generatedCode = data.choices[0].message.content.trim();

    // ULTIMATE CODE CLEANING
    generatedCode = ultimateCodeCleaning(generatedCode, userIntent);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: generatedCode,
        message: 'Lovable.dev-Level Website erfolgreich generiert!',
        intent: userIntent,
        suggestions: generateIntelligentSuggestions(userIntent),
        metrics: {
          processingTime: Date.now(),
          complexity: userIntent.complexityLevel,
          features: userIntent.requiredFeatures.length
        }
      })
    };

  } catch (error) {
    console.error('Ultimate Chat Handler Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Fehler beim Verarbeiten der Anfrage',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

// ========== ULTIMATE HELPER FUNCTIONS ==========

function ultimateIntentAnalysis(message) {
  const lowercaseMsg = message.toLowerCase();
  
  // WEBSITE TYPE DETECTION (Erweitert)
  const websiteTypes = {
    'ecommerce': ['shop', 'verkauf', 'kaufen', 'bestellen', 'warenkorb', 'produkt', 'preis', 'bezahlen', 'kasse', 'store', 'online shop', 'verkaufen', 'commerce'],
    'landing': ['landing', 'marketing', 'conversion', 'anmelden', 'download', 'signup', 'trial', 'lead', 'campaign'],
    'portfolio': ['portfolio', 'showcase', 'galerie', 'projekt', 'work', 'arbeiten', 'designer', 'künstler', 'fotograf'],
    'corporate': ['unternehmen', 'firma', 'business', 'corporate', 'about', 'team', 'services', 'company'],
    'blog': ['blog', 'news', 'artikel', 'content', 'nachrichten', 'magazin', 'journal'],
    'restaurant': ['restaurant', 'menü', 'essen', 'reservierung', 'gastronomie', 'küche', 'café', 'bar'],
    'saas': ['software', 'app', 'platform', 'api', 'dashboard', 'tool', 'saas', 'service'],
    'personal': ['personal', 'cv', 'lebenslauf', 'über mich', 'persönlich', 'profil']
  };

  let detectedType = 'general';
  let maxMatches = 0;
  
  Object.keys(websiteTypes).forEach(type => {
    const matches = websiteTypes[type].filter(keyword => lowercaseMsg.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedType = type;
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
    primaryIntent: maxMatches > 0 ? detectedType : 'general',
    targetAudience: detectedType === 'ecommerce' ? 'customers' : detectedType === 'corporate' ? 'business' : 'general',
    complexityLevel,
    layoutPreference: detectLayoutPreference(lowercaseMsg),
    stylePreference,
    requiredFeatures: features,
    hasSpecificBranding: detectBranding(lowercaseMsg),
    conversionGoal: detectConversionGoal(lowercaseMsg, detectedType)
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

function generateIntelligentSuggestions(intent) {
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
