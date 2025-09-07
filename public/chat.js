// Enhanced Chat.js mit verbesserter UX für No-Coder

// DOM Elemente
const messagesContainer = document.getElementById("chat-messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const charCount = document.getElementById("char-count");
const typingIndicator = document.getElementById("typing-indicator");
const chatWelcome = document.getElementById("chat-welcome");
const previewStatus = document.getElementById("preview-status");
const statusIndicator = previewStatus?.querySelector('.status-indicator');

// State Management
let isProcessing = false;
let conversationHistory = [];

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  initializeChat();
  setupEventListeners();
  setupExamplePrompts();
});

function initializeChat() {
  // Auto-resize für Textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    
    // Character count
    const length = input.value.length;
    charCount.textContent = `${length}/500`;
    charCount.style.color = length > 450 ? '#ef4444' : '#9ca3af';
    
    // Send button state
    sendBtn.disabled = !input.value.trim() || length > 500 || isProcessing;
  });
  
  // Initial state
  updateSendButton();
  updateStatus('ready', 'Bereit für Eingaben');
}

function setupEventListeners() {
  // Send button click
  sendBtn.addEventListener("click", handleSendMessage);
  
  // Enter key (ohne Shift für senden)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) {
        handleSendMessage();
      }
    }
  });
  
  // Header buttons
  document.getElementById('save-btn')?.addEventListener('click', handleSave);
  document.getElementById('export-btn')?.addEventListener('click', handleExport);
  document.getElementById('refresh-preview')?.addEventListener('click', handleRefreshPreview);
  
  // Device buttons
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      handleDeviceChange(e.target.dataset.device);
    });
  });
}

function setupExamplePrompts() {
  document.querySelectorAll('.example-prompt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prompt = e.target.dataset.prompt;
      input.value = prompt;
      input.dispatchEvent(new Event('input')); // Trigger input validation
      handleSendMessage();
    });
  });
}

function hideWelcomeCard() {
  if (chatWelcome) {
    chatWelcome.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      chatWelcome.style.display = 'none';
    }, 300);
  }
}

function addMessage(text, sender = "user", options = {}) {
  // Welcome card ausblenden beim ersten User-Message
  if (sender === "user" && conversationHistory.length === 0) {
    hideWelcomeCard();
  }
  
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  
  if (options.isMarkdown && sender === "bot") {
    // Einfaches Markdown-Parsing für Bot-Messages
    msg.innerHTML = parseSimpleMarkdown(text);
  } else {
    msg.textContent = text;
  }
  
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Zur Conversation History hinzufügen
  conversationHistory.push({ text, sender, timestamp: Date.now() });
}

function parseSimpleMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function updateSendButton() {
  const hasText = input.value.trim().length > 0;
  const withinLimit = input.value.length <= 500;
  sendBtn.disabled = !hasText || !withinLimit || isProcessing;
}

function updateStatus(type, message) {
  if (!previewStatus || !statusIndicator) return;
  
  const indicators = {
    ready: '🟢',
    processing: '🟡', 
    error: '🔴',
    success: '🟢'
  };
  
  statusIndicator.textContent = indicators[type] || '🟢';
  previewStatus.querySelector('span:last-child').textContent = message;
}

async function handleSendMessage() {
  const text = input.value.trim();
  if (!text || isProcessing) return;
  
  // UI Updates
  isProcessing = true;
  addMessage(text, "user");
  input.value = "";
  input.style.height = 'auto';
  updateSendButton();
  showTypingIndicator();
  updateStatus('processing', 'KI denkt nach...');
  
  try {
    await callChatAPI(text);
  } catch (error) {
    console.error('Chat error:', error);
    addMessage("⚠️ Es gab einen Fehler. Bitte versuche es erneut.", "bot");
    updateStatus('error', 'Fehler aufgetreten');
  } finally {
    isProcessing = false;
    hideTypingIndicator();
    updateSendButton();
    updateStatus('ready', 'Bereit für Eingaben');
  }
}

// Verbesserte API-Kommunikation
async function callChatAPI(message) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    updateStatus('processing', 'Verbinde mit KI...');
    
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        message, 
        mode: "spec", // später auch "spec+ai"
        history: conversationHistory.slice(-5) // Letzten 5 Nachrichten für Kontext
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server Fehler ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    
    if (!data.success) {
      throw new Error(data.error || "Unbekannter Fehler");
    }

    // Bot Response anzeigen
    if (data?.ui?.reply) {
      addMessage(data.ui.reply, "bot", { isMarkdown: true });
    } else {
      addMessage("❌ Keine Antwort vom Assistenten erhalten.", "bot");
    }

    // Debug Info (nur in Development)
    if (window.location.hostname === 'localhost') {
      console.log("🤖 Chat Response:", data);
      console.log("📋 Generated Spec:", data.spec);
    }
    
    // Nächste Aktion vorschlagen
    if (data.next?.action === 'generate') {
      setTimeout(() => {
        addMessage("💡 **Tipp:** Sage 'Generiere die Website' um eine Vorschau zu erstellen!", "bot", { isMarkdown: true });
      }, 1500);
    }
    
    updateStatus('success', 'Antwort erhalten');
    
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      addMessage("⏱️ Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.", "bot");
      updateStatus('error', 'Timeout');
    } else {
      addMessage(`⚠️ **Fehler:** ${err.message}`, "bot", { isMarkdown: true });
      updateStatus('error', 'Fehler beim Laden');
    }
    
    throw err;
  }
}

// Header Button Handlers
function handleSave() {
  // TODO: Implementiere Speicherfunktion
  updateStatus('processing', 'Speichere...');
  setTimeout(() => {
    updateStatus('success', 'Gespeichert!');
    setTimeout(() => updateStatus('ready', 'Bereit für Eingaben'), 2000);
  }, 1000);
}

function handleExport() {
  // TODO: Implementiere Export-Funktion
  updateStatus('processing', 'Exportiere...');
  setTimeout(() => {
    updateStatus('success', 'Export bereit!');
    setTimeout(() => updateStatus('ready', 'Bereit für Eingaben'), 2000);
  }, 1500);
}

function handleRefreshPreview() {
  const iframe = document.getElementById('preview-frame');
  if (iframe) {
    updateStatus('processing', 'Aktualisiere Vorschau...');
    iframe.src = iframe.src;
    setTimeout(() => {
      updateStatus('ready', 'Vorschau aktualisiert');
    }, 1000);
  }
}

function handleDeviceChange(device) {
  const iframe = document.getElementById('preview-frame');
  const container = document.querySelector('.preview-container');
  
  if (!iframe || !container) return;
  
  // Responsive preview simulation
  switch(device) {
    case 'desktop':
      iframe.style.width = '100%';
      iframe.style.maxWidth = 'none';
      break;
    case 'tablet':
      iframe.style.width = '768px';
      iframe.style.maxWidth = '100%';
      break;
    case 'mobile':
      iframe.style.width = '375px';
      iframe.style.maxWidth = '100%';
      break;
  }
  
  updateStatus('ready', `${device} Ansicht aktiv`);
}

// CSS Animation für fadeOut
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;
document.head.appendChild(style);
