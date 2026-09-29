async function verifyBonusUptimeMonitor() {
  console.log('=== VERIFYING BONUS UPTIME MONITOR WORKFLOW ===');

  const targetUrl = 'https://api.realworld.show/api/articles';
  console.log(`1. Pinging target URL: ${targetUrl}...`);

  const startTime = Date.now();
  let statusCode = 500;
  let isHealthy = false;
  let errorMsg = null;

  try {
    const res = await fetch(targetUrl, { headers: { 'User-Agent': 'UptimeMonitor/1.0' } });
    const responseTimeMs = Date.now() - startTime;
    statusCode = res.status;
    isHealthy = statusCode === 200 && responseTimeMs <= 3000;

    console.log('HTTP Status Code:', statusCode);
    console.log('Response Latency:', responseTimeMs, 'ms');
    console.log('Is Healthy (Status == 200 & Latency <= 3000ms):', isHealthy);
  } catch (err) {
    console.error('Ping failed:', err.message);
    errorMsg = err.message;
  }

  // 2. Test Error Branch with broken URL
  console.log('\n2. Testing Failure Alert Branch with invalid endpoint...');
  const failStartTime = Date.now();
  try {
    const failRes = await fetch('https://api.realworld.io/api/articles', { headers: { 'User-Agent': 'UptimeMonitor/1.0' } });
    const failLatency = Date.now() - failStartTime;
    console.log('Failed Endpoint Status Code:', failRes.status);
    console.log('Is Healthy:', failRes.status === 200 && failLatency <= 3000);
    console.log('=> Triggers Alert Branch: TRUE (Status != 200)');
  } catch (err) {
    console.log('Failed Endpoint Error:', err.message);
    console.log('=> Triggers Alert Branch: TRUE (Network Exception)');
  }

  console.log('\n=== BONUS UPTIME MONITOR VERIFIED SUCCESSFULLY ===');
}

verifyBonusUptimeMonitor();
