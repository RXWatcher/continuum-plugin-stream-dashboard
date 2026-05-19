import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { captureTokenFromURL, fetchOverview } from "./api";
import { fallbackOverview } from "./dashboard";
import { AppShell } from "./components/AppShell";
import type { Overview } from "./types";
import "./styles.css";

captureTokenFromURL();

function App() {
  const [overview, setOverview] = useState<Overview>(fallbackOverview);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const next = await fetchOverview(signal);
      setOverview(next);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const seconds = Math.max(overview.refresh_seconds || 30, 5);
    const id = window.setInterval(() => void refresh(), seconds * 1000);
    return () => window.clearInterval(id);
  }, [overview.refresh_seconds]);

  return (
    <AppShell
      overview={overview}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={() => void refresh()}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
