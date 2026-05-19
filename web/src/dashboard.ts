import type { Counts, Overview, OverviewHealth, PlaybackHistoryItem, PlaybackHistoryPage, Session } from "./types";

export const emptyCounts: Counts = {
  servers: { total: 0, online: 0, offline: 0, by_type: {} },
  sessions: { active: 0, transcoding: 0, direct_play: 0 },
  history: { total: 0, today: 0, this_week: 0, this_month: 0 },
  users: { unique: 0, active_today: 0, active_this_week: 0 },
  media: {},
};

export const healthyOverviewSections: OverviewHealth = {
  counts: { ok: true },
  sessions: { ok: true },
  map: { ok: true },
  history: { ok: true },
};

export const fallbackOverview: Overview = {
  counts: emptyCounts,
  sessions: [],
  map_sessions: [],
  history: { items: [], total: 0, limit: 20, offset: 0, synced_rows: 0, pruned_rows: 0 },
  refresh_seconds: 30,
  generated_at: new Date(0).toISOString(),
  health: healthyOverviewSections,
};

export function normalizeOverview(payload: Partial<Overview>): Overview {
  const history = payload.history ?? fallbackOverview.history;
  const health = payload.health ?? healthyOverviewSections;
  return {
    ...fallbackOverview,
    ...payload,
    counts: payload.counts ?? fallbackOverview.counts,
    sessions: Array.isArray(payload.sessions) ? payload.sessions : [],
    map_sessions: Array.isArray(payload.map_sessions) ? payload.map_sessions : [],
    history: {
      ...fallbackOverview.history,
      ...history,
      items: Array.isArray(history.items) ? history.items : [],
    },
    health: {
      ...healthyOverviewSections,
      ...health,
    },
  };
}

export function displayTitle(session: Session) {
  if (session.media_type?.toLowerCase() === "episode" && session.series_name) {
    const episode = session.season_number && session.episode_number
      ? `S${String(session.season_number).padStart(2, "0")}E${String(session.episode_number).padStart(2, "0")}`
      : "";
    return [session.series_name, episode, session.episode_title].filter(Boolean).join(" - ");
  }
  return session.media_title || "Untitled media";
}

export function historyTitle(item: PlaybackHistoryItem) {
  return item.media_title || item.media_item_id || "Untitled media";
}

export function friendlyError(message: string) {
  if (message.includes("not_ready") || message.includes("plugin not configured")) {
    return "Plugin is not configured. Add the plugin database URL and Continuum source database URL in Continuum plugin settings.";
  }
  return message.length > 180 ? `${message.slice(0, 180)}...` : message;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value || 0);
}

export function formatWatch(item: PlaybackHistoryItem) {
  const watched = formatDuration(item.watched_seconds || 0);
  if (!item.duration_seconds) return watched;
  return `${watched} / ${formatDuration(item.duration_seconds)}`;
}

export function formatDurationSince(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recent";
  return formatDuration(Math.max(0, (Date.now() - date.getTime()) / 1000));
}

export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function timeAgo(date: Date) {
  if (Number.isNaN(date.getTime())) return "recently";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function degradedSections(health: OverviewHealth) {
  return Object.entries(health).filter(([, section]) => !section.ok);
}

export function historyStatusText(history: PlaybackHistoryPage) {
  return history.total ? `${formatNumber(history.total)} retained plays` : "Waiting for completed plays";
}
