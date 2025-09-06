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

    // Enterprise-Level Intent Analysis
    const userIntent = analyzeUserIntent(message);
    const contextualHints = generateContextualHints(currentHTML, message);
    
    const systemPrompt = `Du bist ein Elite-Level Web-Development-Assistent, der für moderne Unternehmen entwickelt wurde. Du verstehst natürliche Sprache perfekt und generierst professionelle, produktionsreife Websites.

=== CURRENT WEBSITE CONTEXT ===
${currentHTML || 'Leeres Canvas - bereit für neue Website'}

=== USER REQUEST ANALYSIS ===
Original Message: "${message}"
Intent Classification: ${userIntent.category}
Detected Elements: ${userIntent.elements.join(', ')}
Layout Requirements: ${userIntent.layout}
Styling Preferences: ${userIntent.styling}

=== CONTEXTUAL HINTS ===
${contextualHints}

=== ENTERPRISE CODING STANDARDS ===

1. ARCHITECTURE & STRUCTURE:
   - Generate complete, valid HTML5 documents with proper DOCTYPE
   - Use semantic HTML5 elements (header, nav, main, section, article, aside, footer)
   - Implement responsive design patterns with mobile-first approach
   - Follow accessibility guidelines (WCAG 2.1)

2. CSS METHODOLOGY:
   - Use modern CSS Grid and Flexbox for layouts
   - Implement CSS custom properties (variables) for maintainability
   - Apply consistent spacing scale (8px base unit: 8, 16, 24, 32, 48, 64px)
   - Use professional color palettes and typography scales

3. RESPONSIVE DESIGN:
   - Mobile-first breakpoints: 320px, 768px, 1024px, 1440px
   - Fluid typography using clamp() functions
   - Optimized images with responsive srcset
   - Touch-friendly interactive elements (min 44px)

4. PROFESSIONAL STYLING:
   - Modern shadow systems: 0 1px 3px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)
   - Smooth transitions and micro-animations
   - Professional color schemes (avoid bright/neon colors unless requested)
   - Consistent border-radius (4px, 8px, 12px, 16px)

=== NATURAL LANGUAGE UNDERSTANDING ===

POSITION MAPPING:
- "oben links|links oben|top left" → position: absolute; top: 20px; left: 20px;
- "oben rechts|rechts oben|top right" → position: absolute; top: 20px; right: 20px;
- "unten links|links unten|bottom left" → position: absolute; bottom: 20px; left: 20px;
- "unten rechts|rechts unten|bottom right" → position: absolute; bottom: 20px; right: 20px;
- "mittig|zentral|center|mitte" → display: flex; justify-content: center; align-items: center;
- "header|kopfbereich|navigation" → <header> with full width top positioning
- "footer|fußbereich|bottom" → <footer> with full width bottom positioning

LAYOUT PATTERNS:
- "nebeneinander|side by side|horizontal" → display: grid; grid-template-columns: 1fr 1fr;
- "untereinander|übereinander|vertical" → display: grid; grid-template-rows: auto auto;
- "zwei spalten|2 columns" → grid-template-columns: 1fr 1fr;
- "drei spalten|3 columns" → grid-template-columns: repeat(3, 1fr);
- "vier spalten|4 columns" → grid-template-columns: repeat(4, 1fr);
- "sidebar layout" → grid-template-columns: 300px 1fr;

CONTENT ELEMENTS:
- "navigation|nav|menu" → <nav> with proper list structure
- "hero section|jumbotron|banner" → Large promotional section with CTA
- "karten|cards" → CSS Grid card layout with shadows
- "button|cta|call to action" → Professional button with hover states
- "formular|form|contact" → Accessible form with proper labels
- "galerie|gallery|bilder" → CSS Grid image gallery
- "testimonials|bewertungen" → Customer testimonial section
- "pricing|preise|tarife" → Pricing table with feature comparison

STYLING INSTRUCTIONS:
- "modern|contemporary" → Clean lines, whitespace, subtle shadows
- "minimalist|clean" → Lots of whitespace, simple typography
- "corporate|business|professional" → Conservative colors, serif fonts
- "startup|tech|innovative" → Bold gradients, sans-serif, vibrant accents
- "elegant|luxury|premium" → High contrast, sophisticated typography
- "playful|creative|artistic" → Vibrant colors, creative layouts

COLOR PROCESSING:
- "blau|blue" → Primary: #3b82f6, Secondary: #1d4ed8
- "grün|green" → Primary: #10b981, Secondary: #059669  
- "rot|red" → Primary: #ef4444, Secondary: #dc2626
- "grau|gray" → Primary: #6b7280, Secondary: #374151
- "dunkel|dark" → Background: #1f2937, Text: #f9fafb
- "hell|light" → Background: #f9fafb, Text: #111827

BUSINESS COMPONENTS:
- "landing page" → Hero + Features + Testimonials + CTA + Footer
- "about page|über uns" → Company story, team, values, mission
- "contact page|kontakt" → Contact form, address, map, social links
- "portfolio|showcase" → Project gallery with filters and descriptions
- "blog|news" → Article layout with sidebar and pagination
- "e-commerce|shop" → Product grid with filters and shopping cart

=== OUTPUT REQUIREMENTS ===

1. Generate ONLY complete, functional HTML code
2. Include comprehensive CSS within <style> tags in <head>
3. Use semantic, accessible markup
4. Implement responsive design for all screen sizes
5. Add subtle animations and transitions for professional feel
6. Ensure cross-browser compatibility
7. Include meta tags for SEO when creating new pages
8. Use professional typography (system fonts stack)
9. Implement proper spacing and visual hierarchy
10. NO explanations, comments, or markdown - just clean HTML

=== QUALITY ASSURANCE ===
- Code must be production-ready
- All interactive elements must have hover states
- Images must have alt attributes
- Forms must have proper validation and labels
- Color contrast must meet WCAG AA standards
- Typography must follow professional scales
- Layout must work on mobile, tablet, and desktop

Generate the website now based on the user's request:`;

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
        top_p: 0.95,
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

    // Enterprise-level code cleaning and validation
    generatedCode = validateAndCleanCode(generatedCode);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        html: generatedCode,
        message: 'Professionelle Website erfolgreich generiert!',
        intent: userIntent,
        suggestions: generateFollowUpSuggestions(userIntent)
      })
    };

  } catch (error) {
    console.error('Enterprise Chat Handler Error:', error);
    
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

// ENTERPRISE HELPER FUNCTIONS

function analyzeUserIntent(message) {
  const lowercaseMsg = message.toLowerCase();
  
  // Advanced intent classification
  const intentPatterns = {
    layout: ['layout', 'structure', 'aufbau', 'anordnung', 'spalten', 'bereiche'],
    content: ['text', 'inhalt', 'schreibe', 'füge hinzu', 'content'],
    styling: ['farbe', 'color', 'design', 'aussehen', 'style', 'schön'],
    navigation: ['navigation', 'nav', 'menü', 'menu', 'links'],
    business: ['landing', 'about', 'contact', 'portfolio', 'shop', 'unternehmen'],
    interactive: ['button', 'form', 'formular', 'click', 'hover', 'animation']
  };

  const detectedIntents = [];
  Object.keys(intentPatterns).forEach(intent => {
    if (intentPatterns[intent].some(pattern => lowercaseMsg.includes(pattern))) {
      detectedIntents.push(intent);
    }
  });

  // Element detection
  const elementPatterns = {
    header: ['header', 'kopf', 'navigation', 'nav'],
    hero: ['hero', 'banner', 'jumbotron', 'hauptbereich'],
    cards: ['karten', 'cards', 'boxen', 'bereiche'],
    footer: ['footer', 'fußbereich', 'unten'],
    form: ['formular', 'form', 'kontakt', 'eingabe'],
    gallery: ['galerie', 'gallery', 'bilder', 'fotos']
  };

  const detectedElements = [];
  Object.keys(elementPatterns).forEach(element => {
    if (elementPatterns[element].some(pattern => lowercaseMsg.includes(pattern))) {
      detectedElements.push(element);
    }
  });

  // Layout analysis
  let layoutType = 'single-column';
  if (lowercaseMsg.includes('zwei') || lowercaseMsg.includes('nebeneinander')) layoutType = 'two-column';
  if (lowercaseMsg.includes('drei')) layoutType = 'three-column';
  if (lowercaseMsg.includes('vier')) layoutType = 'four-column';
  if (lowercaseMsg.includes('grid') || lowercaseMsg.includes('raster')) layoutType = 'grid';

  // Styling preferences
  let stylingPrefs = 'modern';
  if (lowercaseMsg.includes('minimalist') || lowercaseMsg.includes('clean')) stylingPrefs = 'minimalist';
  if (lowercaseMsg.includes('corporate') || lowercaseMsg.includes('business')) stylingPrefs = 'corporate';
  if (lowercaseMsg.includes('startup') || lowercaseMsg.includes('tech')) stylingPrefs = 'startup';

  return {
    category: detectedIntents.length > 0 ? detectedIntents[0] : 'general',
    allIntents: detectedIntents,
    elements: detectedElements,
    layout: layoutType,
    styling: stylingPrefs,
    complexity: detectedElements.length > 2 ? 'high' : detectedElements.length > 0 ? 'medium' : 'low'
  };
}

function generateContextualHints(currentHTML, message) {
  const hasContent = currentHTML && !currentHTML.includes('<!-- Hier wird deine Website erstellt -->');
  const hints = [];

  if (!hasContent) {
    hints.push('Building from scratch - recommend starting with semantic structure');
  } else {
    hints.push('Modifying existing content - preserve existing structure where possible');
  }

  if (message.includes('professional') || message.includes('business')) {
    hints.push('Use corporate color palette and conservative design patterns');
  }

  if (message.includes('mobile') || message.includes('responsive')) {
    hints.push('Prioritize mobile-first responsive design');
  }

  return hints.join(' | ');
}

function generateFollowUpSuggestions(intent) {
  const suggestions = {
    layout: ['Möchtest du ein Navigation hinzufügen?', 'Soll ich einen Footer erstellen?'],
    content: ['Weitere Abschnitte hinzufügen?', 'Bilder oder Icons einfügen?'],
    styling: ['Andere Farbpalette wählen?', 'Typography anpassen?'],
    business: ['Call-to-Action Buttons hinzufügen?', 'Kontaktformular erstellen?']
  };

  return suggestions[intent.category] || ['Weitere Verbesserungen?', 'Responsive Design optimieren?'];
}

function validateAndCleanCode(code) {
  let cleanCode = code.trim();
  
  // Remove markdown code blocks
  cleanCode = cleanCode.replace(/```html\n?/g, '').replace(/```\n?$/g, '');
  cleanCode = cleanCode.replace(/```\n?/g, '');
  
  // Ensure DOCTYPE exists
  if (!cleanCode.includes('<!DOCTYPE html>')) {
    if (cleanCode.startsWith('<html')) {
      cleanCode = '<!DOCTYPE html>\n' + cleanCode;
    }
  }

  // Add meta viewport if missing
  if (!cleanCode.includes('viewport')) {
    cleanCode = cleanCode.replace('<head>', '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }

  // Ensure charset is UTF-8
  if (!cleanCode.includes('charset')) {
    cleanCode = cleanCode.replace('<head>', '<head>\n    <meta charset="UTF-8">');
  }

  return cleanCode.trim();
}
