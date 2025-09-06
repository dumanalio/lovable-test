// ---------------------------
// Chat & Vorschau Controller
// ---------------------------

// DOM-Referenzen
const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// Preview-Elemente
const heroTitle = document.getElementById("title");
const heroSubtitle = document.getElementById("subtitle");
const heroButton = document.getElementById("primaryBtn");

// ---------------------------
// Hilfsfunktionen
// ---------------------------

// Neue Nachricht im Chat hinzufügen
function addMessage(text, sender = "you") {
  const msgWrapper = document.createElement("div");
  msgWrapper.className = `msg ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  msgWrapper.appendChild(bubble);
  messages.appendChild(msgWrapper);

  messages.scrollTop = messages.scrollHeight;
}

// Chat-Befehl auf die Vorschau anwenden
function applyCommand(commandLine) {
  const [rawKey, ...rawValue] = commandLine.split(":");
  if (!rawKey || rawValue.length === 0) return false;

  const key = rawKey.trim().toLowerCase();
  const value = rawValue.join(":").trim();

  switch (key) {
    case "title":
      heroTitle.textContent = value;
      return true;
    case "subtitle":
      heroSubtitle.textContent = value;
      return true;
    case "button":
      heroButton.textContent = value;
      return true;
    default:
      return false;
  }
}

// ---------------------------
// Eingaben verarbeiten
// ---------------------------

function handleSend() {
  const text = input.value.trim();
  if (!text) return;

  // Eigene Nachricht anzeigen
  addMessage(text, "you");

  // Jeden Befehl in neuer Zeile prüfen
  let understood = false;
  text.split("\n").forEach((line) => {
    if (applyCommand(line)) understood = true;
  });

  // Wenn kein gültiger Befehl erkannt wurde
  if (!understood) {
    addMessage(
      'Unbekannter Befehl. Nutze: "title: …", "subtitle: …", "button: …"',
      "ai"
    );
  }

  input.value = "";
}

// ---------------------------
// Event Listener
// ---------------------------
sendBtn.addEventListener("click", handleSend);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSend();
  }
});
