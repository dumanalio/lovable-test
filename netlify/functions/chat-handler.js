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
    
    const systemPrompt = `Du bist der weltweit fortschrittlichste Website-Generator, entwickelt für Enterprise-Level Websites. Du verstehst jede natürliche Sprache perfekt und generierst produktionsreife, hochkonvertierende Websites.

=== AKTUELLER WEBSITE-KONTEXT ===
${currentHTML || 'Leeres Canvas - bereit für neue Website'}

=== DETAILLIERTE BENUTZER-ANALYSE ===
Nachricht: "${message}"
Erkannter Typ: ${userIntent.websiteType}
Hauptabsicht: ${userIntent.primaryIntent}
Branche: ${userIntent.industry}
Zielgruppe: ${userIntent.targetAudience}
Komplexität: ${userIntent.complexityLevel}
Layout-Wunsch: ${userIntent.layoutPreference}
Stil-Präferenz: ${userIntent.stylePreference}
Funktionen: ${userIntent.requiredFeatures.join(', ')}

=== CONTEXTUAL HINTS ===
${contextualHints}

=== WEBSITE-TEMPLATE ===
${templateSystem}

=== ULTIMATE CODING STANDARDS ===

1. ARCHITEKTUR & STRUKTUR:
   - Vollständiges HTML5 mit semantischen Elementen
   - Progressive Web App Ready (PWA)
   - SEO-optimiert mit Meta-Tags und Schema.org
   - Accessibility WCAG 2.1 AAA Standard
   - Performance-optimiert (Core Web Vitals)

2. RESPONSIVE DESIGN SYSTEM:
   - Mobile-First: 320px → 768px → 1024px → 1440px → 1920px
   - Fluid Typography: clamp(1rem, 2.5vw, 1.5rem)
   - Container Queries für moderne Browser
   - Touch-optimiert (min 44px tap targets)
   - Retina-ready Images

3. CSS METHODOLOGY:
   - BEM-ähnliche Klassen-Struktur
   - CSS Custom Properties (Variables)
   - Modern CSS Grid & Flexbox
   - Container Queries
   - CSS Animations mit @media (prefers-reduced-motion)
   - 8px-Grid System

4. PERFORMANCE & SEO:
   - Critical CSS inline
   - Lazy Loading für Bilder
   - Optimierte Font Loading
   - Meta Tags für Social Media
   - JSON-LD Structured Data
   - Open Graph & Twitter Cards

=== BRANCHEN-SPEZIFISCHE TEMPLATES ===

E-COMMERCE (Shop/Verkauf):
- Header: Logo + Navigation + Warenkorb-Icon mit Counter
- Hero: Hauptangebot mit "Jetzt kaufen" CTA
- Produktgrid: 3-4 Spalten, Hover-Effekte, Preise, Bewertungen
- Trust-Signale: Testimonials, Gütesiegel, Garantien
- Footer: Zahlungsmethoden, Kontakt, AGB
- Conversion-Optimierung: Urgency, Social Proof, Clear CTAs

LANDING PAGE (Marketing/Conversion):
- Hero: Überschrift + Subtitle + CTA + Hero Image
- Features: 3-Spalten mit Icons und Benefits
- Social Proof: Testimonials, Logos, Zahlen
- FAQ: Häufige Einwände behandeln
- Final CTA: Conversion-optimiert

PORTFOLIO (Kreativ/Freelancer):
- Hero: Name + Tagline + Kontakt-CTA
- About: Kurze Vorstellung mit Foto
- Portfolio Grid: Filterable Projekt-Galerie
- Services: Was ich anbiete
- Kontakt: Formular + Social Links

CORPORATE (Unternehmen/B2B):
- Header: Logo + Professional Navigation
- Hero: Company Value Proposition
- Services: Detaillierte Leistungsübersicht
- About: Team, Mission, Vision, Values
- Case Studies: Erfolgsgeschichten
- Contact: Multi-Channel Kontaktmöglichkeiten

SaaS/TECH (Software/Startup):
- Hero: Problem → Lösung mit Demo/Trial CTA
- Features: Benefit-orientierte Feature-Liste
- Pricing: Transparente Preistabelle
- Social Proof: Customer Logos + Testimonials
- API/Integration: Technische Details

RESTAURANT/FOOD (Gastronomie):
- Hero: Appetitliches Hauptbild + Reservierung
- Menü: Kategorisierte Speisekarte mit Preisen
- About: Küchenphilosophie + Chefkoch
- Location: Karte + Öffnungszeiten
- Reservierung: Booking-Widget

=== NATURAL LANGUAGE PROCESSING ===

POSITION MAPPING (Deutsch):
- "oben links|links oben|top left" → position: absolute; top: 20px; left: 20px;
- "oben rechts|rechts oben|top right" → position: absolute; top: 20px; right: 20px;
- "mittig|zentral|center|mitte" → display: flex; justify-content: center; align-items: center; min-height: 70vh;
- "header|navigation|nav|kopf" → <header> element with full-width sticky navigation
- "footer|fußbereich|unten" → <footer> with company info and links
- "sidebar|seitenleiste" → Grid layout with sidebar (300px + 1fr)

LAYOUT PATTERNS:
- "nebeneinander|side by side|horizontal" → display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
- "drei spalten|3 columns|three columns" → grid-template-columns: repeat(3, 1fr);
- "hero section|banner|jumbotron" → Full-width hero with background image/gradient
- "karten layout|cards|grid" → CSS Grid with card components
- "masonry|pinterest style" → CSS Grid masonry layout

BUSINESS COMPONENTS:
- "online shop|e-commerce|verkauf" → Full e-commerce layout with cart functionality
- "landing page|marketing|conversion" → High-converting landing page structure
- "portfolio|showcase|galerie" → Portfolio grid with lightbox effect
- "blog|news|artikel" → Blog layout with sidebar and pagination
- "kontakt|contact|impressum" → Contact page with form and company details
- "preise|pricing|tarife" → Pricing table with feature comparison
- "über uns|about|team" → About page with team section and company story

STYLING INSTRUCTIONS:
- "modern|contemporary|aktuell" → Clean design, subtle shadows, modern fonts
- "minimalist|clean|schlicht" → Lots of whitespace, simple typography, monochrome
- "luxuriös|elegant|premium" → High contrast, serif fonts, gold accents
- "startup|tech|innovativ" → Bold gradients, sans-serif, vibrant colors
- "corporate|business|seriös" → Conservative colors, professional fonts
- "kreativ|artistic|bunt" → Vibrant colors, creative layouts, experimental design

COLOR PSYCHOLOGY:
- "vertrauen|trust|seriös" → Blau-Palette (#1e40af, #3b82f6, #60a5fa)
- "erfolg|growth|geld" → Grün-Palette (#166534, #16a34a, #4ade80)
- "energie|action|dringend" → Rot/Orange-Palette (#dc2626, #ea580c, #f97316)
- "kreativität|innovation" → Lila-Palette (#7c3aed, #a855f7, #c084fc)
- "premium|luxury|hochwertig" → Schwarz/Gold-Palette (#000000, #374151, #fbbf24)

CONVERSION OPTIMIZATION:
- "kaufen|buy|bestellen" → Prominente CTAs, Urgency, Social Proof
- "anmelden|signup|registrieren" → Lead-Generation fokussiert
- "kontakt|contact|anfrage" → Kontakt-optimierte Navigation und CTAs
- "download|herunterladen" → Download-CTAs mit Benefits

=== TECHNICAL REQUIREMENTS ===

RESPONSIVE BREAKPOINTS:
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
TYPOGRAPHY SCALE:

h1: clamp(2rem, 5vw, 3.5rem)
h2: clamp(1.5rem, 4vw, 2.5rem)
h3: clamp(1.25rem, 3vw, 2rem)
body: clamp(1rem, 2.5vw, 1.125rem)

COLOR SYSTEM:

Primary: CSS Custom Property based
Secondary: Complementary to primary
Neutral: Gray scale for text/backgrounds
Success: Green variants
Warning: Orange variants
Error: Red variants

SPACING SYSTEM (8px base):

xs: 0.5rem (8px)
sm: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
2xl: 4rem (64px)

=== OUTPUT REQUIREMENTS ===

Generiere NUR vollständigen, validen HTML5-Code
Inline CSS im <style> Tag im <head>
Semantic HTML mit ARIA-Labels
Meta-Tags für SEO und Social Media
Responsive Design für alle Geräte
Smooth Animations und Hover-Effekte
Loading States und Error Handling
Cross-Browser Kompatibilität
Performance-optimiert
Accessibility-konform

=== QUALITY CHECKLIST ===
✓ Mobile-responsive (320px - 1920px)
✓ Fast loading (< 3s)
✓ SEO-optimized
✓ Accessible (WCAG 2.1)
✓ Cross-browser compatible
✓ Professional design
✓ Clear navigation
✓ Effective CTAs
✓ Trust signals included
✓ Contact information present
Generiere jetzt eine professionelle, produktionsreife Website basierend auf der Benutzeranfrage:`;
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
    message: 'Enterprise-Level Website erfolgreich generiert!',
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
// WEBSITE TYPE DETECTION
const websiteTypes = {
'ecommerce': ['shop', 'verkauf', 'kaufen', 'bestellen', 'warenkorb', 'produkt', 'preis', 'bezahlen', 'kasse'],
'landing': ['landing', 'marketing', 'conversion', 'anmelden', 'download', 'signup', 'trial'],
'portfolio': ['portfolio', 'showcase', 'galerie', 'projekt', 'work', 'arbeiten', 'designer'],
'corporate': ['unternehmen', 'firma', 'business', 'corporate', 'about', 'team', 'services'],
'blog': ['blog', 'news', 'artikel', 'content', 'nachrichten', 'magazin'],
'restaurant': ['restaurant', 'menü', 'essen', 'reservierung', 'gastronomie', 'küche'],
'saas': ['software', 'app', 'platform', 'api', 'dashboard', 'tool', 'saas'],
'personal': ['personal', 'cv', 'lebenslauf', 'über mich', 'persönlich']
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
// INDUSTRY DETECTION
const industries = {
'food': ['restaurant', 'café', 'bäckerei', 'essen', 'küche', 'menü', 'cookies', 'keks'],
'tech': ['software', 'app', 'tech', 'startup', 'saas', 'platform', 'code'],
'creative': ['design', 'kunst', 'kreativ', 'fotograf', 'designer', 'agentur'],
'retail': ['mode', 'kleidung', 'schmuck', 'beauty', 'lifestyle', 'produkt'],
'service': ['beratung', 'service', 'dienstleistung', 'consulting', 'agentur'],
'education': ['schule', 'kurs', 'lernen', 'training', 'education', 'akademie'],
'healthcare': ['gesundheit', 'medizin', 'praxis', 'therapie', 'wellness'],
'finance': ['bank', 'versicherung', 'finanzen', 'investment', 'steuer']
};
let detectedIndustry = 'general';
Object.keys(industries).forEach(industry => {
if (industries[industry].some(keyword => lowercaseMsg.includes(keyword))) {
detectedIndustry = industry;
}
});
// FEATURE DETECTION
const features = [];
const featureKeywords = {
'navigation': ['nav', 'navigation', 'menü', 'menu'],
'hero': ['hero', 'banner', 'hauptbereich', 'jumbotron'],
'gallery': ['galerie', 'bilder', 'fotos', 'gallery'],
'contact': ['kontakt', 'contact', 'formular', 'anfrage'],
'testimonials': ['testimonials', 'bewertungen', 'meinungen'],
'pricing': ['preise', 'pricing', 'tarife', 'kosten'],
'team': ['team', 'über uns', 'mitarbeiter'],
'blog': ['blog', 'news', 'artikel'],
'cart': ['warenkorb', 'cart', 'einkauf'],
'search': ['suche', 'search', 'filter'],
'social': ['social media', 'facebook', 'instagram', 'twitter']
};
Object.keys(featureKeywords).forEach(feature => {
if (featureKeywords[feature].some(keyword => lowercaseMsg.includes(keyword))) {
features.push(feature);
}
});
// STYLE PREFERENCE
const styleKeywords = {
'modern': ['modern', 'contemporary', 'aktuell', 'zeitgemäß'],
'minimalist': ['minimalist', 'clean', 'schlicht', 'einfach'],
'luxury': ['luxuriös', 'elegant', 'premium', 'hochwertig'],
'corporate': ['corporate', 'business', 'professionell', 'seriös'],
'creative': ['kreativ', 'artistic', 'bunt', 'experimentell'],
'startup': ['startup', 'tech', 'innovativ', 'disruptiv']
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
if (message.includes('grid') || message.includes('karten')) return 'grid';
if (message.includes('sidebar')) return 'sidebar';
return 'single-column';
}
function detectBranding(message) {
const brandingKeywords = ['logo', 'brand', 'marke', 'corporate design', 'farben', 'colors'];
return brandingKeywords.some(keyword => message.includes(keyword));
}
function detectConversionGoal(message, type) {
if (type === 'ecommerce') return 'purchase';
if (message.includes('anmelden') || message.includes('signup')) return 'signup';
if (message.includes('kontakt') || message.includes('anfrage')) return 'contact';
if (message.includes('download')) return 'download';
return 'engagement';
}
function generateUltimateHints(currentHTML, message, intent) {
const hints = [];
if (intent.websiteType === 'ecommerce') {
hints.push('E-Commerce Focus: Conversion-optimierte CTAs, Trust-Signale, Social Proof');
}
if (intent.industry === 'food') {
hints.push('Food Industry: Appetitliche Bilder, Menü-Darstellung, Reservierungs-Option');
}
if (intent.complexityLevel === 'high') {
hints.push('High Complexity: Multi-Section Layout, Advanced Features, Professional Design');
}
if (!currentHTML.includes('container')) {
hints.push('Fresh Start: Create complete semantic structure from scratch');
}
return hints.join(' | ');
}
function getWebsiteTemplate(intent) {
const templates = {
ecommerce: `
E-COMMERCE TEMPLATE:

Header: Logo + Navigation (Home, Produkte, Über uns, Kontakt) + Warenkorb-Icon
Hero: Hauptangebot + "Jetzt shoppen" CTA + Hero-Produktbild
Produktgrid: 3-4 Spalten, Hover-Effekte, Preise hervorgehoben, "In den Warenkorb" Buttons
Trust-Section: Kundenbewertungen, Gütesiegel, Versandgarantie
Newsletter: E-Mail-Sammlung mit Rabatt-Angebot
Footer: Zahlungsmethoden, AGB, Datenschutz, Social Media
,   landing: 
LANDING PAGE TEMPLATE:
Hero: Überschrift + Subtitle + Haupt-CTA + Hero-Image
Benefits: 3 Hauptvorteile mit Icons in Grid-Layout
Social Proof: Testimonials oder Customer Logos
Features: Detaillierte Feature-Liste
FAQ: 5-6 häufige Fragen
Final CTA: Conversion-optimierter Abschluss
,   portfolio: 
PORTFOLIO TEMPLATE:
Hero: Name + Tagline + "Projekte ansehen" CTA
About: Kurze Vorstellung + Profilbild
Portfolio Grid: Filterable Projekt-Galerie mit Overlay
Services: Was ich anbiete
Testimonials: Kundenmeinungen
Contact: Kontaktformular + Social Links
`
};
return templates[intent.websiteType] || 'Standard responsive Website-Template';
}

function ultimateCodeCleaning(code, intent) {
let cleanCode = code.trim();
// Remove markdown
cleanCode = cleanCode.replace(/html\n?/g, '').replace(/\n?$/g, '');
cleanCode = cleanCode.replace(/```\n?/g, '');
// Ensure DOCTYPE
if (!cleanCode.includes('<!DOCTYPE html>')) {
cleanCode = '<!DOCTYPE html>\n' + cleanCode;
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
cleanCode = cleanCode.replace('</head>', '    <meta name="description" content="Professionelle Website erstellt mit KI">\n</head>');
}
}
return cleanCode.trim();
}
function generateIntelligentSuggestions(intent) {
const suggestions = {
ecommerce: [
'Füge Produktbewertungen hinzu',
'Erstelle eine Checkout-Seite',
'Implementiere Produktfilter',
'Füge einen Newsletter-Bereich hinzu'
],
landing: [
'Optimiere die Call-to-Action Buttons',
'Füge mehr Testimonials hinzu',
'Erstelle eine Thank-You Page',
'Implementiere A/B-Test Varianten'
],
portfolio: [
'Füge mehr Projekte hinzu',
'Erstelle Case Studies',
'Implementiere Kontaktformular',
'Füge einen Blog-Bereich hinzu'
]
};
return suggestions[intent.websiteType] || [
'Verbessere die mobile Ansicht',
'Füge mehr Inhalte hinzu',
'Optimiere die Ladegeschwindigkeit',
'Implementiere SEO-Optimierungen'
];
}
