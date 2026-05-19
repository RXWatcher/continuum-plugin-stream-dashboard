import { Activity, Cpu, Database, Film, MonitorPlay, Server, Users } from "lucide-react";
import { displayTitle, formatDurationSince, timeAgo } from "../dashboard";
import type { Session } from "../types";

function SessionList({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) {
    return (
      <div className="empty-state">
        <MonitorPlay size={24} />
        <p>No active playback sessions.</p>
      </div>
    );
  }

  return (
    <div className="session-list">
      {sessions.map((session) => (
        <article className="session-row" key={session.id}>
          <div className="session-main">
            <div className="session-title-row">
              <h3>{displayTitle(session)}</h3>
              <span className={session.is_transcoding ? "badge transcode" : "badge direct"}>
                {session.is_transcoding ? <Cpu size={14} /> : <Activity size={14} />}
                {session.is_transcoding ? "Transcode" : "Direct"}
              </span>
            </div>
            <div className="session-meta">
              <span><Users size={14} />{session.user_name || "Unknown user"}</span>
              <span><Server size={14} />{session.server_name || "Unknown server"}</span>
              <span><Film size={14} />{[session.video_resolution, session.video_codec].filter(Boolean).join(" / ") || session.media_type || "Media"}</span>
              <span><Database size={14} />{session.location || session.ip_address || "No location"}</span>
            </div>
          </div>
          <div className="session-side">
            <strong>{session.player_state || "playing"}</strong>
            <small>{formatDurationSince(session.started_at)}</small>
            <small>{timeAgo(new Date(session.last_seen_at))}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

export function SessionsPanel({ sessions }: { sessions: Session[] }) {
  return (
    <section className="sessions-panel">
      <div className="panel-heading compact">
        <div>
          <h2>Active sessions</h2>
          <p>{sessions.length} currently open</p>
        </div>
      </div>
      <SessionList sessions={sessions} />
    </section>
  );
}
