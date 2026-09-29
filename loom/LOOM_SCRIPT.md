# Loom Video Presentation Script

**Candidate Name:** Krishna Kumar  
**Role:** Automation & QA Developer Take-Home Assessment  
**Target Video Duration:** ~5–8 minutes  

---

## 🎙️ Video Script & Walkthrough

### 1. Introduction (0:00 - 0:45)
"Hi everyone, my name is Krishna Kumar. Today I'm presenting my submission for the Automation & QA Developer take-home assessment. In this walkthrough, I'll take you through my work across two main tasks and a bonus project: first, a web application QA investigation on the Conduit RealWorld app, followed by an automated n8n API integration workflow, and finally a lightweight uptime monitor workflow."

---

### 2. Task 1: Web App Selection & Test Scope (0:45 - 1:45)
"For Task 1, I evaluated the Conduit RealWorld application using both the live Angular frontend at `angular.realworld.io` and direct REST API testing against `api.realworld.show/api`. 

I systematically tested all six core user flows: account sign-up, user login, creating content, editing content, deleting content, and logging out. Additionally, I probed several edge cases including blank payload submissions, long strings with special characters, expired session tokens, and API error resilience."

---

### 3. Key Defect Discoveries (1:45 - 3:00)
"During testing, I identified six distinct, reproducible issues:
1. **Duplicate User Registration Allowed (High Severity):** Registering with an email address that already exists returns an HTTP 201 Created instead of a 422 error, silently creating duplicate accounts.
2. **Production API Host Down (Critical):** The primary production host (`api.realworld.io`) responds with a Cloudflare HTTP 530 error, causing public frontends to hang indefinitely on article loading.
3. **Authorization Header Scheme Mismatch (Medium):** Protected endpoints fail with HTTP 401 when using the specification-standard `Authorization: Token` header, requiring `Bearer` instead.
4. **Empty Title Updates Allowed (Medium):** Editing an article title to an empty string succeeds on the API, creating a broken URL slug (`/article/`).
5. **Tag Pill Overflow in UI (Low):** Tags with long strings overflow horizontal container bounds on feed cards.
6. **Unhandled Session Expiration (High):** Expired JWTs in local storage cause protected routes to hang on a blank screen with a permanent loading indicator."

---

### 4. Root Cause Analysis Deep Dive (3:00 - 4:15)
"Let's focus on **Bug #1 — Duplicate User Registration Allowed**. 

When a user submits a registration payload with an existing email, the user creation controller passes the data straight to the database layer without checking if the email address is already taken. Additionally, the underlying database table lacks a SQL `UNIQUE` constraint on the email column. 

Because of this, the server creates a secondary user entry and issues a new JWT token without warning the client. This creates serious data integrity and session collision risks. 

To fix this, we need to enforce a database-level unique index — `ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email)` — and update the registration service to return an HTTP 422 status with field-level error messages (`email has already been taken`) when a duplicate is submitted."

---

### 5. Task 2: n8n API Integration Workflow (4:15 - 5:45)
"Moving on to Task 2, I built an automated n8n workflow designed as a daily morning digest for QA automation repositories on GitHub.

Here is how the workflow is structured:
- **Trigger:** A Schedule Trigger that runs every hour.
- **API #1:** An HTTP Request node calling the public GitHub REST API to search repositories with the topic `qa-automation` sorted by stars.
- **Transformation:** A JavaScript Code node that filters out forks, sorts repos by star count descending, slices the array to keep the **Top 5** results, and extracts relevant fields like repo name, owner, stars, language, and description.
- **API #2 Enrichment:** A second HTTP Request node fetching the README metadata for each top repo.
- **IF Condition:** A logic node checking if `stargazers_count >= 1000`.
- **Notification:** Repositories meeting the threshold are sent to a Discord webhook channel formatted as a rich markdown embed card.
- **Error Handling:** HTTP nodes use `onError: continueErrorOutput`. If an API call fails or hits rate limits, execution is routed to an **Error Fallback Logger** node that formats an alert log instead of crashing silently."

---

### 6. Bonus: Uptime Monitor Workflow (5:45 - 6:45)
"For the bonus task, I created a second n8n workflow to monitor web app health. 

It triggers every 5 minutes, sends a `GET` request to the web app API, and a custom JavaScript node tracks exact response latency in milliseconds. An IF node checks if `statusCode != 200` or if latency exceeds 3000ms. If degraded, it posts an immediate incident alert to the Discord channel detailing the status code and response time."

---

### 7. GitHub Repository Structure & Closing (6:45 - 7:30)
"Finally, all deliverables have been organized in a clean GitHub-ready repository:
- `Task1_QA_Report_Krishna.pdf` contains the full bug table, RCA, and recommendations.
- `Task2_Workflow_Krishna.json` and `Bonus_UptimeMonitor_Krishna.json` contain valid, exported n8n workflows without hardcoded secrets.
- `docs/` and `screenshots/` directories house all documentation and evidence.

Thank you for reviewing my assessment! I look forward to discussing my approach in the technical interview."
