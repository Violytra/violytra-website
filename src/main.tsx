import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ErrorBoundary, DownScreen } from "./components/ErrorBoundary";

const DOWN_HTML = `
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#fff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;text-align:center;padding:24px">
    <div style="max-width:28rem">
      <div style="margin:0 auto 24px;height:64px;width:64px;display:flex;align-items:center;justify-content:center;border-radius:16px;border:1px solid rgba(167,139,250,.3);background:rgba(139,92,246,.1);color:#c4b5fd;font-size:1.5rem;font-weight:700">V</div>
      <h1 style="font-size:clamp(1.875rem,4vw,2.25rem);margin:0;letter-spacing:-0.025em">Violytra is down right now</h1>
      <p style="margin:12px 0 0;color:#a1a1aa">Something went wrong loading the site. Please try again in a moment.</p>
      <button onclick="window.location.reload()" style="margin-top:32px;border:0;border-radius:9999px;background:#8b5cf6;color:#fff;padding:12px 24px;font:600 0.875rem system-ui,sans-serif;cursor:pointer">Reload</button>
    </div>
  </div>`;

function showDownScreen() {
  const root = document.getElementById("root");
  if (!root || root.dataset.down === "1") return;
  root.dataset.down = "1";
  try {
    root.innerHTML = DOWN_HTML;
  } catch {
    document.body.innerHTML = DOWN_HTML;
  }
}

window.addEventListener("error", () => {
  showDownScreen();
});

window.addEventListener("unhandledrejection", () => {
  showDownScreen();
});

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} else {
  document.body.innerHTML =
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0f;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px"><div><h1 style="font-size:2rem;margin:0 0 12px">Violytra is down right now</h1><p style="color:#a1a1aa;margin:0">Something went wrong loading the site.</p></div></div>';
}

