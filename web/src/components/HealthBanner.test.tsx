import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fallbackOverview } from "../dashboard";
import { HealthBanner } from "./HealthBanner";
import { HistoryPanel } from "./HistoryPanel";

describe("dashboard health components", () => {
  it("renders degraded section messages", () => {
    const markup = renderToStaticMarkup(
      <HealthBanner
        health={{
          ...fallbackOverview.health,
          history: { ok: false, code: "history_failed", message: "history query failed" },
        }}
      />,
    );

    expect(markup).toContain("history");
    expect(markup).toContain("history query failed");
  });

  it("renders a history error state instead of the empty-state copy when degraded", () => {
    const markup = renderToStaticMarkup(
      <HistoryPanel
        history={fallbackOverview.history}
        health={{ ok: false, code: "history_failed", message: "history query failed" }}
      />,
    );

    expect(markup).toContain("History unavailable");
    expect(markup).toContain("history query failed");
    expect(markup).not.toContain("No playback history has been synced yet.");
  });
});
