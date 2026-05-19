import { AlertCircle } from "lucide-react";
import { degradedSections } from "../dashboard";
import type { OverviewHealth } from "../types";

export function HealthBanner({ health }: { health: OverviewHealth }) {
  const degraded = degradedSections(health);
  if (!degraded.length) return null;

  return (
    <section className="health-banner" role="alert" aria-label="Dashboard health issues">
      {degraded.map(([section, value]) => (
        <article className="health-banner__item" key={section}>
          <AlertCircle size={16} />
          <div>
            <strong>{section}</strong>
            <span>{value.message || "Section degraded."}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
