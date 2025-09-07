import { useState } from "react";

export default function ChatSidebarDebug() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    setMessages((prev) => [...prev, { type: "user", content: input.trim() }]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside
      style={{ width: 320, background: "#222", color: "#fff", padding: 16 }}
    >
      <h4>Debug Chat</h4>
      <div style={{ minHeight: 100, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {m.type}: {m.content}
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Test-Eingabe..."
        style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={isLoading || !input.trim()}
        style={{
          width: "100%",
          padding: 8,
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          opacity: isLoading || !input.trim() ? 0.5 : 1,
          cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
        }}
      >
        Senden
      </button>
    </aside>
  );
}
