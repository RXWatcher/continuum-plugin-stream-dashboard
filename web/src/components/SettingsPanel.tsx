import { Database } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchConfig, saveConfigJSON } from "../api";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [settingsJSON, setSettingsJSON] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || settingsJSON) return;
    setLoading(true);
    fetchConfig()
      .then((cfg) => {
        setSettingsJSON(JSON.stringify(cfg, null, 2));
        setStatus("");
      })
      .catch((err) => setStatus((err as Error).message))
      .finally(() => setLoading(false));
  }, [open, settingsJSON]);

  async function saveSettings() {
    setStatus("");
    setLoading(true);
    try {
      const cfg = await saveConfigJSON(settingsJSON);
      setSettingsJSON(JSON.stringify(cfg, null, 2));
      setStatus("Settings saved. Restart or reconfigure the plugin to apply runtime changes.");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="settings-panel">
      <div className="panel-heading compact">
        <div>
          <h2>Settings</h2>
          <p>Admin-only plugin configuration</p>
        </div>
        <button className="panel-toggle" onClick={() => setOpen((value) => !value)} type="button">
          <Database size={16} />
          <span>{open ? "Hide" : "Open"}</span>
        </button>
      </div>
      {open ? (
        <div className="settings-panel__body">
          <textarea
            value={settingsJSON}
            onChange={(event) => setSettingsJSON(event.target.value)}
            spellCheck={false}
          />
          <div className="settings-panel__actions">
            <button onClick={() => void saveSettings()} type="button" disabled={loading}>
              {loading ? "Working..." : "Save settings"}
            </button>
            {status ? <span>{status}</span> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
