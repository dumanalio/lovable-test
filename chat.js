// DOM-Elemente
const chatLog = document.getElementById("chat-log");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const loadingIndicator = document.getElementById("loading-indicator");

// Chat-Status
let isGenerating = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeChat();
  loadInitialWebsite();
});

function initializeChat() {
  // Send-Button Event
  chatSend.addEventListener("click", handleSendMessage);
  
  // Enter-Taste im Textarea (Shift+Enter für neue Zeile)
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  
  // Input-Überwachung für Button-Status
  chatInput.addEventListener("input", updateSendButtonState);
  
  // Initial Button-Status setzen
  updateSendButtonState();
}

function updateSendButtonState() {
  const hasText = chatInput.value.trim().length > 0;
  chatSend.disabled = !hasText || isGenerating;
}

async function handleSendMessage() {
  const text = chatInput.value.trim();
  if (!text || isGenerating) return;

  try {
    // UI für Senden vorbereiten
    addMessageToLog("user", text);
    chatInput.value = "";
    setGeneratingState(true);
    
    // API-Aufruf
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ input: text })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Erfolgreiche Antwort verarbeiten
    addMessageToLog("assistant", "✅ Website wurde erfolgreich aktualisiert!");
    
    // Website rendern
    window.currentWebsiteData = data;
    renderPage(data);
    
  } catch (error) {
    console.error("Fehler beim Generieren:", error);
    addMessageToLog("error", `❌ Fehler: ${error.message}`);
    
    // Fallback: Beispiel-Fehlermeldungen
    if (error.message.includes('401')) {
      addMessageToLog("error", "🔑 API-Schlüssel fehlt oder ungültig. Bitte OpenAI API Key in den Umgebungsvariablen setzen.");
    } else if (error.message.includes('429')) {
      addMessageToLog("error", "⏱️ API-Limit erreicht. Bitte versuche es später erneut.");
    } else if (error.message.includes('500')) {
      addMessageToLog("error", "🔧 Server-Fehler. Bitte versuche es erneut.");
    }
  } finally {
    setGeneratingState(false);
  }
}

function addMessageToLog(type, message) {
  const messageDiv = document.createElement("div");
  
  switch (type) {
    case "user":
      messageDiv.className = "user-message";
      messageDiv.innerHTML = `<strong>Du:</strong> ${escapeHtml(message)}`;
      break;
    case "assistant":
      messageDiv.className = "assistant-message";
      messageDiv.innerHTML = `<strong>🤖 Assistent:</strong> ${escapeHtml(message)}`;
      break;
    case "error":
      messageDiv.className = "error-message";
      messageDiv.innerHTML = `<strong>⚠️ Fehler:</strong> ${escapeHtml(message)}`;
      break;
    case "system":
      messageDiv.className = "system-message";
      messageDiv.innerHTML = `<strong>ℹ️ System:</strong> ${escapeHtml(message)}`;
      break;
    default:
      messageDiv.className = "assistant-message";
      messageDiv.innerHTML = escapeHtml(message);
  }
  
  chatLog.appendChild(messageDiv);
  
  // Auto-scroll zum neuesten Message
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setGeneratingState(generating) {
  isGenerating = generating;
  
  if (generating) {
    loadingIndicator.classList.remove("hidden");
    chatSend.disabled = true;
    chatInput.disabled = true;
    chatSend.innerHTML = `
      <div class="spinner"></div>
      Generiere...
    `;
  } else {
    loadingIndicator.classList.add("hidden");
    chatInput.disabled = false;
    chatSend.innerHTML = `
      <span class="send-icon">📤</span>
      Absenden
    `;
    updateSendButtonState();
  }
}

async function loadInitialWebsite() {
  try {
    addMessageToLog("system", "Lade Beispiel-Website...");
    
    const response = await fetch("/data.json");
    
    if (!response.ok) {
      throw new Error("Beispiel-Daten konnten nicht geladen werden");
    }
    
    const data = await response.json();
    
    // Website rendern
    window.currentWebsiteData = data;
    renderPage(data);
    
    addMessageToLog("system", "✅ Beispiel-Website geladen! Du kannst jetzt Änderungen beschreiben.");
    
  } catch (error) {
    console.error("Fehler beim Laden der initialen Website:", error);
    addMessageToLog("error", `Fehler beim Laden der Beispiel-Website: ${error.message}`);
    
    // Fallback: Minimale Website erstellen
    const fallbackData = {
      blocks: [
        {
          type: "hero",
          headline: "Willkommen bei Lovable Light",
          sub: "Dein No-Code Website Builder ist bereit!",
          ctaText: "Jetzt starten",
          ctaLink: "#"
        }
      ]
    };
    
    window.currentWebsiteData = fallbackData;
    renderPage(fallbackData);
    addMessageToLog("system", "Fallback-Website geladen. Beschreibe deine Wunsch-Website!");
  }
}

// Utility-Funktion für HTML-Escaping
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Chat-Vorschläge (Optional)
function addQuickSuggestions() {
  const suggestions = [
    "Erstelle eine Landingpage für ein Restaurant",
    "Baue eine Portfolio-Website für einen Fotografen",
    "Erstelle eine Unternehmens-Website mit Kontaktformular",
    "Baue eine Produktseite mit Preistabelle",
    "Erstelle eine FAQ-Seite für einen Online-Shop"
  ];
  
  const suggestionsDiv = document.createElement("div");
  suggestionsDiv.className = "chat-suggestions";
  suggestionsDiv.innerHTML = `
    <p><strong>💡 Vorschläge zum Ausprobieren:</strong></p>
    ${suggestions.map(suggestion => 
      `<button class="suggestion-btn" onclick="useSuggestion('${suggestion}')">${suggestion}</button>`
    ).join('')}
  `;
  
  chatLog.appendChild(suggestionsDiv);
}

function useSuggestion(suggestion) {
  chatInput.value = suggestion;
  updateSendButtonState();
  chatInput.focus();
}

// Erweiterte Funktionen
function clearChat() {
  chatLog.innerHTML = `
    <div class="system-message">
      <strong>🤖 Assistent:</strong> Chat wurde geleert. Wie kann ich dir helfen?
    </div>
  `;
}

function exportWebsite() {
  if (window.currentWebsiteData) {
    const dataStr = JSON.stringify(window.currentWebsiteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'website-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    addMessageToLog("system", "📁 Website-Daten wurden exportiert!");
  } else {
    addMessageToLog("error", "Keine Website-Daten zum Exportieren vorhanden.");
  }
}

// Globale Funktionen verfügbar machen
window.useSuggestion = useSuggestion;
window.clearChat = clearChat;
window.exportWebsite = exportWebsite;
