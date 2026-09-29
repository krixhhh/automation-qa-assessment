const fs = require('fs');

const filesToScan = [
  'Task2_Workflow_Krishna.json',
  'Bonus_UptimeMonitor_Krishna.json',
  'README.md',
  'docs/task1/README.md',
  'docs/task2/README.md',
  'docs/bonus/README.md',
  'loom/LOOM_SCRIPT.md'
];

console.log('=== SCANNING FOR HARDCODED SECRETS / TOKENS ===');
let leaksFound = 0;

for (const file of filesToScan) {
  const content = fs.readFileSync(file, 'utf8');
  // Check for real discord webhook tokens (e.g. /webhooks/12345/abcde)
  const webhookMatches = content.match(/https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+/g);
  if (webhookMatches) {
    console.error(`[LEAK ALERT] Real Discord Webhook URL found in ${file}:`, webhookMatches);
    leaksFound++;
  }
  // Check for hardcoded bot tokens or api keys
  const tokenMatches = content.match(/(?:bearer|token|key|secret)\s*[:=]\s*["'](?![${])[A-Za-z0-9_\-=]{20,}["']/gi);
  if (tokenMatches) {
    console.error(`[LEAK ALERT] Secret key pattern found in ${file}:`, tokenMatches);
    leaksFound++;
  }
}

if (leaksFound === 0) {
  console.log('=== NO HARDCODED SECRETS FOUND. CLEAN SECURITY PASS! ===');
} else {
  console.error(`=== FAILED: ${leaksFound} POTENTIAL LEAKS FOUND ===`);
}
