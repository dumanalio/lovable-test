#!/usr/bin/env node

/**
 * Einfacher Development Server für lokale Entwicklung
 * Startet einen Server auf Port 3000 und simuliert Netlify Functions
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME Types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Chat Function Handler (vereinfacht für lokale Entwicklung)
async function handleChatAPI(body) {
  try {
    const { message } = JSON.parse(body);
    
    // Simuliere Chat-Response
    const response = {
      success: true,
      ui: { 
        reply: `Perfekt! 🎉 Ich habe verstanden: "${message}"\n\n**Landingpage** in Blau-Tönen\nStil: minimalistisch und clean\n\n**Geplante Bereiche:**\n🎯 Hero-Bereich (großer Titel + Hauptbotschaft)\n⭐ Funktionen/Vorteile-Sektion\n📢 Call-to-Action (Handlungsaufforderung)\n📄 Fußbereich (Links, Impressum)\n\n**Was passiert als nächstes?**\n✅ Sage **'Generiere die Website'** für eine Live-Vorschau\n✏️ Oder beschreibe Änderungen: *'Mach die Farbe grüner'*\n\n*Ich erstelle alles automatisch - du musst nichts programmieren!* 🚀`
      },
      spec: {
        pageType: 'landing',
        theme: { primary: 'blue' },
        sections: ['hero', 'features', 'cta', 'footer'],
        tone: 'minimal'
      },
      next: { action: 'generate', endpoint: '/api/generate' }
    };
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Invalid request: ' + error.message
      })
    };
  }
}

const server = createServer(async (req, res) => {
  // CORS Headers für alle Requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // API Routes
  if (url.pathname === '/api/chat' || url.pathname === '/.netlify/functions/chat') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', async () => {
        const response = await handleChatAPI(body);
        res.writeHead(response.statusCode, response.headers);
        res.end(response.body);
      });
      return;
    }
  }
  
  // Static Files
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname;
  filePath = join(__dirname, 'public', filePath);
  
  if (!existsSync(filePath)) {
    res.writeHead(404);
    res.end('404 Not Found');
    return;
  }
  
  try {
    const content = readFileSync(filePath);
    const ext = filePath.substring(filePath.lastIndexOf('.'));
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (error) {
    res.writeHead(500);
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Development Server läuft auf http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${join(__dirname, 'public')}`);
  console.log(`🔧 API Endpoints:`);
  console.log(`   POST /api/chat - Chat Function`);
  console.log(`\n💡 Für Produktion verwende: netlify dev`);
});
