// Chat.js – Basis Chat Logik

const messagesContainer = document.getElementById("chat-messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// Funktion: Nachricht ins Chatfenster schreiben
function addMessage(text, sender = "user") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // immer nach unten scrollen
}

// Klick auf "Senden"
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  // User-Nachricht anzeigen
  addMessage(text, "user");
  input.value = "";

  // Placeholder für Bot-Antwort
  setTimeout(() => {
    addMessage("👍 Verstanden! (Hier später AI-Generierung)", "bot");
  }, 500);
});

// Enter-Taste als Shortcut
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
