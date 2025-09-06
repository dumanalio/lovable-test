class WebsiteBuilder {
    constructor() {
        this.currentHTML = this.getInitialHTML();
        this.chatMessages = [];
        this.currentSiteId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updatePreview();
        
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

        // Prüfe ob alle Elemente gefunden wurden
        const elements = {
            chatInput: this.chatInput,
            sendButton: this.sendButton,
            chatMessages: this.chatMessagesContainer,
            previewFrame: this.previewFrame
        };

        Object.keys(elements).forEach(key => {
            if (!elements[key]) {
                console.error(`❌ Element nicht gefunden: ${key}`);
            }
        });
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
    <title>Meine Website</title>
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
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container { 
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
        }

        h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        p {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 2rem;
        }

        .highlight {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: inline-block;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Willkommen auf meiner Website!</h1>
        <p>Diese Website wird durch KI erstellt. Gib Anweisungen im Chat ein, um sie zu bearbeiten.</p>
        <div class="highlight">
            Bereit für deine Anweisungen! ✨
        </div>
    </div>
</body>
</html>`;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) {
            console.log('⚠️ Leere Nachricht');
            return;
        }

        console.log('📤 Sende Nachricht:', message);

        // Benutzer-Nachricht hinzufügen
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showLoading();

        try {
            console.log('🔄 API-Aufruf startet...');
            
            // API-Aufruf an die Chat-Handler-Funktion
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

            console.log('📡 Response Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📥 API Response:', data);

            if (data.success) {
                this.currentHTML = data.html;
                this.updatePreview();
                this.addMessage('✅ Website wurde erfolgreich aktualisiert!', 'bot');
                console.log('✅ Website aktualisiert');
            } else {
                throw new Error(data.error || 'Unbekannter Fehler');
            }

        } catch (error) {
            console.error('❌ Fehler beim Senden der Nachricht:', error);
            
            let errorMessage = '❌ Entschuldigung, es gab einen Fehler: ';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Verbindung zur API fehlgeschlagen. Prüfe deine Internetverbindung.';
            } else if (error.message.includes('500')) {
                errorMessage += 'Server-Fehler. Prüfe deine OpenAI API-Konfiguration.';
            } else {
                errorMessage += error.message;
            }
            
            this.addMessage(errorMessage, 'bot');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(content, sender) {
        if (!this.chatMessagesContainer) {
            console.error('❌ Chat Messages Container nicht gefunden');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.chatMessagesContainer.appendChild(messageDiv);
        
        // Scroll zum neuesten Message
        this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }

    updatePreview() {
        if (!this.previewFrame) {
            console.error('❌ Preview Frame nicht gefunden');
            return;
        }

        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            this.previewFrame.src = url;
            
            // Cleanup der alten URL nach kurzer Zeit
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            console.log('🖼️ Preview aktualisiert');
        } catch (error) {
            console.error('❌ Preview Update Fehler:', error);
        }
    }

    clearChat() {
        if (!this.chatMessagesContainer) return;

        // Alle Nachrichten außer der ersten (Willkommensnachricht) entfernen
        const messages = this.chatMessagesContainer.querySelectorAll('.message');
        for (let i = 1; i < messages.length; i++) {
            messages[i].remove();
        }
        
        // HTML zurücksetzen
        this.currentHTML = this.getInitialHTML();
        this.updatePreview();
        
        console.log('🗑️ Chat geleert');
    }

    async downloadWebsite() {
        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `meine-website-${Date.now()}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addMessage('📥 Website wurde heruntergeladen!', 'bot');
            console.log('⬇️ Website heruntergeladen');
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
                    siteName: 'my-generated-site'
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentSiteId = data.siteId;
                this.addMessage(`🚀 Website wurde veröffentlicht! Vorschau: ${data.previewUrl}`, 'bot');
                console.log('🌐 Website veröffentlicht');
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

// App initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM geladen, initialisiere App...');
    try {
        new WebsiteBuilder();
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren der App:', error);
    }
});
