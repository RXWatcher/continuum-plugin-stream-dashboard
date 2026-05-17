# Stream Dashboard for Continuum

`continuum.stream-dashboard` provides an operator dashboard for Continuum stream
activity. It reads active sessions and playback history from the Continuum
database, syncs that data into a plugin-owned schema, and serves dashboard
views for current streams, history, map coverage, and globe-style visualizations.

Use this plugin when operators need visibility into current and historical
stream usage without querying the main Continuum database directly from the
browser.

## Detailed Operations Docs

- [Setup, debugging, and communication flows](docs/setup-debug-flows.md)

## Features

- Admin dashboard for active streams and playback history.
- Scheduled sync from Continuum's public schema into the plugin schema.
- Retention controls for synced playback history.
- Optional GeoIP enrichment for map and globe views.
- Read-only access to the Continuum source database; plugin writes stay in its
  own schema.

## Configuration

| Key | Required | Description |
|---|---|---|
| `plugin_database` | yes | Postgres DSN for the plugin-owned `stream_dashboard` schema. |
| `continuum_database` | yes | Read-only Postgres DSN for Continuum's public schema. |
| `stream_dashboard` | no | Dashboard refresh, retention, and GeoIP enrichment settings. |

Example plugin DSN:

```text
postgres://plugin_stream_dashboard:password@postgres:5432/continuum?search_path=stream_dashboard&sslmode=disable
```

## Database Setup

```sql
CREATE ROLE plugin_stream_dashboard WITH LOGIN PASSWORD '<chosen>';
CREATE SCHEMA stream_dashboard AUTHORIZATION plugin_stream_dashboard;
GRANT CONNECT ON DATABASE continuum TO plugin_stream_dashboard;
```

The `continuum_database` user should be read-only and limited to the source
tables or views the dashboard needs.

## Operations

- Use a separate read-only DB credential for `continuum_database`.
- Keep playback-history retention aligned with your privacy policy.
- Enable GeoIP enrichment only when you are comfortable storing derived
  location metadata for stream events.

## Build And Test

```bash
make build
make test
```
