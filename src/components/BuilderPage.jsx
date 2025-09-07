import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Eye, Zap, Sparkles, Send, Loader2 } from "lucide-react";

export default function BuilderPage() {
  const [generated, setGenerated] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState("preview");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = {
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);
    setInput("");

    try {
      const response = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input.trim(),
          messages: messages.slice(-3), // Keep last 3 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          type: "ai",
          content: data,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setGenerated(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = {
          type: "ai",
          content: { title: "Error", code: `Error: ${errorData.error || "Failed to generate component"}` },
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        type: "ai",
        content: { title: "Connection Error", code: "Failed to connect to server. Please try again." },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Chat Sidebar */}
      <div className="w-96 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">AI Builder</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-plum-600 text-white"
                    : "bg-white/10 text-white"
                }`}
              >
                {message.type === "user" ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <div>
                    <p className="text-sm font-medium">{message.content.title}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {message.content.code?.length > 100
                        ? `${message.content.code.substring(0, 100)}...`
                        : message.content.code}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your component..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-plum-500"
              disabled={isGenerating}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="px-4 py-2 bg-plum-600 hover:bg-plum-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white flex items-center space-x-2 transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h1 className="text-xl font-bold text-white">Component Preview</h1>
              </div>
              {generated && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>•</span>
                  <span>{generated.title}</span>
                </div>
              )}
            </div>

            {generated && (
              <div className="flex items-center bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView("preview")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === "preview"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => setCurrentView("code")}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    currentView === "code"
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {generated ? (
            currentView === "preview" ? (
              <ComponentPreview component={generated} />
            ) : (
              <CodeView component={generated} />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
              >
                <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to AI Builder
                </h2>
                <p className="text-gray-400">
                  Describe the component you want to create and watch it come to life!
                </p>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Simple Component Preview
function ComponentPreview({ component }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);

    if (!component?.code) return;

    try {
      // Simple code cleaning
      let code = component.code
        .replace(/import\s+.*?\s*from\s+['"`][^'"`]*['"`]\s*;?\s*/g, "")
        .replace(/export\s+default\s+/g, "")
        .replace(/export\s+/g, "")
        .trim();

      // Add React hooks if needed
      if (code.includes("useState") || code.includes("useEffect")) {
        code = `const { useState, useEffect, useMemo, useRef, useCallback } = React;\n${code}`;
      }

      // Create the component
      const createComponent = new Function("React", "ReactDOM", `${code}; return typeof App !== 'undefined' ? App : ${code.includes('function') ? code.match(/function\s+(\w+)/)?.[1] || 'Component' : 'Component'};`);

      const Component = createComponent(window.React, window.ReactDOM);

      if (Component) {
        const container = document.getElementById("preview-container");
        if (container) {
          window.ReactDOM.createRoot(container).render(window.React.createElement(Component));
        }
      }
    } catch (err) {
      console.error("Preview error:", err);
      setError(err.message);
    }
  }, [component]);

  return (
    <div className="h-full bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{component.title}</h3>
      </div>
      <div className="p-4">
        {error ? (
          <div className="text-red-500 text-sm bg-red-50 p-4 rounded">
            <strong>Preview Error:</strong> {error}
          </div>
        ) : (
          <div id="preview-container" className="min-h-64 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <Eye className="w-8 h-8 mx-auto mb-2" />
              <p>Component will render here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Code View
function CodeView({ component }) {
  return (
    <div className="h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-white">{component.title}</h3>
      </div>
      <div className="p-4">
        <pre className="text-sm text-gray-300 overflow-x-auto bg-gray-800 p-4 rounded">
          <code>{component.code}</code>
        </pre>
      </div>
    </div>
  );
}
