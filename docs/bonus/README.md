# Bonus Task — Web App Uptime Monitor Documentation

**Candidate:** Krishna Kumar  
**Role:** Automation & QA Developer  
**Date:** September 29, 2026  
**Exported Workflow File:** [`Bonus_UptimeMonitor_Krishna.json`](../../Bonus_UptimeMonitor_Krishna.json)

---

## 1. Overview & Goal

The Uptime Monitor workflow provides continuous health monitoring for the target web application (`https://angular.realworld.io` / `https://api.realworld.show/api/articles`). It pings the endpoint every 5 minutes, calculates HTTP response latency, and triggers real-time incident alerts if the application responds with non-200 status codes or exceeds latency thresholds.

---

## 2. Workflow Structure

1. **Schedule Every 5 Mins (Schedule Trigger):** Fires automated checks every 5 minutes.
2. **Ping Web App API (HTTP Request Node):** Issues a `GET` request to the target API endpoint with a 5000ms hard timeout.
3. **Track Latency & Status (Code Node):** Computes exact round-trip response time in milliseconds (`responseTimeMs`), extracts HTTP status codes, and evaluates overall endpoint health (`isHealthy`).
4. **IF Status != 200 OR Slow (Conditional Node):** Evaluates if `isHealthy == false` (Status != 200 or Latency > 3000ms).
5. **Send Uptime Failure Alert (TRUE Branch):** Sends a red alert embed to the Discord/Slack webhook channel detailing status code, latency, and incident timestamp.
6. **Log Uptime OK Status (FALSE Branch):** Logs a normal heartbeat entry (`[UPTIME OK] Target web app is healthy`).

---

## 3. Resilience & Error Handling

- **Timeout Management:** Configured with a 5-second request timeout to catch hanging connections.
- **Connection Error Interception:** Uses `"onError": "continueErrorOutput"` to prevent workflow failure when the target web app experiences complete network failure or Cloudflare origin drops (`HTTP 530`).
- **Response Metrics:** Calculates response latency per check for SLA trend monitoring.

---

## 4. Screenshot Evidence

- [`screenshots/bonus/uptime-workflow.png`](../../screenshots/bonus/uptime-workflow.png) — Uptime Monitor workflow canvas screenshot.
