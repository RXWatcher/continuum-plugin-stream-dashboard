# Stream Dashboard Setup, Debugging, And Flows

Plugin ID: `continuum.stream-dashboard`
Version documented: `0.1.0`

## Purpose

admin dashboard for active streams, playback history, map coverage, GeoIP enrichment,
and retention.

## Runtime Dependencies

- Continuum plugin host
- Plugin database schema
- Read access to the Continuum database for stream/session history
- Optional GeoIP database or HTTP GeoIP providers

## Setup Checklist

1. Configure plugin_database.database_url for dashboard state.
2. Configure continuum_database.database_url with read access to Continuum source tables.
3. Set refresh interval, retention settings, and default server coordinates.
4. Enable GeoIP and configure provider order/token/database path if desired.
5. Open /dashboard as an authenticated user and verify active/history rows.

## Configuration Reference

- `plugin_database`
- `database_url`
- `continuum_database`
- `stream_dashboard`
- `refresh_seconds`
- `default_server_lat`
- `default_server_lon`
- `history_retention_days`
- `history_retention_max_rows`
- `history_retention_min_seconds`
- `history_retention_completed_only`
- `geoip_enabled`
- `geoip_database_path`
- `geoip_lookup_missing_coordinates`
- `geoip_override_session_coordinates`
- `geoip_lookup_cdn_nodes`
- `geoip_include_private_ips`
- `geoip_provider_order`
- `geoip_request_timeout_seconds`
- `geoip_cache_ttl_seconds`
- `geoip_cache_max_entries`
- `geoip_ipapi_enabled`
- `geoip_ipapi_base_url`
- `geoip_ipinfo_enabled`
- `geoip_ipinfo_base_url`
- `geoip_ipinfo_token`
- `geoip_ipwhois_enabled`
- `geoip_ipwhois_base_url`

Use the plugin manifest/admin form as the source of truth for field validation and defaults. Keep database credentials scoped to the plugin schema unless a plugin explicitly needs read access to Continuum core tables.

## Exposed Routes

- `* /api/* [authenticated]`
- `GET /assets/* [public]`
- `GET /dashboard [authenticated]`
- `GET /dashboard/* [authenticated]`

## Capabilities

- `http_routes.v1 (dashboard) - Dashboard for Continuum active streams, playback history, map coverage, and globe view.`
- `scheduled_task.v1 (sync-playback-history) - Copies Continuum playback history into the plugin schema and applies retention.`

## Operational Flows

### Dashboard refresh

1. The web dashboard polls plugin API routes.
2. The plugin reads active stream/session data from Continuum DB and cached dashboard state from plugin DB.
3. GeoIP enrichment fills missing coordinates when enabled.
4. The scheduled task syncs playback history and retention prunes old rows.

## How This Plugin Communicates

- Reads Continuum database state; it does not consume request events.
- Serves authenticated dashboard and API routes.
- May call external GeoIP services when configured.

## Debugging Runbook

- If dashboard is empty, verify continuum_database.database_url points at the real Continuum DB and has SELECT rights.
- If plugin state errors occur, verify plugin_database.database_url separately.
- If map locations are wrong, check GeoIP provider order, private IP handling, and coordinate override flags.
- If history grows too much, tune retention_days/max_rows/min_seconds/completed_only.

## Log And Health Checks

- Start with Continuum Admin -> Plugins and confirm the installation is enabled.
- Check the plugin process logs around startup for manifest loading, migration, and route registration.
- Check scheduled task logs when a workflow depends on polling or reconciliation.
- Confirm the plugin routes are reachable through Continuum using the access level shown above.
- For database-backed plugins, verify the configured role can connect, create/migrate tables in its schema, and read/write expected rows.

## Common Failure Patterns

- Wrong installation ID selected in a portal or router setting after reinstalling a plugin.
- Plugin database URL points at the public schema instead of the dedicated plugin schema.
- Reverse proxy forwards the SPA route but not `/api/*`, `/api/v1/*`, `/assets/*`, or provider-specific public routes.
- Network checks are run from the operator laptop instead of from the Continuum/plugin runtime network.
- Secrets are regenerated during restart, invalidating signed URLs, encrypted fields, or login state.

## Verification After Changes

1. Restart or reload the plugin installation.
2. Open the plugin route or admin page in Continuum.
3. Exercise the smallest workflow that crosses a plugin boundary.
4. Confirm both the source plugin and destination plugin record the same request/session/login identifier.
5. Leave the scheduled reconciler enough time to run, then confirm terminal state or a useful error.
