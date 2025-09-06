class WebsiteBuilder {
    constructor() {
        this.currentHTML = this.getInitialHTML();
        this.chatMessages = [];
        this.currentSiteId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updatePreview();
        
        // Zeige hilfreiche Beispiele in der ersten Bot-Nachricht
        this.showInitialExamples();
        
        console.log('✅ WebsiteBuilder initialized');
    }

    initializeElements() {
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessagesContainer = document.getElementById('chatMessages');
        this.previewFrame = document.getElementById('previewFrame');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.clearChatButton = document.getElementById('clearChat');
        this.downloadButton = document.getElementById('downloadSite');
        this.publishButton = document.getElementById('publishSite');
    }

    attachEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        if (this.clearChatButton) {
            this.clearChatButton.addEventListener('click', () => this.clearChat());
        }
        
        if (this.downloadButton) {
            this.downloadButton.addEventListener('click', () => this.downloadWebsite());
        }
        
        if (this.publishButton) {
            this.publishButton.addEventListener('click', () => this.publishWebsite());
        }
    }

    getInitialHTML() {
        return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Website</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #ffffff;
            min-height: 100vh;
        }
        
        .container { 
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hier wird deine Website erstellt -->
    </div>
</body>
</html>`;
    }

    showInitialExamples() {
        // Entferne die Standard-Willkommensnachricht
        const existingMessages = this.chatMessagesContainer.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Füge verbesserte Beispiele hinzu
        const examples = [
            "👋 Hallo! Ich helfe dir beim Erstellen deiner Website. Hier sind einige Beispiele:",
            "",
            "📍 **Position**: 'Schreibe oben links Willkommen' oder 'Erstelle mittig einen großen Titel'",
            "",
            "📝 **Content**: 'Füge eine Überschrift hinzu' oder 'Erstelle drei Spalten nebeneinander'",
            "",
            "🎨 **Design**: 'Mache den Hintergrund blau' oder 'Erstelle eine moderne Navigation'",
            "",
            "🏗️ **Layout**: 'Erstelle Header, Main und Footer' oder 'Zwei Bereiche nebeneinander'",
            "",
            "💡 **Tipp**: Sprich einfach natürlich! Zum Beispiel: 'Ich möchte eine Visitenkarte mit meinem Namen in der Mitte'"
        ];

        examples.forEach(example => {
            if (example === "") {
                // Leere Zeile für bessere Lesbarkeit
                const spacer = document.createElement('div');
                spacer.style.height = '5px';
                this.chatMessagesContainer.appendChild(spacer);
            } else {
                this.addMessage(example, 'bot');
            }
        });
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Benutzer-Nachricht hinzufügen
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showLoading();

        try {
            const response = await fetch('/.netlify/functions/chat-handler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    currentHTML: this.currentHTML
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                this.currentHTML = data.html;
                this.updatePreview();
                this.addMessage('✅ Website wurde erfolgreich aktualisiert!', 'bot');
                
                // Füge hilfreiche Nachfolge-Vorschläge hinzu
                this.addFollowUpSuggestions();
            } else {
                throw new Error(data.error || 'Unbekannter Fehler');
            }

        } catch (error) {
            console.error('❌ Fehler:', error);
            
            let errorMessage = '❌ ';
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Verbindung fehlgeschlagen. Prüfe deine Internetverbindung.';
            } else if (error.message.includes('500')) {
                errorMessage += 'Server-Fehler. Prüfe die OpenAI API-Konfiguration.';
            } else if (error.message.includes('401')) {
                errorMessage += 'API-Key ungültig. Prüfe deine OpenAI Konfiguration.';
            } else {
                errorMessage += error.message;
            }
            
            this.addMessage(errorMessage, 'bot');
        } finally {
            this.hideLoading();
        }
    }

    addFollowUpSuggestions() {
        const suggestions = [
            "💡 Weitere Ideen: 'Ändere die Farbe', 'Füge ein Bild hinzu', 'Erstelle einen Button', 'Verbessere das Design'"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        
        setTimeout(() => {
            this.addMessage(randomSuggestion, 'bot');
        }, 1000);
    }

    addMessage(content, sender) {
        if (!this.chatMessagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Unterstütze einfache Markdown-ähnliche Formatierung
        let formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        if (formattedContent.includes('<strong>') || formattedContent.includes('<em>')) {
            messageContent.innerHTML = formattedContent;
        } else {
            messageContent.textContent = content;
        }
        
        messageDiv.appendChild(messageContent);
        this.chatMessagesContainer.appendChild(messageDiv);
        
        // Smooth scroll zum neuesten Message
        this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }

    updatePreview() {
        if (!this.previewFrame) return;

        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            this.previewFrame.src = url;
            
            // Cleanup nach kurzer Zeit
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error('❌ Preview Update Fehler:', error);
        }
    }

    clearChat() {
        if (!this.chatMessagesContainer) return;

        // Alle Nachrichten entfernen
        this.chatMessagesContainer.innerHTML = '';
        
        // HTML zurücksetzen
        this.currentHTML = this.getInitialHTML();
        this.updatePreview();
        
        // Beispiele erneut anzeigen
        this.showInitialExamples();
        
        console.log('🗑️ Chat geleert');
    }

    async downloadWebsite() {
        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `website-${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addMessage('📥 Website wurde heruntergeladen!', 'bot');
        } catch (error) {
            console.error('❌ Download-Fehler:', error);
            this.addMessage('❌ Fehler beim Herunterladen der Website.', 'bot');
        }
    }

    async publishWebsite() {
        this.showLoading();
        
        try {
            const response = await fetch('/.netlify/functions/website-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: this.currentHTML,
                    siteName: 'generated-website'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentSiteId = data.siteId;
                this.addMessage(`🚀 Website wurde veröffentlicht! Preview-URL: ${data.previewUrl}`, 'bot');
            } else {
                throw new Error(data.error || 'Fehler beim Veröffentlichen');
            }

        } catch (error) {
            console.error('❌ Publish-Fehler:', error);
            this.addMessage('❌ Fehler beim Veröffentlichen der Website.', 'bot');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('hidden');
        }
        if (this.sendButton) {
            this.sendButton.disabled = true;
            this.sendButton.textContent = 'Lädt...';
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
        }
        if (this.sendButton) {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Senden';
        }
    }
}

// App initialisieren
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteBuilder();
});
