import { useState } from "react";

export default function StandaloneChatTest() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#eee", padding: 24, borderRadius: 8 }}>
      <h2>Standalone Chat Test</h2>
      <div style={{ minHeight: 80, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8, color: "#333" }}>{m}</div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Test-Eingabe..."
        style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!input.trim()}
        style={{ width: "100%", padding: 8, background: "#4f46e5", color: "#fff", border: "none", borderRadius: 4, opacity: !input.trim() ? 0.5 : 1, cursor: !input.trim() ? "not-allowed" : "pointer" }}
      >
        Senden
      </button>
    </div>
  );
}
