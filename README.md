# 🚀 Website Builder - No-Code KI-Plattform

Eine professionelle No-Code-Plattform, mit der Nutzer durch einfache Chat-Anweisungen Websites erstellen können.

## ✨ Features

- 🤖 **KI-Chat Interface** - Beschreibe einfach, was du willst
- 🎨 **Automatisches Design** - KI wählt Farben, Layout und Stil
- ⚡ **Live-Vorschau** - Sieh deine Website sofort entstehen
- 📱 **Responsive Design** - Funktioniert auf allen Geräten
- 🔧 **No-Code** - Kein Programmieren erforderlich

## 🛠️ Installation & Setup

### Option 1: Mit Netlify CLI (Empfohlen)

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Option 2: Einfacher Development Server

```bash
# Fallback für lokale Entwicklung
npm run dev:simple
```

Dann öffne [http://localhost:3000](http://localhost:3000)

## 🎯 Verwendung

1. **Chat starten**: Beschreibe im Chat, was für eine Website du brauchst
   - "Erstelle eine Landingpage für mein Restaurant"
   - "Ich brauche eine Portfolio-Website für Fotografie"
   - "Mache eine Über-uns Seite für mein Team"

2. **KI versteht automatisch**:
   - Seitentyp (Landing, Portfolio, Blog, etc.)
   - Farbschema (aus deiner Beschreibung)
   - Stil (minimalistisch, premium, verspielt)
   - Benötigte Abschnitte

3. **Website generieren**: Sage "Generiere die Website" für Live-Vorschau

## 🏗️ Architektur

```
├── public/                 # Frontend (HTML, CSS, JS)
├── netlify/functions/      # Backend API Functions
│   ├── chat/              # KI-Chat Handler
│   ├── generate/          # Website Generator
│   └── projects/          # Projekt-Management
├── src/                   # Templates & Components
│   ├── client/            # Client-side Code
│   └── server/            # Server Templates
└── dev-server.js          # Lokaler Development Server
```

## 🔧 Konfiguration

### Netlify Functions

Die API-Endpunkte sind in `netlify.toml` konfiguriert:

- `/api/chat` → Chat-Interface
- `/api/generate` → Website-Generator
- `/api/projects/*` → Projekt-Management

### Environment Variables

Für erweiterte KI-Features (optional):

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

## 📦 Deployment

### Netlify (Automatisch)

```bash
# Production Deploy
npm run deploy:prod
```

### Manuell

1. Build erstellen: `npm run build`
2. `public/` Ordner auf Webserver hochladen
3. Netlify Functions konfigurieren

## 🤝 Beispiel-Prompts

Probiere diese Beispiele im Chat:

- **Startup**: "Erstelle eine moderne Landingpage für mein Tech-Startup mit blauer Farbgebung und Hero-Sektion"
- **Restaurant**: "Ich brauche eine Website für mein italienisches Restaurant mit warmen Farben und Speisekarte"
- **Portfolio**: "Erstelle eine Portfolio-Website für meine Fotografie mit großer Bildergalerie"
- **Unternehmen**: "Mache eine Über-uns Seite mit Team-Bereich und Kontaktformular"

## 🐛 Troubleshooting

### Chat funktioniert nicht (404 Fehler)

1. **Netlify CLI installiert?**
   ```bash
   npm install -g netlify-cli
   npm run dev
   ```

2. **Fallback verwenden:**
   ```bash
   npm run dev:simple
   ```

3. **Dependencies prüfen:**
   ```bash
   npm run install:deps
   ```

### Lokale Entwicklung

Der einfache Development Server (`npm run dev:simple`) simuliert die Netlify Functions lokal und sollte für die meisten Entwicklungsarbeiten ausreichen.

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

**Erstellt mit ❤️ für No-Coder und Entwickler**