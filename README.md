# 🚀 Lovable Light - No-Code Website Builder

Ein interaktiver Website Builder im Stil von Lovable Light, der mit OpenAI's GPT-4 natürliche Sprache in schöne Websites verwandelt.

## ✨ Features

- **🗣️ Chat-Interface**: Beschreibe deine Website in natürlicher Sprache
- **👁️ Live-Vorschau**: Sieh deine Website sofort rechts in der Vorschau
- **🤖 KI-Powered**: OpenAI GPT-4 generiert professionellen Website-Code
- **📱 Responsive**: Alle Websites funktionieren auf Desktop, Tablet und Mobile
- **⚡ Blitzschnell**: Websites in Sekunden, nicht Stunden

## 🛠️ Installation & Setup

### Voraussetzungen
- Node.js 18+ installiert
- OpenAI API Key

### Lokale Entwicklung

1. **Repository klonen/herunterladen**
```bash
cd my-lovable-light
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Umgebungsvariablen einrichten**
Erstelle eine `.env.local` Datei im Projektroot:
```bash
OPENAI_API_KEY=dein_openai_api_key_hier
```

4. **Entwicklungsserver starten**
```bash
npm run dev
```

5. **Browser öffnen**
Öffne http://localhost:3000 in deinem Browser

## 🚀 Deployment auf Vercel

1. **Vercel Account erstellen** (falls noch nicht vorhanden)
2. **Repository zu Vercel verbinden**
3. **Umgebungsvariable setzen**:
   - `OPENAI_API_KEY` = Dein OpenAI API Key
4. **Deploy!** - Vercel erkennt automatisch die Konfiguration

## 📁 Projektstruktur

```
my-lovable-light/
├── api/
│   └── generate.js          # OpenAI API Endpoint
├── public/
│   ├── data.json           # Beispiel-Website (Startzustand)
│   └── favicon.ico         # Website-Icon
├── src/
│   ├── index.html          # Haupt-UI (Chat + Vorschau)
│   ├── styles.css          # Alle Styles
│   ├── renderer.js         # JSON → HTML Renderer
│   └── chat.js             # Chat-Logik & API-Calls
├── package.json
└── README.md
```

## 🎯 Wie es funktioniert

1. **User Input**: Links im Chat beschreibt der User seine Wunsch-Website
2. **API Call**: `chat.js` sendet die Anfrage an `/api/generate`
3. **OpenAI Magic**: `generate.js` fragt OpenAI GPT-4 mit strukturiertem Prompt
4. **JSON Response**: GPT-4 antwortet mit strukturiertem JSON
5. **Live Rendering**: `renderer.js` wandelt JSON in HTML/CSS um
6. **Sofortiges Feedback**: Website erscheint rechts in der Vorschau

## 🔧 Unterstützte Website-Blöcke

- **Hero**: Große Überschrift mit Call-to-Action
- **Features**: Feature-Grid mit Icons
- **FAQ**: Aufklappbare Fragen & Antworten  
- **Form**: Kontakt-/Anmeldeformulare
- **Text**: Einfache Textblöcke
- **Gallery**: Bildergalerien
- **Testimonials**: Kundenbewertungen
- **Pricing**: Preistabellen

## 💡 Beispiel-Anfragen

- "Erstelle eine Landingpage für mein Restaurant 'Bella Vista'"
- "Baue eine Portfolio-Website für einen Fotografen"
- "Ich brauche eine Unternehmensseite mit Kontaktformular"
- "Erstelle eine Produktseite mit Preistabelle"
- "Baue eine FAQ-Seite für meinen Online-Shop"

## 🔑 API Key Setup

### OpenAI API Key erhalten:
1. Gehe zu https://platform.openai.com/api-keys
2. Erstelle einen neuen API Key
3. Kopiere den Key (beginnt mit `sk-...`)

### Lokale Entwicklung:
```bash
# .env.local
OPENAI_API_KEY=sk-dein_key_hier
```

### Vercel Deployment:
1. Vercel Dashboard → Projekt → Settings → Environment Variables
2. Name: `OPENAI_API_KEY`
3. Value: Dein API Key
4. Redeploy

## 🐛 Troubleshooting

### "API Key fehlt" Fehler
- Prüfe ob `.env.local` existiert und den richtigen Key enthält
- Bei Vercel: Prüfe Environment Variables im Dashboard

### Website lädt nicht
- Prüfe Konsole auf JavaScript-Fehler
- Stelle sicher dass `public/data.json` existiert

### API Fehler 429
- OpenAI Rate Limit erreicht - warte kurz und versuche es erneut
- Eventuell API Key Limits prüfen

### Styling-Probleme
- Hard-Refresh mit Ctrl+F5 (Windows) oder Cmd+Shift+R (Mac)
- Prüfe ob alle CSS-Dateien korrekt geladen werden

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

- Inspiriert von Lovable.dev
- Powered by OpenAI GPT-4
- Built with Vanilla JavaScript
- Hosted on Vercel

---

**Happy Coding! 🎉**

Bei Fragen oder Problemen, erstelle gerne ein Issue im Repository.
