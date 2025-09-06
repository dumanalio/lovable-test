/**
 * API Client für die Kommunikation mit Netlify Functions
 */
class APIClient {
    constructor() {
        this.baseURL = '/.netlify/functions';
    }

    /**
     * Sendet eine Chat-Nachricht an die KI
     * @param {string} message - Die Benutzer-Nachricht
     * @param {string} currentHTML - Aktueller HTML-Code
     * @returns {Promise<Object>} API-Response
     */
    async sendChatMessage(message, currentHTML = '') {
        try {
            const response = await fetch(`${this.baseURL}/chat-handler`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    currentHTML
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Chat API Error:', error);
            throw new Error('Fehler bei der Kommunikation mit der KI');
        }
    }

    /**
     * Generiert und speichert eine Website
     * @param {string} html - HTML-Code der Website
     * @param {string} siteName - Name der Website
     * @returns {Promise<Object>} API-Response mit Site-ID und Preview-URL
     */
    async generateWebsite(html, siteName = 'my-website') {
        try {
            const response = await fetch(`${this.baseURL}/website-generator`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html,
                    siteName: this.sanitizeSiteName(siteName)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Website Generation Error:', error);
            throw new Error('Fehler beim Generieren der Website');
        }
    }

    /**
     * Bereinigt den Website-Namen für sichere Dateinamen
     * @param {string} name - Ursprünglicher Name
     * @returns {string} Bereinigter Name
     */
    sanitizeSiteName(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50) || 'website';
    }

    /**
     * Hilfsfunktion für allgemeine API-Aufrufe
     * @param {string} endpoint - API-Endpunkt
     * @param {Object} options - Fetch-Optionen
     * @returns {Promise<Object>} API-Response
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}/${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error(`API Request Error (${endpoint}):`, error);
            throw error;
        }
    }
}

// Export für Module oder globale Nutzung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
} else {
    window.APIClient = APIClient;
}
