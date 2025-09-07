// Website Generator Function
// Generiert HTML basierend auf Chat-Spezifikationen

const baseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

// HTML Template Generator
function generateHTML(spec) {
  const { pageType, theme, sections, copy, tone } = spec;
  
  // Farb-Mappings
  const colorMap = {
    blue: { primary: '#667eea', secondary: '#764ba2', accent: '#0070f3' },
    beige: { primary: '#E9DFCF', secondary: '#C9B8A4', accent: '#8B7355' },
    red: { primary: '#EF4444', secondary: '#DC2626', accent: '#B91C1C' },
    green: { primary: '#10B981', secondary: '#059669', accent: '#047857' },
    black: { primary: '#000000', secondary: '#111111', accent: '#333333' },
    white: { primary: '#FFFFFF', secondary: '#F8F9FA', accent: '#E9ECEF' },
    gray: { primary: '#6B7280', secondary: '#4B5563', accent: '#374151' }
  };
  
  const colors = colorMap[theme.primary] || colorMap.blue;
  
  // CSS Styles generieren
  const styles = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: #333;
        background: ${colors.secondary === colors.primary ? '#f8f9fa' : colors.secondary};
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .section {
        padding: 4rem 0;
        margin: 2rem 0;
      }
      
      .hero {
        background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%);
        color: white;
        text-align: center;
        padding: 6rem 0;
      }
      
      .hero h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        animation: fadeInUp 0.6s ease-out;
      }
      
      .hero p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        animation: fadeInUp 0.6s ease-out 0.2s both;
      }
      
      .cta-button {
        background: white;
        color: ${colors.primary};
        padding: 1rem 2rem;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
        animation: fadeInUp 0.6s ease-out 0.4s both;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      }
      
      .features {
        background: white;
        padding: 4rem 0;
      }
      
      .features h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: ${colors.accent};
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
      }
      
      .feature-card {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid #e9ecef;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      }
      
      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        display: block;
      }
      
      .gallery {
        padding: 4rem 0;
        background: #f8f9fa;
      }
      
      .gallery h2 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 3rem;
        color: ${colors.accent};
      }
      
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
      
      .gallery-item {
        background: ${colors.primary};
        aspect-ratio: 16/9;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        opacity: 0.8;
      }
      
      .footer {
        background: ${colors.accent};
        color: white;
        text-align: center;
        padding: 2rem 0;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @media (max-width: 768px) {
        .hero h1 { font-size: 2rem; }
        .hero p { font-size: 1rem; }
        .features h2, .gallery h2 { font-size: 2rem; }
        .section { padding: 2rem 0; }
      }
    </style>
  `;
  
  // HTML Sections generieren
  let htmlSections = '';
  
  sections.forEach(section => {
    switch(section) {
      case 'hero':
        htmlSections += `
          <section class="hero">
            <div class="container">
              <h1>${copy.hero?.title || `Willkommen zu deiner ${pageType} Website`}</h1>
              <p>${copy.hero?.subtitle || 'Erstellt mit KI - angepasst für deine Bedürfnisse'}</p>
              <button class="cta-button">${copy.hero?.cta || 'Jetzt starten'}</button>
            </div>
          </section>
        `;
        break;
        
      case 'features':
        const features = copy.features?.items || [
          'Modernes Design',
          'Responsive Layout', 
          'Schnelle Ladezeiten'
        ];
        htmlSections += `
          <section class="features">
            <div class="container">
              <h2>${copy.features?.title || 'Unsere Stärken'}</h2>
              <div class="features-grid">
                ${features.map((feature, i) => `
                  <div class="feature-card">
                    <span class="feature-icon">${['⭐', '🚀', '💡'][i] || '✨'}</span>
                    <h3>${feature}</h3>
                    <p>Professionell umgesetzt für beste Ergebnisse.</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `;
        break;
        
      case 'gallery':
        htmlSections += `
          <section class="gallery">
            <div class="container">
              <h2>${copy.gallery?.title || 'Galerie'}</h2>
              <div class="gallery-grid">
                ${Array.from({length: 6}, (_, i) => `
                  <div class="gallery-item">
                    Bild ${i + 1}
                  </div>
                `).join('')}
              </div>
            </div>
          </section>
        `;
        break;
        
      case 'cta':
        htmlSections += `
          <section class="section">
            <div class="container" style="text-align: center;">
              <h2 style="color: ${colors.accent};">${copy.cta?.title || 'Bereit loszulegen?'}</h2>
              <p style="font-size: 1.2rem; margin: 1rem 0 2rem;">Kontaktiere uns für dein individuelles Projekt.</p>
              <button class="cta-button">${copy.cta?.button || 'Kontakt aufnehmen'}</button>
            </div>
          </section>
        `;
        break;
    }
  });
  
  // Footer hinzufügen wenn nicht in sections
  if (!sections.includes('footer')) {
    htmlSections += `
      <footer class="footer">
        <div class="container">
          <p>${copy.footer?.text || '© 2024 - Erstellt mit Website Builder'}</p>
        </div>
      </footer>
    `;
  }
  
  // Vollständiges HTML zusammenbauen
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - Website Builder</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      ${styles}
    </head>
    <body>
      ${htmlSections}
      
      <script>
        // Einfache Interaktionen
        document.querySelectorAll('.cta-button').forEach(btn => {
          btn.addEventListener('click', () => {
            alert('Button geklickt! Hier würde normalerweise eine Aktion ausgeführt.');
          });
        });
        
        // Scroll-Animationen
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card, .gallery-item').forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(el);
        });
      </script>
    </body>
    </html>
  `;
}

export async function handler(event, context) {
  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: baseHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: baseHeaders,
      body: JSON.stringify({ success: false, error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { spec } = body;
    
    if (!spec) {
      return {
        statusCode: 400,
        headers: baseHeaders,
        body: JSON.stringify({ 
          success: false, 
          error: "Spec erforderlich. Bitte erst Chat verwenden." 
        }),
      };
    }
    
    // HTML generieren
    const html = generateHTML(spec);
    
    return {
      statusCode: 200,
      headers: baseHeaders,
      body: JSON.stringify({
        success: true,
        html: html,
        message: `${spec.pageType} Website erfolgreich generiert!`
      }),
    };
    
  } catch (error) {
    console.error("Generate Error:", error);
    
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: JSON.stringify({
        success: false,
        error: `Generierung fehlgeschlagen: ${error.message}`
      }),
    };
  }
}