# Automation & QA Developer

**Candidate:** Krishna Kumar  
**Role:** Automation & QA Developer  

## Overview

This repository contains the completed take-home assessment for the Automation & QA Developer role. The work covers three core areas:
- **Web application QA & debugging:** Comprehensive functional testing, bug reporting, and root-cause analysis on a web application.
- **n8n API integration:** An automated workflow querying public APIs, transforming data, enriching payload details, routing based on conditional logic, and dispatching notifications with error fallback logic.
- **Uptime monitoring (Bonus):** A secondary n8n workflow tracking web application HTTP status and response time metrics with automated incident alerting.

---

## Assessment Deliverables

| Deliverable | File | Description |
|---|---|---|
| **Task 1 QA Report** | [`Task1_QA_Report_Krishna.pdf`](Task1_QA_Report_Krishna.pdf) | Detailed QA report containing findings, reproduction steps, severity, root-cause analysis, and recommendations. |
| **Task 2 n8n Workflow** | [`Task2_Workflow_Krishna.json`](Task2_Workflow_Krishna.json) | Exported n8n workflow JSON incorporating GitHub REST APIs, JavaScript data transformation, README enrichment, IF routing, and Discord notifications. |
| **Bonus Uptime Monitor** | [`Bonus_UptimeMonitor_Krishna.json`](Bonus_UptimeMonitor_Krishna.json) | Exported n8n workflow JSON monitoring HTTP availability, tracking response latency, and triggering failure alerts. |

---

## Task 1 — Web Application QA

- **Application Tested:** Conduit RealWorld Web Application (Angular frontend + REST API backend).
- **Main User Flows Tested:** Sign-up, Login, Create content (article), Edit content, Delete content, and Logout.
- **Findings:** Identified **6 reproducible, verified issues** across user authentication, payload validation, header handling, UI layout, and error recovery.

### High-Level Defect Summary
1. **Duplicate User Registration:** Backend allows duplicate account submissions without returning an HTTP 422 error.
2. **Public API Origin Availability:** Primary production backend returns an HTTP 530 Cloudflare DNS origin error.
3. **Authorization Header Mismatch:** Protected endpoints reject standard `Authorization: Token` headers in favor of `Bearer`.
4. **Empty Article Title Accepted on Edit:** Submitting a blank title on edit updates the database and creates a broken URL slug.
5. **Long Tag UI Overflow:** Tags with long unbroken strings overflow feed card containers horizontally.
6. **Expired Session Loading Issue:** Expired JWT tokens cause protected routes to stall on a blank loading screen without redirecting to login.

For full reproduction steps, expected vs. actual behavior, and the root-cause analysis, view [`Task1_QA_Report_Krishna.pdf`](Task1_QA_Report_Krishna.pdf) or [`docs/task1/README.md`](docs/task1/README.md).

---

## Task 2 — n8n API Integration

The main workflow queries GitHub's REST API for popular QA automation repositories, reshapes the data to select the top items, enriches each repository with README metadata, evaluates star thresholds, and posts formatted digest alerts to Discord.

```text
Schedule Trigger
  └─► GitHub REST API (Search Repos)
        └─► Code Transformation (Filter & Select Top 5)
              └─► GitHub README Enrichment
                    └─► IF Condition (Stars >= 1000)
                          ├─► Discord Webhook Notification
                          └─► Error Fallback Logger
```

| Component | Purpose |
|---|---|
| **Schedule Trigger** | Starts the workflow automatically on a recurring interval. |
| **GitHub API** | Retrieves repository data matching topic search criteria. |
| **Code node** | Filters out forks, sorts by stargazers count, and extracts the top 5 items. |
| **Second GitHub API** | Enriches selected repositories with README metadata. |
| **IF node** | Evaluates repository popularity against the configured star threshold. |
| **Discord** | Sends formatted digest cards to the notification destination. |
| **Error fallback** | Captures API failures and routes to logging without failing silently. |

Workflow file: [`Task2_Workflow_Krishna.json`](Task2_Workflow_Krishna.json)

---

## Bonus — Uptime Monitor

The Uptime Monitor workflow provides automated operational monitoring for the target web application:
- Runs automatically on a **5-minute schedule**.
- Issues HTTP `GET` requests to check service availability.
- Measures exact round-trip **response time metrics**.
- Evaluates health conditions (`HTTP status != 200` or `latency > 3000ms`) and dispatches incident alerts to Discord when degradation occurs.

Workflow file: [`Bonus_UptimeMonitor_Krishna.json`](Bonus_UptimeMonitor_Krishna.json)

---

## Evidence

All visual evidence and workflow execution outputs are saved in the [`screenshots/`](screenshots/) directory:

- **Task 1 Defect Evidence:** [`screenshots/task1/`](screenshots/task1/)
- **Task 2 Workflow Canvas:** [`screenshots/task2/workflow-canvas.png`](screenshots/task2/workflow-canvas.png)
- **Task 2 Successful Execution:** [`screenshots/task2/successful-execution.png`](screenshots/task2/successful-execution.png)
- **Bonus Uptime Workflow Canvas:** [`screenshots/bonus/uptime-workflow.png`](screenshots/bonus/uptime-workflow.png)

---

## Documentation

Detailed documentation for each section is available in the [`docs/`](docs/) directory:

- Task 1 Documentation: [`docs/task1/README.md`](docs/task1/README.md)
- Task 2 Documentation: [`docs/task2/README.md`](docs/task2/README.md)
- Bonus Task Documentation: [`docs/bonus/README.md`](docs/bonus/README.md)
- Loom Script: [`loom/LOOM_SCRIPT.md`](loom/LOOM_SCRIPT.md)

---

## Running the n8n Workflows

1. Open your self-hosted or cloud n8n instance.
2. Import the desired workflow JSON ([`Task2_Workflow_Krishna.json`](Task2_Workflow_Krishna.json) or [`Bonus_UptimeMonitor_Krishna.json`](Bonus_UptimeMonitor_Krishna.json)).
3. Configure the required notification credential (e.g. Header Auth / Webhook URL) in n8n's Credential Store.
4. Execute the workflow manually for testing or activate the schedule trigger.
5. Review output data in n8n's execution panel.

---

## Repository Structure

```text
automation-qa-assessment/
├── README.md
├── Task1_QA_Report_Krishna.pdf
├── Task2_Workflow_Krishna.json
├── Bonus_UptimeMonitor_Krishna.json
├── docs/
├── screenshots/
└── loom/
```

---

## Submission

This repository contains all assessment deliverables, exported workflows, documentation, and verified screenshot evidence.
