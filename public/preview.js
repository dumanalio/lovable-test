// Preview.js - Live-Vorschau System
// Hört auf Updates vom Chat-System und rendert Websites

class PreviewManager {
  constructor() {
    this.currentSpec = null;
    this.isGenerating = false;
    this.init();
  }
  
  init() {
    // Event Listener für Chat-Updates
    window.addEventListener('message', (event) => {
      if (event.data.type === 'updatePreview' && event.data.spec) {
        this.updatePreview(event.data.spec);
      }
    });
    
    // Custom Event Listener
    window.addEventListener('previewUpdate', (event) => {
      if (event.detail && event.detail.spec) {
        this.updatePreview(event.detail.spec);
      }
    });
    
    // Fallback: Polling für Updates (falls Events nicht funktionieren)
    this.startPolling();
    
    console.log('🎬 Preview Manager initialisiert');
  }
  
  async updatePreview(spec) {
    if (this.isGenerating) {
      console.log('⏳ Generation bereits läuft, überspringe...');
      return;
    }
    
    this.isGenerating = true;
    this.currentSpec = spec;
    
    try {
      console.log('🎨 Generiere Vorschau für:', spec.pageType);
      
      // Status an Parent Window senden
      this.sendStatusToParent('processing', 'Generiere Website...');
      
      const html = await this.generateHTML(spec);
      
      if (html) {
        this.renderHTML(html);
        this.sendStatusToParent('success', 'Website generiert!');
      }
      
    } catch (error) {
      console.error('❌ Preview Fehler:', error);
      this.renderError(error.message);
      this.sendStatusToParent('error', `Fehler: ${error.message}`);
    } finally {
      this.isGenerating = false;
    }
  }
  
  async generateHTML(spec) {
    // Versuche verschiedene Endpunkte
    const endpoints = [
      '/api/generate',
      '/.netlify/functions/generate'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Versuche Generate-Endpoint: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ spec })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.html) {
            console.log(`✅ HTML generiert via ${endpoint}`);
            return data.html;
          }
        } else {
          console.log(`❌ ${endpoint}: ${response.status}`);
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint} Fehler:`, error.message);
      }
    }
    
    // Fallback: Client-side HTML Generation
    console.log('🔄 Verwende Fallback HTML-Generation');
    return this.generateFallbackHTML(spec);
  }
  
  generateFallbackHTML(spec) {
    const { pageType, theme, sections, copy } = spec;
    
    const colors = {
      blue: '#667eea',
      red: '#ef4444', 
      green: '#10b981',
      beige: '#E9DFCF',
      black: '#000000',
      white: '#ffffff',
      gray: '#6b7280'
    };
    
    const primaryColor = colors[theme.primary] || colors.blue;
    
    return `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageType} - Live Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            line-height: 1.6; 
            color: #333; 
          }
          .hero { 
            background: linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc); 
            color: white; 
            text-align: center; 
            padding: 4rem 2rem; 
          }
          .hero h1 { 
            font-size: 2.5rem; 
            margin-bottom: 1rem; 
            animation: fadeIn 0.6s ease-out; 
          }
          .hero p { 
            font-size: 1.2rem; 
            margin-bottom: 2rem; 
            opacity: 0.9; 
          }
          .cta { 
            background: white; 
            color: ${primaryColor}; 
            padding: 1rem 2rem; 
            border: none; 
            border-radius: 8px; 
            font-size: 1.1rem; 
            cursor: pointer; 
            transition: transform 0.2s; 
          }
          .cta:hover { transform: translateY(-2px); }
          .section { 
            padding: 3rem 2rem; 
            text-align: center; 
          }
          .features { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 2rem; 
            max-width: 1200px; 
            margin: 2rem auto; 
          }
          .feature { 
            padding: 2rem; 
            background: #f8f9fa; 
            border-radius: 8px; 
            transition: transform 0.2s; 
          }
          .feature:hover { transform: translateY(-4px); }
          .footer { 
            background: #333; 
            color: white; 
            text-align: center; 
            padding: 2rem; 
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
      </head>
      <body>
        ${sections.includes('hero') ? `
          <section class="hero">
            <h1>${copy.hero?.title || `${pageType} Website`}</h1>
            <p>${copy.hero?.subtitle || 'Erstellt mit KI-Power'}</p>
            <button class="cta">${copy.hero?.cta || 'Mehr erfahren'}</button>
          </section>
        ` : ''}
        
        ${sections.includes('features') ? `
          <section class="section">
            <h2>Unsere Features</h2>
            <div class="features">
              <div class="feature">
                <h3>⚡ Schnell</h3>
                <p>Optimierte Performance</p>
              </div>
              <div class="feature">
                <h3>📱 Responsive</h3>
                <p>Funktioniert überall</p>
              </div>
              <div class="feature">
                <h3>🎨 Modern</h3>
                <p>Zeitgemäßes Design</p>
              </div>
            </div>
          </section>
        ` : ''}
        
        ${sections.includes('cta') ? `
          <section class="section" style="background: #f8f9fa;">
            <h2>Bereit zu starten?</h2>
            <p>Kontaktiere uns für dein Projekt</p>
            <button class="cta" style="margin-top: 1rem;">Jetzt anfragen</button>
          </section>
        ` : ''}
        
        <footer class="footer">
          <p>© 2024 - Generiert mit Website Builder</p>
        </footer>
        
        <script>
          // Einfache Interaktionen
          document.querySelectorAll('.cta').forEach(btn => {
            btn.addEventListener('click', () => {
              alert('Demo-Button geklickt!');
            });
          });
          
          // Animation beim Laden
          document.querySelectorAll('.feature').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
              el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            }, i * 200);
          });
        </script>
      </body>
      </html>
    `;
  }
  
  renderHTML(html) {
    // Wenn wir im iframe sind, ersetze den gesamten Inhalt
    if (window.parent !== window) {
      document.open();
      document.write(html);
      document.close();
    } else {
      // Wenn wir im Hauptfenster sind, zeige in einem Container
      const container = document.getElementById('preview-content');
      if (container) {
        container.innerHTML = html;
      }
    }
  }
  
  renderError(message) {
    const errorHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        height: 100vh; 
        font-family: system-ui, sans-serif; 
        background: #f8f9fa; 
        color: #dc3545;
        text-align: center;
        padding: 2rem;
      ">
        <div style="
          background: white; 
          padding: 2rem; 
          border-radius: 8px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
        ">
          <h2>⚠️ Fehler</h2>
          <p>${message}</p>
          <p style="font-size: 0.9rem; margin-top: 1rem; color: #6c757d;">
            Versuche es mit einer anderen Beschreibung im Chat.
          </p>
        </div>
      </div>
    `;
    
    this.renderHTML(errorHTML);
  }
  
  sendStatusToParent(type, message) {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'previewStatus',
        status: type,
        message: message
      }, '*');
    }
  }
  
  startPolling() {
    // Prüfe alle 2 Sekunden auf Updates (nur als Fallback)
    setInterval(() => {
      if (window.parent !== window) {
        window.parent.postMessage({
          type: 'previewReady'
        }, '*');
      }
    }, 2000);
  }
}

// Initialisiere Preview Manager
const previewManager = new PreviewManager();

// Globale Funktion für manuellen Trigger
window.updatePreview = (spec) => {
  previewManager.updatePreview(spec);
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreviewManager;
}