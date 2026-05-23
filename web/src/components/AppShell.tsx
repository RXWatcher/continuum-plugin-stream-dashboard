import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { friendlyError, formatNumber } from "../dashboard";
import { adminBackTarget } from "../navigation";
import type { Overview } from "../types";
import { HealthBanner } from "./HealthBanner";
import { HistoryPanel } from "./HistoryPanel";
import { MapPanel } from "./MapPanel";
import { OverviewMetrics } from "./OverviewMetrics";
import { SessionsPanel } from "./SessionsPanel";
import { SettingsPanel } from "./SettingsPanel";

function Breakdown({ rows, total }: { rows: [string, number][]; total: number }) {
  if (!rows.length) {
    return <div className="empty-mini">No data</div>;
  }
  return (
    <div className="breakdown">
      {rows.map(([label, value]) => {
        const pct = total > 0 ? Math.max(4, Math.round((value / total) * 100)) : 0;
        return (
          <div className="breakdown-row" key={label || "unknown"}>
            <div>
              <span>{label || "unknown"}</span>
              <strong>{formatNumber(value)}</strong>
            </div>
            <div className="bar">
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AppShell({
  overview,
  loading,
  error,
  lastUpdated,
  onRefresh,
}: {
  overview: Overview;
  loading: boolean;
  error: string;
  lastUpdated: Date | null;
  onRefresh: () => void;
}) {
  const backTarget = adminBackTarget(window.location.pathname);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <a className="back-link" href={backTarget.href} title={backTarget.title}>
            <ArrowLeft size={16} />
            <span>{backTarget.label}</span>
          </a>
          <p className="eyebrow">Silo admin plugin</p>
          <h1>Stream Dashboard</h1>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" onClick={onRefresh} type="button" title="Refresh">
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </div>
      </header>

      {error ? (
        <section className="notice" role="alert">
          <AlertCircle size={18} />
          <span>{friendlyError(error)}</span>
        </section>
      ) : null}

      <HealthBanner health={overview.health} />
      <OverviewMetrics counts={overview.counts} />

      <section className="workspace-grid">
        <div className="main-column">
          <SessionsPanel sessions={overview.sessions} />
          <HistoryPanel history={overview.history} health={overview.health.history} />
        </div>

        <aside className="side-panel side-panel--stacked">
          <MapPanel sessions={overview.map_sessions} lastUpdated={lastUpdated} />

          <section className="side-panel-card">
            <div className="panel-heading compact">
              <div>
                <h2>Server mix</h2>
                <p>By source type</p>
              </div>
            </div>
            <Breakdown rows={Object.entries(overview.counts.servers.by_type)} total={overview.counts.servers.total} />
          </section>

          <section className="side-panel-card">
            <div className="panel-heading compact">
              <div>
                <h2>Media mix</h2>
                <p>Prepared history</p>
              </div>
            </div>
            <Breakdown rows={Object.entries(overview.counts.media)} total={overview.counts.history.total} />
          </section>

          <SettingsPanel />
        </aside>
      </section>
    </main>
  );
}
