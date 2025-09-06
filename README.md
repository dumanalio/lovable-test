# 🚀 Enhanced AI Website Builder

Ein professioneller, KI-gestützter Website-Builder mit intelligenter Intent-Erkennung und automatischer Code-Generierung.

## ✨ Features

### 🧠 **Intelligente KI-Engine**
- **14 Website-Typen** automatisch erkannt (E-Commerce, Landing Pages, Portfolio, Corporate, etc.)
- **Confidence-Scoring** für präzise Intent-Erkennung
- **Branchenspezifische Templates** mit optimierten Layouts
- **Real-time Qualitäts-Scoring** und Performance-Metriken

### 🎨 **Professional Design System**
- **860+ Zeilen detaillierte Prompts** für perfekte Ergebnisse
- **Enhanced CSS Framework** mit 100+ Design-Variablen
- **Responsive Design** (Mobile-First, 320px - 1920px)
- **Accessibility-konform** (WCAG 2.1 Level AA)

### ⚡ **Advanced Features**
- **Session Management** mit persistenter Chat-Historie
- **Retry-Logic** mit exponential backoff für API-Aufrufe
- **Enhanced Error Handling** mit detailliertem Logging
- **Performance-Optimierung** (lazy loading, SEO, etc.)

### 🛠️ **Tech Stack**
- **Frontend:** Vanilla JavaScript (ES6+), CSS3, HTML5
- **Backend:** Netlify Functions, OpenAI GPT-4 Turbo
- **Deployment:** Netlify
- **AI:** OpenAI API mit erweiterten Parametern

## 🚀 Quick Start

### 1. Repository klonen
```bash
git clone https://github.com/yourusername/enhanced-ai-website-builder.git
cd enhanced-ai-website-builder
```

### 2. Dependencies installieren
```bash
npm install
```

### 3. Umgebungsvariablen einrichten
Erstelle eine `.env` Datei im Root-Verzeichnis:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

### 4. Entwicklungsserver starten
```bash
npm run dev
```

Die Anwendung läuft jetzt auf `http://localhost:8888`

## 📁 Projektstruktur

```
enhanced-ai-website-builder/
├── 📁 netlify/
│   └── 📁 functions/
│       ├── 🔧 chat-handler.js      # Enhanced KI-Engine (1560+ Zeilen)
│       ├── 🔧 generate.js          # Website-Generator
│       └── 🔧 website-generator.js # Deployment-Handler
├── 📁 public/
│   ├── 🌐 index.html              # Haupt-UI
│   ├── ⚡ script.js               # Enhanced Frontend-Logic
│   ├── 🎨 styles.css              # Enhanced CSS Framework
│   └── 📁 utils/
│       ├── 🔧 api-client.js       # Enhanced API-Client
│       └── 🔧 dom-helpers.js       # DOM-Utilities
├── 📁 templates/
│   └── 📄 basic-layout.html       # Base-Template
├── ⚙️ netlify.toml                # Netlify-Konfiguration
├── 📦 package.json                # Dependencies & Scripts
└── 📖 README.md                   # Diese Datei
```

## 🎯 Verwendung

### 1. **Website-Typen**
Der Builder erkennt automatisch 14 verschiedene Website-Typen:
- 🛒 **E-Commerce** - Online-Shops mit Produktkarten
- 🎯 **Landing Pages** - Conversion-optimierte Marketing-Seiten
- 🎨 **Portfolio** - Kreative Showcases mit Projekt-Galerie
- 🏢 **Corporate** - Professionelle Unternehmenswebsites
- 🍕 **Restaurant** - Gastronomie mit Menü-Integration
- 💻 **SaaS** - Software-Plattformen mit Feature-Übersicht
- 🏠 **Immobilien** - Property-Listings mit Suchfunktion
- 💪 **Fitness** - Gym/Training mit Kurs-Übersicht
- 🎓 **Bildung** - Schulen/Kurse mit Lehrplan
- 🎉 **Events** - Veranstaltungen mit Ticketing
- ❤️ **Nonprofit** - Spendenorganisationen
- 👤 **Personal** - Persönliche Websites/CVs
- 🏡 **Real Estate** - Immobilien-Websites
- 📰 **Blog/News** - Content-Plattformen

### 2. **Beispiel-Prompts**
```
🛒 E-Commerce:
"Erstelle einen Online-Shop für Sportbekleidung mit Produktkarten und Warenkorb"

🎯 Landing Page:
"Baue eine Conversion-optimierte Landing Page für meine Marketing-Agentur"

🎨 Portfolio:
"Erstelle ein Designer-Portfolio mit Projekt-Galerie und Kontaktformular"

🏢 Corporate:
"Baue eine professionelle Website für mein Consulting-Unternehmen"
```

### 3. **Advanced Features nutzen**
- **Intent-Feedback:** Der Builder zeigt erkannte Website-Typen mit Confidence-Score
- **Qualitäts-Metriken:** Real-time Scoring von Code-Qualität und Performance
- **Intelligente Vorschläge:** Automatische Empfehlungen für Verbesserungen
- **Session-Persistenz:** Chat-Historie bleibt über Browser-Sessions erhalten

## 🔧 Konfiguration

### OpenAI API Setup
1. Gehe zu [OpenAI Platform](https://platform.openai.com/)
2. Erstelle einen API-Key
3. Füge den Key zur `.env` Datei hinzu
4. Stelle sicher, dass du GPT-4 Zugang hast

### Netlify Deployment
```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Mit Netlify verbinden
netlify login
netlify init

# Deployen
npm run deploy
```

### Umgebungsvariablen (Netlify)
Füge diese Variablen in den Netlify-Einstellungen hinzu:
- `OPENAI_API_KEY`: Dein OpenAI API-Schlüssel
- `NODE_ENV`: `production`

## 📊 Performance-Metriken

Der Enhanced Builder bietet detaillierte Metriken:
- **Qualitäts-Score:** 60-100 basierend auf Best Practices
- **Code-Zeilen:** Anzahl generierter HTML/CSS Zeilen
- **Geschätzte Ladezeit:** Performance-Schätzung in ms
- **Confidence-Score:** Sicherheit der Intent-Erkennung (60-95%)

## 🐛 Troubleshooting

### Häufige Probleme

**1. API-Fehler 401 (Unauthorized)**
```
Lösung: Überprüfe deinen OpenAI API-Key in der .env Datei
```

**2. Netlify Functions Timeout**
```
Lösung: Komplexe Anfragen in kleinere Teile aufteilen
```

**3. Frontend lädt nicht**
```
Lösung: npm run dev ausführen und Port 8888 prüfen
```

**4. Chat-Nachrichten kommen nicht an**
```
Lösung: Browser-Konsole auf Netzwerk-Fehler prüfen
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📝 Changelog

### Version 2.0.0 (Enhanced)
- ✅ 14 Website-Typen mit automatischer Erkennung
- ✅ Confidence-Scoring für Intent-Analyse
- ✅ Enhanced CSS Framework (860+ Zeilen Prompts)
- ✅ Session Management mit localStorage
- ✅ Retry-Logic für API-Aufrufe
- ✅ Real-time Performance-Metriken
- ✅ Enhanced Error Handling
- ✅ Mobile-optimierte Responsive Design

### Version 1.0.0 (Initial)
- ✅ Basic Chat-Interface
- ✅ OpenAI Integration
- ✅ Netlify Functions
- ✅ Simple Website Generation

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- **OpenAI** für die GPT-4 API
- **Netlify** für Hosting und Functions
- **Enhanced by AI** - Optimiert für professionelle Website-Erstellung

---

**🚀 Erstellt mit Enhanced AI Website Builder - Von der Idee zur professionellen Website in Sekunden!**
