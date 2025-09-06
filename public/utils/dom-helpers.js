/**
 * DOM Helper Funktionen für bessere Code-Organisation
 */
class DOMHelpers {
    
    /**
     * Erstellt ein HTML-Element mit Attributen und Inhalt
     * @param {string} tag - HTML-Tag
     * @param {Object} attributes - Element-Attribute
     * @param {string|HTMLElement|Array} content - Inhalt des Elements
     * @returns {HTMLElement} Erstelltes Element
     */
    static createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Attribute setzen
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset') {
                Object.keys(attributes[key]).forEach(dataKey => {
                    element.dataset[dataKey] = attributes[key][dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // Inhalt hinzufügen
        if (typeof content === 'string') {
            element.textContent = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                }
            });
        }
        
        return element;
    }

    /**
     * Zeigt eine Toast-Nachricht an
     * @param {string} message - Nachricht
     * @param {string} type - Typ (success, error, warning, info)
     * @param {number} duration - Anzeigedauer in ms
     */
    static showToast(message, type = 'info', duration = 3000) {
        // Toast-Container erstellen falls nicht vorhanden
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = this.createElement('div', {
                id: 'toast-container',
                className: 'toast-container',
                style: `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `
            });
            document.body.appendChild(toastContainer);
        }

        // Toast-Element erstellen
        const toast = this.createElement('div', {
            className: `toast toast-${type}`,
            style: `
                background: ${this.getToastColor(type)};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            `
        }, message);

        toastContainer.appendChild(toast);

        // Animation einblenden
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });

        // Toast nach bestimmter Zeit entfernen
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    /**
     * Hilfsfunktion für Toast-Farben
     * @param {string} type - Toast-Typ
     * @returns {string} CSS-Farbe
     */
    static getToastColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    /**
     * Smooth Scroll zu einem Element
     * @param {string|HTMLElement} target - Ziel-Element oder Selektor
     * @param {number} offset - Offset vom Top
     */
    static scrollToElement(target, offset = 0) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Debounce-Funktion für Performance-Optimierung
     * @param {Function} func - Zu debounce-de Funktion
     * @param {number} wait - Wartezeit in ms
     * @param {boolean} immediate - Sofort ausführen
     * @returns {Function} Debounced-Funktion
     */
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * Formatiert Dateigröße
     * @param {number} bytes - Dateigröße in Bytes
     * @param {number} decimals - Anzahl Dezimalstellen
     * @returns {string} Formatierte Größe
     */
    static formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Kopiert Text in die Zwischenablage
     * @param {string} text - Zu kopierender Text
     * @returns {Promise<boolean>} Erfolgsstatus
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback für ältere Browser
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (err) {
            console.error('Clipboard copy failed:', err);
            return false;
        }
    }

    /**
     * Validiert eine E-Mail-Adresse
     * @param {string} email - E-Mail-Adresse
     * @returns {boolean} Gültigkeit
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Escaped HTML-Sonderzeichen
     * @param {string} unsafe - Unsicherer String
     * @returns {string} Escaped String
     */
    static escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /**
     * Loading-State für Buttons
     * @param {HTMLElement} button - Button-Element
     * @param {boolean} loading - Loading-Status
     * @param {string} loadingText - Text während Loading
     */
    static setButtonLoading(button, loading, loadingText = 'Lädt...') {
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
            button.classList.remove('loading');
            delete button.dataset.originalText;
        }
    }
}

// Export für Module oder globale Nutzung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMHelpers;
} else {
    window.DOMHelpers = DOMHelpers;
}
