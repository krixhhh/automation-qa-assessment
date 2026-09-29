# Task 1 — Web App QA & Debug Documentation

**Candidate:** Krishna Kumar  
**Role:** Automation & QA Developer  
**Date:** September 29, 2026  
**Primary Deliverable:** [`Task1_QA_Report_Krishna.pdf`](../../Task1_QA_Report_Krishna.pdf)

---

## 1. Executive Summary

This document details the quality assurance testing, defect discovery, and root-cause analysis performed on the **Conduit RealWorld Web Application** (Angular frontend + Node/Express REST API). Testing focused on assessing application stability, authentication flows, content lifecycle management, API contract validation, and error resilience.

---

## 2. Tested User Flows & Edge Cases

The following 6 core user flows were exercised:
1. **Sign-up:** Account registration using unique email/username, empty payloads, duplicate accounts, and special characters.
2. **Login:** Authentication with valid credentials, invalid passwords, non-existent accounts, and malformed emails.
3. **Create Content:** Article publishing with titles, summary text, body markdown, and tag lists.
4. **Edit Content:** Updating existing article titles, body text, tags, and testing empty field submissions.
5. **Delete Content:** Removing published articles and verifying backend database deletion and UI list synchronization.
6. **Logout:** Terminating active sessions, clearing `localStorage` state, and verifying restricted route access.

---

## 3. Discovered Defects Summary

| # | Bug Title / Summary | Steps to Reproduce | Expected vs Actual Result | Severity | Suspected Cause |
|---|---|---|---|---|---|
| **BUG-01** | Duplicate User Registration Allowed | 1. POST `/api/users` with new email.<br>2. Receive `201 Created`.<br>3. Send POST again with same email. | **Expected:** `422 Unprocessable Entity` ("email taken").<br>**Actual:** `201 Created` with duplicate session token. | **High** | Missing UNIQUE constraint check in user registration controller. |
| **BUG-02** | Public Backend API Down (Cloudflare 530) | 1. Open `demo.realworld.io`.<br>2. Inspect GET `/api/articles`. | **Expected:** `200 OK` JSON articles array.<br>**Actual:** HTTP 530 Cloudflare DNS origin HTML error page. | **Critical** | Production API origin IP down or DNS CNAME record misconfigured. |
| **BUG-03** | Authorization Header Scheme Mismatch | 1. Acquire JWT token.<br>2. Send request with `Authorization: Token <jwt>`. | **Expected:** `201 Created` per RealWorld spec.<br>**Actual:** `401 Unauthorized` (expects `Bearer` prefix). | **Medium** | Passport/Express JWT middleware strictly requires `Bearer` scheme. |
| **BUG-04** | Empty Article Title Allowed on Edit | 1. Edit existing article.<br>2. Clear title field to `""`.<br>3. Submit PUT request. | **Expected:** Validation error blocking submission.<br>**Actual:** Updates DB title to empty string, corrupting slug to `/article/`. | **Medium** | Update service uses `Object.assign` without re-running schema validation. |
| **BUG-05** | Tag Pills Horizontal Overflow in Feed UI | 1. Create tag with 80+ consecutive characters.<br>2. View article feed card. | **Expected:** Tag pill text wraps or truncates.<br>**Actual:** Tag pill overflows feed card container into right sidebar. | **Low** | CSS `.tag-pill` class lacks `max-width` and `word-break: break-all`. |
| **BUG-06** | Expired JWT Token Causes Infinite Loading Canvas | 1. Log into application.<br>2. Corrupt JWT token in `localStorage`.<br>3. Navigate to `/editor`. | **Expected:** Interceptor catches `401`, clears token & redirects to `/login`.<br>**Actual:** Blank canvas with permanent loading spinner. | **High** | Missing global HTTP 401 response interceptor. |

---

## 4. Root Cause Analysis (BUG-01 Highlight)

During exploratory testing of the user sign-up flow, submitting a registration request with an email address that was already registered returned an `HTTP 201 Created` response instead of rejecting the request. This behavior occurs because the user registration controller passes incoming registration payloads directly to the persistence layer without executing an initial uniqueness check on the email and username fields. In the underlying database schema, the email column lacks a SQL `UNIQUE` index constraint, allowing duplicate rows with identical credentials to be created. As a result, when a user registers using an existing email address, the system quietly issues a fresh JWT session token and creates a duplicate database entry without alerting the client. This presents a security flaw and data integrity risk, as it allows session hijacking and account collisions between users sharing an email address. To fix this issue, we must first add a SQL unique constraint on the database level (`ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email)`) and update the user creation service to validate field uniqueness prior to record insertion. Once patched, the fix should be verified by running automated API regression scripts that assert an `HTTP 422 Unprocessable Entity` status code upon duplicate submission.

---

## 5. Screenshot Evidence

All screenshots are stored in [`screenshots/task1/`](../../screenshots/task1/):
- [`screenshots/task1/bug-01-duplicate-signup.png`](../../screenshots/task1/bug-01-duplicate-signup.png)
- [`screenshots/task1/bug-02-api-cloudflare-530.png`](../../screenshots/task1/bug-02-api-cloudflare-530.png)
- [`screenshots/task1/bug-03-auth-header-mismatch.png`](../../screenshots/task1/bug-03-auth-header-mismatch.png)
- [`screenshots/task1/bug-04-empty-title-edit.png`](../../screenshots/task1/bug-04-empty-title-edit.png)
- [`screenshots/task1/bug-05-tag-overflow-sanitization.png`](../../screenshots/task1/bug-05-tag-overflow-sanitization.png)
- [`screenshots/task1/bug-06-expired-session-unhandled.png`](../../screenshots/task1/bug-06-expired-session-unhandled.png)
