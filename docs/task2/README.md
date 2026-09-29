# Task 2 — n8n API Integration Workflow Documentation

**Candidate:** Krishna Kumar  
**Role:** Automation & QA Developer  
**Date:** September 29, 2026  
**Exported Workflow File:** [`Task2_Workflow_Krishna.json`](../../Task2_Workflow_Krishna.json)

---

## 1. Purpose

The purpose of this workflow is to construct an automated daily "morning brief" digest that monitors high-performing open-source QA automation repositories on GitHub, enriches repository data with additional API endpoints, evaluates popularity thresholds, and posts formatted notifications to a Discord webhook channel.

---

## 2. APIs Used & Selection Rationale

1. **First API (GitHub REST API - Search Repositories):**
   - **Endpoint:** `GET https://api.github.com/search/repositories?q=topic:qa-automation&sort=stars&order=desc&per_page=10`
   - **Rationale:** Public, unauthenticated endpoint that returns structured repository metadata without requiring OAuth tokens for testing.
2. **Second API (GitHub REST API - Repository README Metadata):**
   - **Endpoint:** `GET https://api.github.com/repos/{owner}/{name}/readme`
   - **Rationale:** Enriches top repository records with README metadata (size, download URL, file encoding) to provide deeper repository insights.

---

## 3. Workflow Node Architecture

The workflow consists of 7 interconnected nodes:

1. **Schedule Trigger:** Triggers execution automatically every 1 hour (configurable for daily schedules).
2. **Fetch Top Repos (HTTP Request #1):** Queries GitHub API for `qa-automation` repositories.
3. **Transform & Keep Top 5 (Code Node):** 
   - Filters out forks and repositories without descriptions.
   - Sorts records by `stargazers_count` in descending order.
   - Slices the array to return strictly the **Top 5** repositories.
   - Extracts key fields: `id`, `name`, `full_name`, `owner`, `html_url`, `stargazers_count`, `forks_count`, `language`, and `description`.
4. **Enrich README Data (HTTP Request #2):** Calls GitHub's README endpoint for each top repository using expressions dynamically populated from Node #3.
5. **IF Stars >= 1000 (Conditional Branch):** Filters repository items based on a popularity threshold (`stargazers_count >= 1000`).
6. **Send Discord Digest Notification (Output Node):** Formats high-impact repositories into a rich Discord embed card and dispatches payload via HTTP POST.
7. **Error Fallback Logger (Error Handling Branch):** Catches HTTP errors or empty API responses and logs structured failure details.

---

## 4. Error Handling & Fallback Strategy

The workflow enforces robust error handling so API failures never crash execution silently:
- Both HTTP Request nodes feature `"onError": "continueErrorOutput"`.
- If GitHub API returns rate limit errors (`403 Forbidden`) or network timeouts (`504`), control flows directly into the **Error Fallback Logger** node.
- The logger formats a diagnostic JSON payload containing timestamps, failed URLs, and status codes for monitoring.

---

## 5. Credential & Secret Management

**Credential Security Notice:** No API keys, tokens, or webhook URLs are hard-coded in source files.
- The Discord Webhook URL is referenced via n8n's Credentials Store: `={{ $credentials.discordWebhookUrl }}`.
- **Manual Setup Steps:**
  1. Open n8n menu -> **Credentials** -> **New Credential**.
  2. Select **Header Auth** or custom **Webhook Credential**.
  3. Set Name to `Discord Webhook Credential`.
  4. Paste your Discord Webhook URL into the value field.
  5. Save credential and link it to the `Send Discord Digest Notification` node.

---

## 6. How to Test the Workflow

1. Import `Task2_Workflow_Krishna.json` into your local or cloud n8n instance (**Workflows** -> **Import from File**).
2. Configure your Discord Webhook credential as described above.
3. Click **Execute Workflow** in the n8n canvas.
4. Verify that all 6 nodes execute with green checkmarks and output data in the execution panel.

---

## 7. Screenshot Evidence

- [`screenshots/task2/workflow-canvas.png`](../../screenshots/task2/workflow-canvas.png) — Full n8n workflow canvas.
- [`screenshots/task2/successful-execution.png`](../../screenshots/task2/successful-execution.png) — Successful execution output data.
