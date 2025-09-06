class WebsiteBuilder {
    constructor() {
        this.currentHTML = this.getInitialHTML();
        this.chatMessages = [];
        this.currentSiteId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updatePreview();
    }

    initializeElements() {
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.previewFrame = document.getElementById('previewFrame');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.clearChatButton = document.getElementById('clearChat');
        this.downloadButton = document.getElementById('downloadSite');
        this.publishButton = document.getElementById('publishSite');
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.clearChatButton.addEventListener('click', () => this.clearChat());
        this.downloadButton.addEventListener('click', () => this.downloadWebsite());
        this.publishButton.addEventListener('click', () => this.publishWebsite());
    }

    getInitialHTML() {
        return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine Website</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Willkommen auf meiner Website!</h1>
        <p>Diese Website wird durch KI erstellt. Gib Anweisungen im Chat ein, um sie zu bearbeiten.</p>
    </div>
</body>
</html>`;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Benutzer-Nachricht hinzufügen
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showLoading();

        try {
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

            const data = await response.json();

            if (data.success) {
                this.currentHTML = data.html;
                this.updatePreview();
                this.addMessage('✅ Website wurde erfolgreich aktualisiert!', 'bot');
            } else {
                throw new Error(data.error || 'Unbekannter Fehler');
            }

        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
            this.addMessage('❌ Entschuldigung, es gab einen Fehler beim Verarbeiten deiner Anfrage.', 'bot');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll zum neuesten Message
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updatePreview() {
        const blob = new Blob([this.currentHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        this.previewFrame.src = url;
    }

    clearChat() {
        // Alle Nachrichten außer der ersten (Willkommensnachricht) entfernen
        const messages = this.chatMessages.querySelectorAll('.message');
        for (let i = 1; i < messages.length; i++) {
            messages[i].remove();
        }
        
        // HTML zurücksetzen
        this.currentHTML = this.getInitialHTML();
        this.updatePreview();
    }

    async downloadWebsite() {
        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'meine-website.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addMessage('📥 Website wurde heruntergeladen!', 'bot');
        } catch (error) {
            console.error('Download-Fehler:', error);
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
            } else {
                throw new Error(data.error || 'Fehler beim Veröffentlichen');
            }

        } catch (error) {
            console.error('Publish-Fehler:', error);
            this.addMessage('❌ Fehler beim Veröffentlichen der Website.', 'bot');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        this.loadingOverlay.classList.remove('hidden');
        this.sendButton.disabled = true;
    }

    hideLoading() {
        this.loadingOverlay.classList.add('hidden');
        this.sendButton.disabled = false;
    }
}

// App initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteBuilder();
});
