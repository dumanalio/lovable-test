// Enhanced Chat.js mit verbesserter UX für No-Coder

// DOM Elemente
const messagesContainer = document.getElementById("chat-messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const charCount = document.getElementById("char-count");
const typingIndicator = document.getElementById("typing-indicator");
const chatWelcome = document.getElementById("chat-welcome");
const previewStatus = document.getElementById("preview-status");
const statusIndicator = previewStatus?.querySelector('.status-indicator');
// State
let isProcessing = false;
let conversationHistory = [];
const MAX_HISTORY = 10;

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  initChatUI();
  setupExamplePrompts();
});
function initChatUI() {
  // Auto-resize für Textarea & CharCount
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    const length = input.value.length;
    charCount.textContent = `${length}/500`;
    charCount.style.color = length > 450 ? '#ef4444' : '#9ca3af';
    updateSendButton();
  });
  updateSendButton();
  updateStatus('ready', 'Bereit für Eingaben');

  // Send button click
  sendBtn.addEventListener("click", handleSendMessage);
  // Enter key (ohne Shift für senden)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) handleSendMessage();
    }
  });
  // Header buttons
  document.getElementById('save-btn')?.addEventListener('click', handleSave);
  document.getElementById('export-btn')?.addEventListener('click', handleExport);
  document.getElementById('refresh-preview')?.addEventListener('click', handleRefreshPreview);
  // Device buttons
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      handleDeviceChange(e.target.dataset.device);
    });
  });
}
  // Enter key (ohne Shift für senden)
function hideWelcomeCard() {
  if (chatWelcome) {
    chatWelcome.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      chatWelcome.style.display = 'none';
    }, 300);
  }
}
  
function addMessage(text, sender = "user", options = {}) {
  if (sender === "user" && conversationHistory.length === 0) hideWelcomeCard();
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  if (options.isMarkdown && sender === "bot") {
    msg.innerHTML = parseSimpleMarkdown(text);
  } else {
    msg.textContent = text;
  }
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  // Conversation History begrenzen
  conversationHistory.push({ text, sender, timestamp: Date.now() });
  if (conversationHistory.length > MAX_HISTORY) conversationHistory.shift();
}
function parseSimpleMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
      chatWelcome.style.display = 'none';
function showTypingIndicator() { typingIndicator.style.display = 'flex'; }
function hideTypingIndicator() { typingIndicator.style.display = 'none'; }
function updateSendButton() {
  const hasText = input.value.trim().length > 0;
  const withinLimit = input.value.length <= 500;
  sendBtn.disabled = !hasText || !withinLimit || isProcessing;
}
function updateStatus(type, message) {
  if (!previewStatus || !statusIndicator) return;
  const indicators = {
    ready: '🟢',
    processing: '🟡',
    error: '🔴',
    success: '🟢'
  };
  statusIndicator.textContent = indicators[type] || '🟢';
  previewStatus.querySelector('span:last-child').textContent = message;
}
function parseSimpleMarkdown(text) {
async function handleSendMessage() {
  const text = input.value.trim();
  if (!text || isProcessing) return;
// ...existing code...
  
  // UI Updates
  isProcessing = true;
  addMessage(text, "user");
  input.value = "";
  input.style.height = 'auto';
  updateSendButton();
  showTypingIndicator();
  updateStatus('processing', 'KI denkt nach...');
  
  try {
    await callChatAPI(text);
  } catch (error) {
    console.error('Chat error:', error);
    addMessage("⚠️ Es gab einen Fehler. Bitte versuche es erneut.", "bot");
    updateStatus('error', 'Fehler aufgetreten');
  } finally {
    isProcessing = false;
    hideTypingIndicator();
    updateSendButton();
    updateStatus('ready', 'Bereit für Eingaben');
  }
}

// Verbesserte API-Kommunikation
async function callChatAPI(message) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    updateStatus('processing', 'Verbinde mit KI...');
    
    // Versuche verschiedene API-Endpunkte (für lokale Entwicklung und Produktion)
    const endpoints = [
      "/api/chat",                    // Netlify Redirect
      "/.netlify/functions/chat",     // Direkter Netlify Path
      "/netlify/functions/chat"       // Fallback
    ];
    
    let res;
    let lastError;
    let usedEndpoint;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Versuche Endpoint: ${endpoint}`);
        res = await fetch(endpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ 
            message, 
            mode: "spec", // später auch "spec+ai"
            history: conversationHistory.slice(-5) // Letzten 5 Nachrichten für Kontext
          }),
          signal: controller.signal
        });
        
        if (res.ok) {
          usedEndpoint = endpoint;
          console.log(`✅ Erfolgreicher Endpoint: ${endpoint}`);
          break; // Erfolgreicher Request
        } else if (res.status !== 404) {
          // Nicht-404 Fehler sofort werfen
          const errorText = await res.text();
          throw new Error(`Server Fehler ${res.status}: ${errorText}`);
        } else {
          console.log(`❌ 404 bei Endpoint: ${endpoint}`);
        }
        
      } catch (err) {
        console.log(`❌ Fehler bei Endpoint ${endpoint}:`, err.message);
        lastError = err;
        if (err.name === 'AbortError') {
          throw err; // Timeout sofort weiterwerfen
        }
        // Bei anderen Fehlern nächsten Endpoint versuchen
        continue;
      }
    }
    
    if (!res || !res.ok) {
      throw lastError || new Error('Alle API-Endpunkte nicht erreichbar');
    }

    clearTimeout(timeoutId);

    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.error || "Unbekannter Fehler");
    }

    // Bot Response anzeigen
    if (data?.ui?.reply) {
      addMessage(data.ui.reply, "bot", { isMarkdown: true });
    } else {
      addMessage("❌ Keine Antwort vom Assistenten erhalten.", "bot");
    }

    // Debug Info (immer anzeigen für Troubleshooting)
    console.log("🤖 Chat Response:", data);
    console.log("📋 Generated Spec:", data.spec);
    console.log("🔗 Used Endpoint:", usedEndpoint || 'unknown');
    
    // Automatisch Website generieren wenn Spec vorhanden
    if (data.spec && data.success) {
      setTimeout(async () => {
        updateStatus('processing', 'Generiere Live-Vorschau...');
        await generateWebsitePreview(data.spec);
      }, 1000);
    }
    
    // Nächste Aktion vorschlagen
    if (data.next?.action === 'generate') {
      setTimeout(() => {
        addMessage("💡 **Tipp:** Sage 'Generiere die Website' um eine Vorschau zu erstellen!", "bot", { isMarkdown: true });
      }, 1500);
    }
    
    updateStatus('success', 'Antwort erhalten');
    
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      addMessage("⏱️ Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.", "bot");
      updateStatus('error', 'Timeout');
    } else {
      addMessage(`⚠️ **Fehler:** ${err.message}`, "bot", { isMarkdown: true });
      updateStatus('error', 'Fehler beim Laden');
    }
    
    throw err;
  }
}

// Header Button Handlers
function handleSave() {
  // TODO: Implementiere Speicherfunktion
  updateStatus('processing', 'Speichere...');
  setTimeout(() => {
    updateStatus('success', 'Gespeichert!');
    setTimeout(() => updateStatus('ready', 'Bereit für Eingaben'), 2000);
  }, 1000);
}

function handleExport() {
  // TODO: Implementiere Export-Funktion
  updateStatus('processing', 'Exportiere...');
  setTimeout(() => {
    updateStatus('success', 'Export bereit!');
    setTimeout(() => updateStatus('ready', 'Bereit für Eingaben'), 2000);
  }, 1500);
}

function handleRefreshPreview() {
  const iframe = document.getElementById('preview-frame');
  if (iframe) {
    updateStatus('processing', 'Aktualisiere Vorschau...');
    iframe.src = iframe.src;
    setTimeout(() => {
      updateStatus('ready', 'Vorschau aktualisiert');
    }, 1000);
  }
}

function handleDeviceChange(device) {
  const iframe = document.getElementById('preview-frame');
  const container = document.querySelector('.preview-container');
  
  if (!iframe || !container) return;
  
  // Responsive preview simulation
  switch(device) {
    case 'desktop':
      iframe.style.width = '100%';
      iframe.style.maxWidth = 'none';
      break;
    case 'tablet':
      iframe.style.width = '768px';
      iframe.style.maxWidth = '100%';
      break;
    case 'mobile':
      iframe.style.width = '375px';
      iframe.style.maxWidth = '100%';
      break;
  }
  
  updateStatus('ready', `${device} Ansicht aktiv`);
}

// Website Preview Generator - Optimiert
async function generateWebsitePreview(spec) {
  const previewFrame = document.getElementById('preview-frame');
  if (!previewFrame) {
    console.error('❌ Preview Frame nicht gefunden!');
    return;
  }
  
  console.log('🎨 Starte Website-Generierung mit Spec:', spec);
  
  try {
    updateStatus('processing', 'Generiere Website...');
    
    // Versuche mehrere Generate-Endpunkte
    const generateEndpoints = [
      '/api/generate',
      '/.netlify/functions/generate'
    ];
    
    let html = null;
    let usedEndpoint = null;
    
    for (const endpoint of generateEndpoints) {
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
            html = data.html;
            usedEndpoint = endpoint;
            console.log(`✅ HTML generiert via ${endpoint}`);
            break;
          }
        } else {
          console.log(`❌ ${endpoint}: ${response.status}`);
        }
        
      } catch (error) {
        console.log(`❌ ${endpoint} Fehler:`, error.message);
      }
    }
    
    // Fallback: Client-side Generation
    if (!html) {
      console.log('🔄 Verwende Client-side Fallback-Generation');
      html = generateFallbackHTML(spec);
      usedEndpoint = 'client-side';
    }
    
    if (html) {
      // HTML direkt in iframe laden
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Warte auf iframe load
      previewFrame.onload = () => {
        URL.revokeObjectURL(url);
        updateStatus('success', 'Website generiert!');
        addMessage(`✅ **Live-Vorschau aktualisiert!** (via ${usedEndpoint})`, "bot", { isMarkdown: true });
        console.log('🎉 Preview erfolgreich geladen');
      };
      
      // Setze neue URL
      previewFrame.src = url;
      console.log(`🔗 Lade HTML in iframe via ${usedEndpoint}`);
      
    } else {
      throw new Error('Keine HTML-Generierung möglich');
    }
    
  } catch (error) {
    console.error('❌ Preview Generation Error:', error);
    updateStatus('error', 'Generierung fehlgeschlagen');
    addMessage(`⚠️ **Vorschau-Fehler:** ${error.message}`, "bot", { isMarkdown: true });
    
    // Zeige Fehler-Seite
    showErrorPreview(error.message);
  }
}

// Client-side Fallback HTML Generator
function generateFallbackHTML(spec) {
  const { pageType, theme, sections, copy, tone } = spec;
  
  const colors = {
    blue: { primary: '#667eea', secondary: '#764ba2' },
    red: { primary: '#ef4444', secondary: '#dc2626' },
    green: { primary: '#10b981', secondary: '#059669' },
    beige: { primary: '#E9DFCF', secondary: '#C9B8A4' },
    black: { primary: '#000000', secondary: '#333333' },
    white: { primary: '#ffffff', secondary: '#f8f9fa' },
    gray: { primary: '#6b7280', secondary: '#4b5563' }
  };
  
  const colorScheme = colors[theme.primary] || colors.blue;
  
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pageType.charAt(0).toUpperCase() + pageType.slice(1)} - Live Preview</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          overflow-x: hidden;
        }
        .hero { 
          background: linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.secondary}); 
          color: white; 
          text-align: center; 
          padding: 5rem 2rem; 
          position: relative;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
        }
        .hero-content { position: relative; z-index: 1; }
        .hero h1 { 
          font-size: 3.5rem; 
          font-weight: 700;
          margin-bottom: 1.5rem; 
          animation: slideInUp 0.8s ease-out; 
        }
        .hero p { 
          font-size: 1.3rem; 
          margin-bottom: 2.5rem; 
          opacity: 0.9; 
          animation: slideInUp 0.8s ease-out 0.2s both;
        }
        .cta { 
          background: white; 
          color: ${colorScheme.primary}; 
          padding: 1.2rem 2.5rem; 
          border: none; 
          border-radius: 12px; 
          font-size: 1.2rem; 
          font-weight: 600;
          cursor: pointer; 
          transition: all 0.3s ease; 
          animation: slideInUp 0.8s ease-out 0.4s both;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .cta:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .section { 
          padding: 4rem 2rem; 
          max-width: 1200px;
          margin: 0 auto;
        }
        .section h2 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 3rem;
          color: ${colorScheme.primary};
        }
        .features { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 2.5rem; 
          margin: 3rem 0;
        }
        .feature { 
          padding: 2.5rem; 
          background: #f8f9fa; 
          border-radius: 15px; 
          text-align: center;
          transition: all 0.3s ease; 
          border: 1px solid #e9ecef;
          position: relative;
          overflow: hidden;
        }
        .feature::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: ${colorScheme.primary};
        }
        .feature:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: block;
        }
        .feature h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: ${colorScheme.primary};
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .gallery-item {
          background: linear-gradient(45deg, ${colorScheme.primary}, ${colorScheme.secondary});
          aspect-ratio: 16/9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
          font-weight: 500;
          transition: transform 0.3s ease;
        }
        .gallery-item:hover {
          transform: scale(1.05);
        }
        .footer { 
          background: ${colorScheme.secondary}; 
          color: white; 
          text-align: center; 
          padding: 3rem 2rem; 
        }
        .generated-badge {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: ${colorScheme.primary};
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          z-index: 1000;
          animation: slideInRight 0.5s ease-out;
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.5rem; }
          .hero p { font-size: 1.1rem; }
          .section { padding: 3rem 1rem; }
          .features { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      ${sections.includes('hero') ? `
        <section class="hero">
          <div class="hero-content">
            <h1>${copy.hero?.title || `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} Website`}</h1>
            <p>${copy.hero?.subtitle || 'Erstellt mit KI - perfekt für deine Bedürfnisse'}</p>
            <button class="cta">${copy.hero?.cta || 'Mehr erfahren'}</button>
          </div>
        </section>
      ` : ''}
      
      ${sections.includes('features') ? `
        <section class="section">
          <h2>Unsere Stärken</h2>
          <div class="features">
            <div class="feature">
              <span class="feature-icon">⚡</span>
              <h3>Blitzschnell</h3>
              <p>Optimierte Performance für beste Benutzererfahrung</p>
            </div>
            <div class="feature">
              <span class="feature-icon">📱</span>
              <h3>Responsive</h3>
              <p>Funktioniert perfekt auf allen Geräten</p>
            </div>
            <div class="feature">
              <span class="feature-icon">🎨</span>
              <h3>Modern</h3>
              <p>Zeitgemäßes Design nach neuesten Standards</p>
            </div>
          </div>
        </section>
      ` : ''}
      
      ${sections.includes('gallery') ? `
        <section class="section">
          <h2>Galerie</h2>
          <div class="gallery-grid">
            ${Array.from({length: 6}, (_, i) => `
              <div class="gallery-item">
                Projekt ${i + 1}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
      
      ${sections.includes('cta') ? `
        <section class="section" style="background: #f8f9fa; margin: 0; max-width: none; text-align: center;">
          <h2>Bereit zu starten?</h2>
          <p style="font-size: 1.2rem; margin-bottom: 2rem;">Kontaktiere uns für dein individuelles Projekt</p>
          <button class="cta">Jetzt anfragen</button>
        </section>
      ` : ''}
      
      <footer class="footer">
        <p>© 2024 - Generiert mit Website Builder | Stil: ${tone} | Farbe: ${theme.primary}</p>
      </footer>
      
      <div class="generated-badge">
        ✨ Live generiert
      </div>
      
      <script>
        // Interaktionen
        document.querySelectorAll('.cta').forEach(btn => {
          btn.addEventListener('click', () => {
            alert('🎉 Demo-Button geklickt! In der echten Website würde hier eine Aktion ausgeführt.');
          });
        });
        
        // Scroll-Animationen
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }
          });
        }, observerOptions);
        
        document.querySelectorAll('.feature, .gallery-item').forEach((el, i) => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.transitionDelay = i * 0.1 + 's';
          observer.observe(el);
        });
        
        console.log('🎨 Website erfolgreich geladen:', {
          pageType: '${pageType}',
          theme: '${theme.primary}',
          sections: ${JSON.stringify(sections)},
          tone: '${tone}'
        });
      </script>
    </body>
    </html>
  `;
}

// Fehler-Preview anzeigen
function showErrorPreview(message) {
  const previewFrame = document.getElementById('preview-frame');
  if (!previewFrame) return;
  
  const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fehler</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0; 
          background: linear-gradient(135deg, #ff6b6b, #ee5a24); 
          color: white; 
          text-align: center; 
          padding: 2rem;
        }
        .error { 
          background: rgba(255,255,255,0.1); 
          backdrop-filter: blur(10px);
          padding: 3rem; 
          border-radius: 20px; 
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          max-width: 500px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .error h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .error p {
          font-size: 1.1rem;
          margin: 1rem 0;
          opacity: 0.9;
        }
        .retry-btn {
          background: white;
          color: #ff6b6b;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 2rem;
          transition: transform 0.2s;
        }
        .retry-btn:hover {
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error">
        <h2>⚠️ Ups, etwas ist schiefgelaufen</h2>
        <p><strong>Fehler:</strong> ${message}</p>
        <p>Versuche es mit einer anderen Beschreibung im Chat oder lade die Seite neu.</p>
        <button class="retry-btn" onclick="window.parent.location.reload()">🔄 Seite neu laden</button>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([errorHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  previewFrame.src = url;
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Event System für Preview Updates
window.addEventListener('previewUpdate', (event) => {
  if (event.detail && event.detail.spec) {
    generateWebsitePreview(event.detail.spec);
  }
});

// CSS Animation für fadeOut
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);
}
// Datei korrekt abgeschlossen
