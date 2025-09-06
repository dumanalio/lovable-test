class ProfessionalWebsiteBuilder {
    constructor() {
        this.currentHTML = this.getInitialHTML();
        this.chatHistory = [];
        this.currentSiteId = null;
        this.isGenerating = false;
        this.sessionId = this.getOrCreateSessionId();
        this.preferences = {
            websiteType: null,
            style: 'modern',
            industry: null
        };
        
        this.initializeElements();
        this.attachEventListeners();
        this.updatePreview();
        this.showProfessionalWelcome();
        
        console.log('🚀 Professional Website Builder initialized with session:', this.sessionId);
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

        // Validate critical elements
        const criticalElements = [this.chatInput, this.sendButton, this.chatMessagesContainer, this.previewFrame];
        const missingElements = criticalElements.filter(el => !el);
        if (missingElements.length > 0) {
            console.error('❌ Critical UI elements missing');
        }
    }

    attachEventListeners() {
        // Enhanced input handling
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && !this.isGenerating) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize and character counter
            this.chatInput.addEventListener('input', () => {
                this.updateInputState();
            });
        }

        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
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

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.sendMessage();
                        break;
                    case 'k':
                        e.preventDefault();
                        this.clearChat();
                        break;
                }
            }
        });
    }

    getInitialHTML() {
        return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Website</title>
    <style>
        :root {
            --primary-color: #3b82f6;
            --secondary-color: #1e293b;
            --background-color: #ffffff;
            --text-color: #334155;
            --border-color: #e2e8f0;
            --spacing-unit: 8px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--background-color);
            min-height: 100vh;
        }
        
        .container { 
            max-width: 1200px;
            margin: 0 auto;
            padding: calc(var(--spacing-unit) * 3);
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Professionelle Website wird hier erstellt -->
    </div>
</body>
</html>`;
    }


    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isGenerating) return;

        // Validate input
        if (message.length < 3) {
            this.showToast('Beschreibung zu kurz. Bitte mehr Details angeben.', 'warning');
            return;
        }

        this.isGenerating = true;
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.updateInputState();
        this.showLoading('KI erstellt professionelle Website...');

        try {
            const startTime = Date.now();
            
            const response = await fetch('/.netlify/functions/chat-handler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    currentHTML: this.currentHTML,
                    preferences: this.preferences,
                    sessionId: this.sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

            if (data.success) {
                this.currentHTML = data.html;
                this.updatePreview();
                
                // Enhanced success message with detailed metrics
                const metrics = data.metrics || {};
                const intent = data.intent || {};
                
                this.addMessage(`✅ **${data.message}** (${processingTime}s)`, 'bot');
                
                // Show detailed metrics if available
                if (metrics.qualityScore) {
                    this.addMessage(`📊 **Qualitäts-Score:** ${metrics.qualityScore}/100 | **Zeilen:** ${metrics.codeLines} | **Geschätzte Ladezeit:** ${metrics.estimatedLoadTime}ms`, 'bot');
                }
                
                // Show detected intent
                if (intent.websiteType && intent.confidence) {
                    this.addMessage(`🎯 **Erkannt:** ${intent.websiteType} (${intent.confidence}% Sicherheit) | **Branche:** ${intent.industry}`, 'bot');
                    
                    // Update preferences based on detected intent
                    this.preferences.websiteType = intent.websiteType;
                    this.preferences.industry = intent.industry;
                }
                
                // Add intelligent suggestions
                if (data.suggestions && data.suggestions.length > 0) {
                    setTimeout(() => {
                        const suggestion = data.suggestions[Math.floor(Math.random() * data.suggestions.length)];
                        this.addMessage(`💡 **Nächster Schritt:** ${suggestion}`, 'bot');
                    }, 1500);
                }

                // Show next steps if available
                if (data.nextSteps && data.nextSteps.length > 0) {
                    setTimeout(() => {
                        const nextStep = data.nextSteps[0]; // Show first next step
                        this.addMessage(`🚀 **Empfehlung:** ${nextStep}`, 'bot');
                    }, 2500);
                }

                // Track in enhanced history for context
                this.chatHistory.push({
                    message,
                    intent: data.intent,
                    metrics: data.metrics,
                    timestamp: new Date().toISOString()
                });

                this.showToast('Website erfolgreich aktualisiert!', 'success');
            } else {
                throw new Error(data.error || 'Unbekannter Fehler');
            }

        } catch (error) {
            console.error('❌ Generation Error:', error);
            
            let errorMessage = '❌ **Fehler aufgetreten:** ';
            let errorType = 'error';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Netzwerkverbindung unterbrochen. Bitte erneut versuchen.';
            } else if (error.message.includes('500')) {
                errorMessage += 'Server-Fehler. API-Konfiguration prüfen.';
                errorType = 'warning';
            } else if (error.message.includes('401')) {
                errorMessage += 'API-Authentifizierung fehlgeschlagen.';
            } else if (error.message.includes('429')) {
                errorMessage += 'API-Limit erreicht. Kurz warten und erneut versuchen.';
                errorType = 'warning';
            } else {
                errorMessage += error.message;
            }
            
            this.addMessage(errorMessage, 'bot');
            this.showToast('Fehler beim Generieren der Website', errorType);
        } finally {
            this.isGenerating = false;
            this.hideLoading();
            this.updateInputState();
        }
    }

    addMessage(content, sender) {
        if (!this.chatMessagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Enhanced markdown support
        let formattedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');
        
        if (formattedContent !== content) {
            messageContent.innerHTML = formattedContent;
        } else {
            messageContent.textContent = content;
        }
        
        messageDiv.appendChild(messageContent);
        this.chatMessagesContainer.appendChild(messageDiv);
        
        // Smooth scroll with animation
        requestAnimationFrame(() => {
            this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
        });
    }

    addSpacer() {
        const spacer = document.createElement('div');
        spacer.style.height = '8px';
        this.chatMessagesContainer.appendChild(spacer);
    }

    updatePreview() {
        if (!this.previewFrame) return;

        try {
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            this.previewFrame.onload = () => {
                // Add subtle loading indicator
                this.previewFrame.style.opacity = '1';
            };
            
            this.previewFrame.style.opacity = '0.8';
            this.previewFrame.src = url;
            
            // Cleanup
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            
        } catch (error) {
            console.error('❌ Preview Update Error:', error);
            this.showToast('Vorschau konnte nicht aktualisiert werden', 'error');
        }
    }

    updateInputState() {
        if (!this.chatInput || !this.sendButton) return;

        const hasContent = this.chatInput.value.trim().length > 0;
        const isReady = hasContent && !this.isGenerating;

        this.sendButton.disabled = !isReady;
        this.sendButton.style.opacity = isReady ? '1' : '0.5';
        
        // Visual feedback for input state
        this.chatInput.style.borderColor = hasContent ? '#3b82f6' : '#d1d5db';
    }


    async downloadWebsite() {
        try {
            const timestamp = new Date().toISOString().slice(0, 16).replace(/:/g, '-');
            const filename = `professional-website-${timestamp}.html`;
            
            const blob = new Blob([this.currentHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addMessage(`📥 **Website heruntergeladen:** ${filename}`, 'bot');
            this.showToast('Website erfolgreich heruntergeladen!', 'success');
            
        } catch (error) {
            console.error('❌ Download Error:', error);
            this.addMessage('❌ **Download fehlgeschlagen.** Browser-Einstellungen prüfen.', 'bot');
            this.showToast('Download fehlgeschlagen', 'error');
        }
    }

    async publishWebsite() {
        this.showLoading('Website wird veröffentlicht...');
        
        try {
            const response = await fetch('/.netlify/functions/website-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: this.currentHTML,
                    siteName: `professional-site-${Date.now()}`
                })
            });

            const data = await response.json();

            if (data.success) {
                this.currentSiteId = data.siteId;
                this.addMessage(`🚀 **Website live!** Preview: ${data.previewUrl}`, 'bot');
                this.showToast('Website erfolgreich veröffentlicht!', 'success');
            } else {
                throw new Error(data.error || 'Veröffentlichung fehlgeschlagen');
            }

        } catch (error) {
            console.error('❌ Publish Error:', error);
            this.addMessage('❌ **Veröffentlichung fehlgeschlagen.** Server-Konfiguration prüfen.', 'bot');
            this.showToast('Veröffentlichung fehlgeschlagen', 'error');
        } finally {
            this.hideLoading();
        }
    }

    showLoading(message = 'Verarbeitung läuft...') {
        if (this.loadingOverlay) {
            this.loadingOverlay.querySelector('p').textContent = message;
            this.loadingOverlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        // Create toast container if doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
            `;
            document.body.appendChild(toastContainer);
        }

        // Create toast
        const toast = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
            font-size: 0.875rem;
            font-weight: 500;
            pointer-events: auto;
        `;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    // Session Management
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('websiteBuilderSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
            localStorage.setItem('websiteBuilderSessionId', sessionId);
        }
        return sessionId;
    }

    // Enhanced Clear Chat with session reset
    clearChat() {
        if (!this.chatMessagesContainer) return;

        // Smooth clear animation
        this.chatMessagesContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            this.chatMessagesContainer.innerHTML = '';
            this.chatHistory = [];
            this.currentHTML = this.getInitialHTML();
            this.preferences = {
                websiteType: null,
                style: 'modern',
                industry: null
            };
            this.updatePreview();
            this.showProfessionalWelcome();
            this.chatMessagesContainer.style.opacity = '1';
        }, 150);

        this.showToast('Chat und Session zurückgesetzt', 'info');
    }

    // Enhanced Welcome with more detailed instructions
    showProfessionalWelcome() {
        const welcomeMessages = [
            "👋 **Willkommen beim Enhanced AI Website Builder**",
            "",
            "🎯 **Was möchten Sie erstellen?**",
            "• **E-Commerce:** 'Erstelle einen Online-Shop für Kleidung'",
            "• **Landing Page:** 'Baue eine Conversion-optimierte Landing Page'", 
            "• **Portfolio:** 'Erstelle ein Designer-Portfolio mit Galerie'",
            "• **Corporate:** 'Baue eine professionelle Unternehmensseite'",
            "• **Restaurant:** 'Erstelle eine Website für mein Restaurant'",
            "",
            "💡 **Profi-Features:**",
            "• Automatische Intent-Erkennung mit Confidence-Scoring",
            "• Branchenspezifische Templates und Optimierungen",
            "• Real-time Qualitäts-Scoring und Performance-Metriken",
            "• Intelligente Vorschläge für nächste Schritte",
            "",
            "⚡ **Shortcuts:** Strg+Enter (Senden) • Strg+K (Chat leeren)"
        ];

        this.chatMessagesContainer.innerHTML = '';
        
        welcomeMessages.forEach(msg => {
            if (msg === "") {
                this.addSpacer();
            } else {
                this.addMessage(msg, 'bot');
            }
        });
    }
}

// Initialize Professional Website Builder
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalWebsiteBuilder();
});
