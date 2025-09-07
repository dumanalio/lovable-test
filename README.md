# Lovable - AI-Powered Website Builder

Eine moderne React-Anwendung für den Bau von Websites mit KI-Unterstützung. Erstellt mit Vite, React 19, Tailwind CSS und Framer Motion.

## 🚀 Features

- **AI-Powered Code Generation**: Integrierte Chat-Schnittstelle für die Generierung von React-Komponenten
- **Responsive Design**: Vollständig responsive mit Tailwind CSS
- **Productivity Dashboard**: Timer, Notizen und Produktivitäts-Tools
- **Logo Management**: Upload und Verwaltung von Logos mit Größenkontrolle
- **Modern UI**: Glatte Animationen mit Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **Icons**: Lucide React 0.542.0
- **AI Integration**: OpenAI GPT-4o-mini

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build

# Lokale Vorschau des Builds
npm run preview
```

## 🚀 Deployment auf Netlify

### Automatisches Deployment

1. **Repository auf GitHub/GitLab pushen**
2. **Netlify Account erstellen** (falls noch nicht vorhanden)
3. **Neue Site erstellen**:
   - Repository verbinden
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. **Deploy starten**

### Manuelles Deployment

```bash
# Build erstellen
npm run build

# Dist-Ordner auf Netlify deployen
# (über Netlify Dashboard oder CLI)
```

## ⚙️ Konfiguration

### Environment Variables

Für die OpenAI-Integration können Sie einen API-Key setzen:

```bash
# In Netlify Dashboard unter Site Settings > Environment Variables
OPENAI_API_KEY=your_api_key_here
```

### Build Settings

Die Netlify-Konfiguration ist in `netlify.toml` definiert:

- Build Command: `npm run build`
- Publish Directory: `dist`
- Node Version: 18.17.0

## 📁 Projektstruktur

```
src/
├── components/     # React-Komponenten
├── contexts/       # React Context Provider
├── hooks/         # Custom Hooks
├── utils/         # Utility-Funktionen
├── assets/        # Statische Assets
└── main.jsx       # App Entry Point

public/            # Statische Dateien
dist/             # Build Output (nach npm run build)
```

## 🔧 Verfügbare Scripts

```bash
npm run dev      # Entwicklungsserver
npm run build    # Produktionsbuild
npm run preview  # Lokale Vorschau des Builds
npm run lint     # ESLint Code-Checking
npm run clean    # Dist-Ordner löschen
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 Lizenz

ISC License
