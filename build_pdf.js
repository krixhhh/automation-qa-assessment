const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generatePdfReport() {
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    bufferPages: true
  });

  const writeStream = fs.createWriteStream('Task1_QA_Report_Krishna.pdf');
  doc.pipe(writeStream);

  // Colors
  const primaryColor = '#1e293b'; // slate 800
  const secondaryColor = '#0f766e'; // teal 700
  const lightBg = '#f8fafc';
  const borderColor = '#cbd5e1';
  const textColor = '#334155';

  // --- HEADER SECTION ---
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill('#0f172a');

  doc
    .fillColor('#ffffff')
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('Automation & QA Developer', 40, 25);

  doc
    .fontSize(13)
    .font('Helvetica')
    .fillColor('#94a3b8')
    .text('Task 1 — Web App QA & Debug Report', 40, 52);

  doc
    .fontSize(9)
    .fillColor('#cbd5e1')
    .text('Candidate: Krishna Kumar  |  Date: September 29, 2026', 40, 75);

  doc.y = 120;

  // Metadata Box
  doc
    .rect(40, doc.y, doc.page.width - 80, 55)
    .fillAndStroke(lightBg, borderColor);

  const metaY = doc.y + 10;
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('Application Tested:', 50, metaY)
    .font('Helvetica')
    .fillColor(textColor)
    .text('Conduit RealWorld Web Application (Angular Frontend + Node/Express REST API)', 160, metaY);

  doc
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('Test Environment:', 50, metaY + 15)
    .font('Helvetica')
    .fillColor(textColor)
    .text('Chrome 122 (Windows 11), Node.js v24.17.0, REST Client & DevTools Network Inspector', 160, metaY + 15);

  doc
    .font('Helvetica-Bold')
    .fillColor(primaryColor)
    .text('Primary Focus:', 50, metaY + 30)
    .font('Helvetica')
    .fillColor(textColor)
    .text('End-to-End Functional Flows, API Contract Validation, Edge Cases & Error Recovery', 160, metaY + 30);

  doc.y = metaY + 55;

  // --- 1. SCOPE ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('1. Scope & Objective', 40, doc.y);

  doc.moveDown(0.4);
  doc
    .fontSize(9.5)
    .font('Helvetica')
    .fillColor(textColor)
    .text(
      'The objective of this assessment was to perform comprehensive exploratory, functional, and edge-case testing on the Conduit RealWorld web application. Testing covered core user authentication, content creation lifecycle, payload validation, token state management, and API resilience to identify critical bugs and usability issues that block production deployment.',
      { width: doc.page.width - 80, align: 'justify' }
    );

  doc.moveDown(1);

  // --- 2. TEST FLOWS ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('2. Core User Flows Tested', 40, doc.y);

  doc.moveDown(0.4);

  const flows = [
    { title: 'Sign-up', desc: 'Account creation with unique credentials, empty inputs, duplicate emails, and special characters.' },
    { title: 'Login', desc: 'Authentication with valid credentials, invalid passwords, non-existent users, and empty fields.' },
    { title: 'Create Content', desc: 'Publishing articles with title, summary, body markdown, and tag list.' },
    { title: 'Edit Content', desc: 'Updating existing article titles, body text, tags, and handling empty payload submissions.' },
    { title: 'Delete Content', desc: 'Removing published articles and verifying API persistence and UI list synchronization.' },
    { title: 'Logout', desc: 'Terminating user sessions, clearing localStorage state, and restricting unauthorized page access.' }
  ];

  flows.forEach((item) => {
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(`• ${item.title}: `, { continued: true })
      .font('Helvetica')
      .fillColor(textColor)
      .text(item.desc);
    doc.moveDown(0.25);
  });

  doc.moveDown(1);

  // --- 3. BUG REPORT ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('3. Bug Report (Defect Summary Table)', 40, doc.y);

  doc.moveDown(0.5);

  // Table Headers
  const tableTop = doc.y;
  const colX = [40, 65, 175, 305, 415, 470]; // Column start X coords
  const colW = [25, 110, 130, 110, 55, 85];  // Column widths

  doc
    .rect(40, tableTop, doc.page.width - 80, 20)
    .fill('#1e293b');

  doc
    .fontSize(8.5)
    .font('Helvetica-Bold')
    .fillColor('#ffffff');

  doc.text('#', colX[0] + 5, tableTop + 5);
  doc.text('Title / Summary', colX[1], tableTop + 5);
  doc.text('Steps to Reproduce', colX[2], tableTop + 5);
  doc.text('Expected vs Actual', colX[3], tableTop + 5);
  doc.text('Severity', colX[4], tableTop + 5);
  doc.text('Suspected Cause', colX[5], tableTop + 5);

  let currentY = tableTop + 20;

  const bugs = [
    {
      id: '1',
      title: 'Duplicate User Registration Allowed',
      steps: '1. POST /api/users with new email.\n2. Receive 201 Created.\n3. POST again with same email.',
      expVsAct: 'Exp: 422 Unprocessable Entity (email taken).\nAct: 201 Created with duplicate user token.',
      severity: 'High',
      cause: 'Missing unique index check in user creation controller.'
    },
    {
      id: '2',
      title: 'Public API Endpoint Down (Cloudflare 530)',
      steps: '1. Open demo.realworld.io.\n2. Inspect GET /api/articles.',
      expVsAct: 'Exp: 200 OK with JSON articles array.\nAct: HTTP 530 Cloudflare DNS Origin HTML error.',
      severity: 'Critical',
      cause: 'Production backend origin server IP down or DNS unmapped.'
    },
    {
      id: '3',
      title: 'Authorization Header Scheme Mismatch',
      steps: '1. Acquire JWT token.\n2. Send request with Authorization: Token <jwt>.',
      expVsAct: 'Exp: 201 Created per RealWorld spec.\nAct: 401 Unauthorized (expects Bearer prefix).',
      severity: 'Medium',
      cause: 'JWT strategy requires Bearer scheme without Token fallback.'
    },
    {
      id: '4',
      title: 'Empty Article Title Allowed on Edit',
      steps: '1. Edit existing article.\n2. Clear title field to "".\n3. Click Save / PUT payload.',
      expVsAct: 'Exp: Validation error block submit.\nAct: Updates DB title to empty, breaks slug /article/.',
      severity: 'Medium',
      cause: 'Update service uses Object.assign without schema re-validation.'
    },
    {
      id: '5',
      title: 'Tag Pills Horizontal Overflow in Feed',
      steps: '1. Create tag with 80+ chars.\n2. View article feed card.',
      expVsAct: 'Exp: Tag text wraps or truncates.\nAct: Pill overflows container outside card layout.',
      severity: 'Low',
      cause: 'CSS .tag-pill lacks max-width & word-break properties.'
    },
    {
      id: '6',
      title: 'Expired JWT Token Causes Infinite Spinner',
      steps: '1. Log in to app.\n2. Corrupt JWT in localStorage.\n3. Navigate to /editor.',
      expVsAct: 'Exp: Interceptor catches 401 & redirects to /login.\nAct: Blank UI with permanent loading indicator.',
      severity: 'High',
      cause: 'Missing global 401 HTTP interceptor to trigger auth logout.'
    }
  ];

  bugs.forEach((b, idx) => {
    const rowHeight = 48;
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';

    // Page overflow check
    if (currentY + rowHeight > doc.page.height - 50) {
      doc.addPage();
      currentY = 40;
    }

    doc
      .rect(40, currentY, doc.page.width - 80, rowHeight)
      .fillAndStroke(bg, '#e2e8f0');

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(b.id, colX[0] + 5, currentY + 4);

    doc
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(b.title, colX[1], currentY + 4, { width: colW[1] - 5 });

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(b.steps, colX[2], currentY + 4, { width: colW[2] - 5 });

    doc
      .text(b.expVsAct, colX[3], currentY + 4, { width: colW[3] - 5 });

    // Severity styling
    let sevColor = '#0369a1';
    if (b.severity === 'Critical') sevColor = '#b91c1c';
    if (b.severity === 'High') sevColor = '#c2410c';
    if (b.severity === 'Medium') sevColor = '#d97706';

    doc
      .font('Helvetica-Bold')
      .fillColor(sevColor)
      .text(b.severity, colX[4], currentY + 4, { width: colW[4] - 5 });

    doc
      .font('Helvetica')
      .fillColor(textColor)
      .text(b.cause, colX[5], currentY + 4, { width: colW[5] - 5 });

    currentY += rowHeight;
  });

  doc.y = currentY + 15;

  // New page for RCA & Recommendations
  doc.addPage();

  // --- 4. ROOT CAUSE ANALYSIS ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('4. Root Cause Analysis (Deep Dive — Bug #1)', 40, 40);

  doc.moveDown(0.5);

  doc
    .fontSize(9.5)
    .font('Helvetica')
    .fillColor(textColor)
    .text(
      'During exploratory testing of the user sign-up flow, I discovered that submitting a registration request with an email address that was already registered returned an HTTP 201 Created response instead of rejecting the request. This behavior occurs because the user registration controller passes incoming registration payloads directly to the persistence layer without executing an initial uniqueness check on the email and username fields. In the underlying database schema, the email column lacks a SQL UNIQUE index constraint, allowing duplicate rows with identical credentials to be created. As a result, when a user registers using an existing email address, the system quietly issues a fresh JWT session token and creates a duplicate database entry without alerting the client. This presents a critical security flaw and data integrity risk, as it allows session hijacking and account collisions between users sharing an email address. To fix this issue, we must first add a SQL unique constraint on the database level (e.g., ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email)) and update the user creation service to validate field uniqueness prior to record insertion. Once the backend patch is applied, the fix should be verified by running automated API regression scripts that assert an HTTP 422 Unprocessable Entity status code and structured validation error messages ("email has already been taken") upon duplicate account submission.',
      { width: doc.page.width - 80, align: 'justify', lineGap: 3 }
    );

  doc.moveDown(1.5);

  // --- 5. RECOMMENDATIONS ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('5. Recommendations for Engineering Team', 40, doc.y);

  doc.moveDown(0.5);

  const recs = [
    { title: 'Database Schema Enforcement', detail: 'Apply strict UNIQUE and NOT NULL constraints at the database level to prevent invalid data bypass.' },
    { title: 'Global HTTP Error Interceptor', detail: 'Implement an Axios/Angular HTTP interceptor to catch 401/403 responses globally, clear stale localStorage tokens, and gracefully redirect users to login.' },
    { title: 'Input Sanitization & CSS Containment', detail: 'Sanitize markdown HTML inputs with DOMPurify and add overflow-wrap: break-word to tag pills to prevent UI breaking.' },
    { title: 'API Specification Middleware', detail: 'Ensure authorization middleware supports both "Token" and "Bearer" header prefixes for backward compatibility.' }
  ];

  recs.forEach((r) => {
    doc
      .fontSize(9.5)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(`• ${r.title}: `, { continued: true })
      .font('Helvetica')
      .fillColor(textColor)
      .text(r.detail);
    doc.moveDown(0.4);
  });

  doc.moveDown(1);

  // --- 6. EVIDENCE REFERENCES ---
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor(secondaryColor)
    .text('6. Evidence & Screenshot Cross-References', 40, doc.y);

  doc.moveDown(0.5);

  const evidenceList = [
    { file: 'screenshots/task1/bug-01-duplicate-signup.png', label: 'Bug 1 Duplicate Account Submission & Token Response' },
    { file: 'screenshots/task1/bug-02-api-cloudflare-530.png', label: 'Bug 2 Production Backend API Cloudflare 530 Direct IP Access Failure' },
    { file: 'screenshots/task1/bug-03-auth-header-mismatch.png', label: 'Bug 3 Authorization Header Token vs Bearer 401 Rejection' },
    { file: 'screenshots/task1/bug-04-empty-title-edit.png', label: 'Bug 4 Blank Article Title Update & Corrupted Slug Generation' },
    { file: 'screenshots/task1/bug-05-tag-overflow-sanitization.png', label: 'Bug 5 Tag Pill Container Horizontal Overflow in Feed UI' },
    { file: 'screenshots/task1/bug-06-expired-session-unhandled.png', label: 'Bug 6 Stale JWT Expiration Infinite Loading Canvas State' }
  ];

  evidenceList.forEach((e) => {
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(primaryColor)
      .text(`${e.file} — `, { continued: true })
      .font('Helvetica')
      .fillColor(textColor)
      .text(e.label);
    doc.moveDown(0.3);
  });

  doc.end();
  console.log('PDF report Task1_QA_Report_Krishna.pdf generated successfully!');
}

generatePdfReport();
