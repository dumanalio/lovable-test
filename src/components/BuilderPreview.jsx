import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

// Lightweight in-browser React runtime using Babel Standalone
// We compile user-provided JSX to JS, then eval in a sandboxed Function scope.
function normalizeAppCode(src) {
  if (!src || typeof src !== "string") return "";
  let s = src;
  // remove import lines
  s = s.replace(/^\s*import[^;]*;?\s*$/gm, "");
  // handle common export default patterns
  s = s.replace(/export\s+default\s+function\s+App\s*\(/g, "function App(");
  s = s.replace(/export\s+default\s+class\s+App\s*/g, "class App ");
  s = s.replace(/export\s+default\s*\(/g, "const App = (");
  s = s.replace(/export\s+default\s+async\s*\(/g, "const App = async (");
  s = s.replace(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;/g, "const App = $1;");
  // remove any remaining export statements
  s = s.replace(/^\s*export\s+\{[^}]*\}\s*;?\s*$/gm, "");
  s = s.replace(/^\s*export\s+default\s*;?\s*$/gm, "");
  return s;
}

function useTranspiled(code) {
  return useMemo(() => {
    if (!code) return null;
    try {
      const normalized = normalizeAppCode(code);
      // Provide common React hooks without explicit imports
      const preamble = `const { useState, useEffect, useMemo, useRef, useCallback } = React;`;
      const source = `${preamble}\n${normalized}`;
      // Babel standalone is provided via CDN in index.html? Not guaranteed. Fallback passthrough.
      const hasBabel = typeof window !== "undefined" && window.Babel && window.Babel.transform;
      const js = hasBabel
        ? window.Babel.transform(source, { presets: ["react"] }).code
        : source;
      return js;
    } catch (e) {
      console.error("Transpile error", e);
      return null;
    }
  }, [code]);
}

function PreviewRuntime({ code }) {
  const mountRef = useRef(null);
  const js = useTranspiled(code);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Cleanup previous render
    container.innerHTML = "";

    try {
      const React = window.React;
      const ReactDOM = window.ReactDOM;
      if (!React || !ReactDOM) {
        container.innerHTML = `<div style="padding:16px;color:#ef4444;font-family:ui-sans-serif;">Preview runtime missing React/ReactDOM globals.</div>`;
        return;
      }
      // eslint-disable-next-line no-new-func
      const factory = new Function("React", "ReactDOM", `${js}; return App;`);
      const App = factory(React, ReactDOM);
      if (!App) {
        container.innerHTML = `<div style="padding:16px;color:#ef4444;font-family:ui-sans-serif;">No App export found.</div>`;
        return;
      }
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(App));
      return () => {
        try { root.unmount(); } catch (_) {}
      };
    } catch (e) {
      console.error(e);
      container.innerHTML = `<pre style="padding:16px;color:#ef4444;white-space:pre-wrap;font-family:ui-monospace,monospace;">${String(e)}</pre>`;
    }
  }, [js]);

  return <div ref={mountRef} className="w-full h-full bg-white" />;
}

export default function BuilderPreview({ item }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Deine Vorschau erscheint hier
          </h3>
          <p className="text-gray-300 text-lg">
            Beschreibe deine Website-Idee im Chat und sieh das Ergebnis hier
            live!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
            <p className="text-gray-400 text-sm">
              Generiert von AI • {new Date().toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isFullscreen ? "Verkleinern" : "Vollbild"}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        <div className={`p-6 ${isFullscreen ? "max-w-none" : "max-w-6xl mx-auto"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Browser-like Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-500 text-center">
                  lovable-preview.com
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="min-h-[600px] bg-gray-50">
              <div className="w-full h-full">
                <PreviewRuntime code={item.code} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
