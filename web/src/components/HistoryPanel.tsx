import { Activity, AlertCircle, Clock3, Database, Film, RefreshCw, Timer, Users } from "lucide-react";
import { formatNumber, formatWatch, historyTitle, historyStatusText, timeAgo } from "../dashboard";
import type { PlaybackHistoryPage, SectionHealth } from "../types";

function HistoryList({ history }: { history: PlaybackHistoryPage }) {
  if (!history.items.length) {
    return (
      <div className="empty-state">
        <Clock3 size={24} />
        <p>No playback history has been synced yet.</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      {history.items.map((item) => (
        <article className="history-row" key={item.session_id}>
          <div className="history-main">
            <div className="session-title-row">
              <h3>{historyTitle(item)}</h3>
              <span className={item.completed ? "badge direct" : "badge partial"}>
                {item.completed ? "Completed" : "Partial"}
              </span>
            </div>
            <div className="session-meta">
              <span><Users size={14} />{item.username || item.profile_name || "Unknown user"}</span>
              <span><Film size={14} />{item.media_type || "Media"}</span>
              <span><Activity size={14} />{item.play_method || "play"}</span>
              <span><Database size={14} />{item.client_ip || "No IP"}</span>
            </div>
          </div>
          <div className="history-side">
            <strong>{formatWatch(item)}</strong>
            <small>{timeAgo(new Date(item.ended_at))}</small>
          </div>
        </article>
      ))}
      <div className="sync-footnote">
        <span><Timer size={14} />Prepared history view</span>
        {history.last_sync_at ? <span>Last sync {timeAgo(new Date(history.last_sync_at))}</span> : null}
      </div>
    </div>
  );
}

export function HistoryPanel({
  history,
  health,
}: {
  history: PlaybackHistoryPage;
  health: SectionHealth;
}) {
  return (
    <section className="history-panel">
      <div className="panel-heading compact">
        <div>
          <h2>Playback history</h2>
          <p>{historyStatusText(history)}</p>
        </div>
        <div className="status-pill muted">
          <RefreshCw size={14} />
          {history.last_sync_at ? `Synced ${timeAgo(new Date(history.last_sync_at))}` : "Sync pending"}
        </div>
      </div>
      {!health.ok ? (
        <div className="panel-error" role="alert">
          <AlertCircle size={18} />
          <div>
            <strong>History unavailable</strong>
            <span>{health.message || "Playback history could not be loaded."}</span>
          </div>
        </div>
      ) : null}
      {health.ok ? <HistoryList history={history} /> : null}
      {!health.ok && history.total > 0 ? (
        <div className="panel-footnote">Last prepared rows retained: {formatNumber(history.total)}</div>
      ) : null}
    </section>
  );
}
