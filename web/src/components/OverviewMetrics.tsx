import type { ReactNode } from "react";
import { Clock3, MonitorPlay, Server, Users } from "lucide-react";
import { formatNumber } from "../dashboard";
import type { Counts } from "../types";

function Metric({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  tone?: "ok" | "warn";
}) {
  return (
    <article className={`metric ${tone ?? ""}`}>
      <div className="metric-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{formatNumber(value)}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

export function OverviewMetrics({ counts }: { counts: Counts }) {
  return (
    <section className="metrics-grid" aria-label="Stream metrics">
      <Metric
        icon={<MonitorPlay size={20} />}
        label="Active streams"
        value={counts.sessions.active}
        detail={`${counts.sessions.direct_play} direct, ${counts.sessions.transcoding} transcoding`}
      />
      <Metric
        icon={<Server size={20} />}
        label="Servers"
        value={counts.servers.total}
        detail={`${counts.servers.online} online, ${counts.servers.offline} offline`}
        tone={counts.servers.offline > 0 ? "warn" : "ok"}
      />
      <Metric
        icon={<Users size={20} />}
        label="Users"
        value={counts.users.unique}
        detail={`${counts.users.active_today} today, ${counts.users.active_this_week} this week`}
      />
      <Metric
        icon={<Clock3 size={20} />}
        label="Plays"
        value={counts.history.this_month}
        detail={`${counts.history.today} today, ${counts.history.total} all time`}
      />
    </section>
  );
}
