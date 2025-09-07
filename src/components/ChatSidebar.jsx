import { useState, useRef, useEffect } from "react";
import {
  Send,
  Trash2,
  Copy,
  Download,
  MessageSquare,
  Bot,
  User,
} from "lucide-react";

export default function ChatSidebar({
  onGenerate,
  onStartGenerating,
  isGenerating,
}) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = {
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    onStartGenerating();
    setInput("");

    try {
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input.trim(),
          messages: messages.slice(-6), // Keep last 6 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          type: "ai",
          content: {
            title: data.title || "AI Generated Component",
            code: data.code || "",
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        onGenerate(aiMessage.content);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        const errorMessage = {
          type: "ai",
          content: {
            title: "Generierungsfehler",
            code: `Fehler: ${errorData.error || "Unbekannter Fehler bei der Generierung"}`,
          },
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        onGenerate(null);
      }
    } catch (error) {
      console.error("Network Error:", error);
      const errorMessage = {
        type: "ai",
        content: {
          title: "Verbindungsfehler",
          code: `Netzwerkfehler: ${error.message || "Keine Verbindung zum Server möglich"}`,
        },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      onGenerate(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = (code, title) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([]);
    onGenerate(null);
  };

  return (
    <aside className="w-96 bg-white/10 backdrop-blur-sm border-r border-white/10 min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-semibold text-white">
              AI Chat Builder
            </h4>
          </div>
          <button
            onClick={clearChat}
            className="text-xs text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Chat löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-gray-400 bg-green-500/20 text-green-400 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>AI ist bereit</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Beschreibe deine Website-Idee und ich erstelle den Code dafür!
            </p>
            <div className="mt-4 text-xs space-y-2">
              <p>Beispiele:</p>
              <div className="space-y-1">
                <p className="bg-white/5 px-3 py-2 rounded">
                  "Erstelle eine moderne Landing Page"
                </p>
                <p className="bg-white/5 px-3 py-2 rounded">
                  "Baue ein Kontaktformular"
                </p>
                <p className="bg-white/5 px-3 py-2 rounded">
                  "Mache eine Produktgalerie"
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-blue-600 text-white ml-12"
                    : "bg-white/10 text-white mr-12"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.type === "user" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.type === "user" ? "Du" : "AI"} •{" "}
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {message.type === "user" ? (
                  <div className="text-sm">{message.content}</div>
                ) : (
                  <div>
                    <div className="font-medium mb-2 text-sm">
                      {message.content.title}
                    </div>
                    <div className="bg-black/40 p-3 rounded text-xs font-mono overflow-x-auto mb-3">
                      <pre className="whitespace-pre-wrap text-xs">
                        {message.content.code.length > 200
                          ? `${message.content.code.substring(0, 200)}...`
                          : message.content.code}
                      </pre>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(message.content.code)}
                        className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded flex items-center space-x-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Kopieren</span>
                      </button>
                      <button
                        onClick={() =>
                          downloadCode(
                            message.content.code,
                            message.content.title
                          )
                        }
                        className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded flex items-center space-x-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Beschreibe deine Website-Idee..."
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-32"
              disabled={isGenerating}
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isGenerating || !input.trim()}
            className={`p-3 rounded-xl transition-all ${
              isGenerating || !input.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {isGenerating && (
          <div className="mt-3 text-xs text-gray-400 flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Generiere Code...</span>
          </div>
        )}
      </div>
    </aside>
  );
}
