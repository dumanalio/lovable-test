import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ChatSidebar from "./ChatSidebar";
import BuilderPreview from "./BuilderPreview";
import { Code, Eye, Zap, Sparkles } from "lucide-react";

export default function BuilderPage() {
  const [generated, setGenerated] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState("preview");

  useEffect(() => {
    // Auto-switch to preview when something is generated
    if (generated && currentView === "code") {
      setCurrentView("preview");
    }
  }, [generated, currentView]);

  const handleGenerate = (item) => {
    setGenerated(item);
    setIsGenerating(false);
  };

  const handleStartGenerating = () => {
    setIsGenerating(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Chat Sidebar */}
      <ChatSidebar
        onGenerate={handleGenerate}
        onStartGenerating={handleStartGenerating}
        isGenerating={isGenerating}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h1 className="text-xl font-bold text-white">
                  AI Website Builder
                </h1>
              </div>
              {generated && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span>•</span>
                  <span>{generated.title}</span>
                </div>
              )}
            </div>

            {/* View Toggle */}
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
                  <span>Vorschau</span>
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

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Erstelle deine Website...
                </h3>
                <p className="text-gray-300">
                  Die KI generiert gerade deinen perfekten Code
                </p>
              </motion.div>
            </div>
          ) : generated ? (
            <div className="h-full">
              {currentView === "preview" ? (
                <BuilderPreview item={generated} />
              ) : (
                <div className="p-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Generierter Code
                        </h3>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(generated.code)
                          }
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Kopieren
                        </button>
                      </div>
                      <pre className="bg-black/60 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
                        <code>{generated.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto px-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Bereit zum Bauen?
                </h2>
                <p className="text-gray-300 mb-6">
                  Beschreibe deine Website-Idee im Chat auf der linken Seite und
                  lass die KI die Arbeit machen!
                </p>
                <div className="text-sm text-gray-400">
                  Beispiele: "Erstelle eine moderne Landing Page für ein Café"
                  oder "Baue ein Portfolio für einen Fotografen"
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
