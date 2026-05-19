import React, { Suspense, lazy, useMemo, useState } from "react";
import { Circle, Globe2, Map } from "lucide-react";
import { timeAgo } from "../dashboard";
import { hasCoords } from "../geo";
import WorldMap from "../WorldMap";
import type { MapSession } from "../types";

type ViewMode = "map" | "globe";

const GlobeView = lazy(() => import("../GlobeView"));

export function MapPanel({
  sessions,
  lastUpdated,
}: {
  sessions: MapSession[];
  lastUpdated: Date | null;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const points = useMemo(() => sessions.filter((session) => hasCoords(session.client)), [sessions]);

  return (
    <section className="map-panel map-panel--secondary">
      <div className="panel-heading">
        <div>
          <h2>{viewMode === "globe" ? "Global playback" : "Playback map"}</h2>
          <p>{points.length} session{points.length === 1 ? "" : "s"} with coordinates</p>
        </div>
        <div className="panel-heading-actions">
          <div className="segmented" aria-label="Map display mode">
            <button className={viewMode === "map" ? "active" : ""} onClick={() => setViewMode("map")} type="button" title="Map view">
              <Map size={18} />
              <span>Map</span>
            </button>
            <button className={viewMode === "globe" ? "active" : ""} onClick={() => setViewMode("globe")} type="button" title="Globe view">
              <Globe2 size={18} />
              <span>Globe</span>
            </button>
          </div>
          <div className="status-pill">
            <Circle size={10} fill="currentColor" />
            {lastUpdated ? `Updated ${timeAgo(lastUpdated)}` : "Waiting for data"}
          </div>
        </div>
      </div>
      {viewMode === "globe" ? (
        <Suspense fallback={<div className="globe-loading">Loading globe...</div>}>
          <GlobeView sessions={points} />
        </Suspense>
      ) : (
        <WorldMap sessions={points} />
      )}
    </section>
  );
}
