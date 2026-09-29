const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'README.md',
  'docs/task1/README.md',
  'docs/task2/README.md',
  'docs/bonus/README.md',
  'loom/LOOM_SCRIPT.md'
];

const requiredDeliverables = [
  'Task1_QA_Report_Krishna.pdf',
  'Task2_Workflow_Krishna.json',
  'Bonus_UptimeMonitor_Krishna.json',
  'screenshots/task1/bug-01-duplicate-signup.png',
  'screenshots/task1/bug-02-api-cloudflare-530.png',
  'screenshots/task1/bug-03-auth-header-mismatch.png',
  'screenshots/task1/bug-04-empty-title-edit.png',
  'screenshots/task1/bug-05-tag-overflow-sanitization.png',
  'screenshots/task1/bug-06-expired-session-unhandled.png',
  'screenshots/task2/workflow-canvas.png',
  'screenshots/task2/successful-execution.png',
  'screenshots/bonus/uptime-workflow.png'
];

console.log('=== VERIFYING FILE EXISTENCE FOR ALL DELIVERABLES ===');

let missing = 0;
for (const file of requiredDeliverables) {
  if (fs.existsSync(file)) {
    console.log(`[OK] ${file} exists (${fs.statSync(file).size} bytes)`);
  } else {
    console.error(`[MISSING] ${file}`);
    missing++;
  }
}

if (missing === 0) {
  console.log('\n=== ALL DELIVERABLE FILES EXIST AND ARE VERIFIED ===');
} else {
  console.error(`\n=== FAILED: ${missing} FILES MISSING ===`);
}
