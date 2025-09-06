// Chat.js – erweitert: mit API-Aufruf

const messagesContainer = document.getElementById("chat-messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Anfrage an Netlify Chat-Function
async function callChatAPI(message) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, mode: "spec" }) // später auch "spec+ai"
    });

    if (!res.ok) throw new Error(`Fehler: ${res.status}`);
    const data = await res.json();

    // Ausgabe im Chat
    if (data?.ui?.reply) {
      addMessage(data.ui.reply, "bot");
    } else {
      addMessage("❌ Keine Antwort vom Assistenten.", "bot");
    }

    // Debug (Spec in Konsole sehen)
    console.log("Spec:", data.spec);

  } catch (err) {
    addMessage("⚠️ Fehler beim Server-Aufruf: " + err.message, "bot");
  }
}

// Klick-Handler
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // API call
  callChatAPI(text);
});

// Enter-Key Support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
