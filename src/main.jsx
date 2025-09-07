import React from "react";
import { createRoot } from "react-dom/client";
import StandaloneChatTest from "./StandaloneChatTest";

// This is a temporary debug setup to isolate the chat input issue.
// It renders ONLY the standalone test component.
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StandaloneChatTest />
  </React.StrictMode>
);
