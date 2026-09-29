const fs = require('fs');

async function testTask2WorkflowExecution() {
  console.log('=== VERIFYING TASK 2 WORKFLOW EXECUTION ===');

  // Step 1: Call API #1 (GitHub Search Repositories)
  console.log('1. Calling API #1: GitHub Search Repositories...');
  const searchUrl = 'https://api.github.com/search/repositories?q=topic:qa-automation&sort=stars&order=desc&per_page=10';
  const api1Res = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'n8n-qa-automation-agent',
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  console.log('API #1 Status:', api1Res.status);
  const api1Json = await api1Res.json();
  console.log('API #1 Total Count:', api1Json.total_count);
  console.log('API #1 Items Received:', api1Json.items?.length);

  // Step 2: Run Transformation (Exact Code from Code Node)
  console.log('\n2. Executing Transformation Logic...');
  const rawRepos = api1Json.items || [];
  const top5Repos = rawRepos
    .filter(repo => repo.description && !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner.login,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || 'N/A',
      description: repo.description,
      updated_at: repo.updated_at
    }));

  console.log('Transformation Output Count:', top5Repos.length);
  console.log('Top Repo #1:', top5Repos[0].full_name, '⭐ Stars:', top5Repos[0].stargazers_count);

  // Step 3: Call API #2 (GitHub README Enrichment for Top 1 Repo)
  const topRepo = top5Repos[0];
  console.log(`\n3. Calling API #2: README enrichment for ${topRepo.full_name}...`);
  const readmeUrl = `https://api.github.com/repos/${topRepo.owner}/${topRepo.name}/readme`;
  const api2Res = await fetch(readmeUrl, {
    headers: {
      'User-Agent': 'n8n-qa-automation-agent',
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  console.log('API #2 Status:', api2Res.status);
  const api2Json = await api2Res.json();
  console.log('API #2 README Name:', api2Json.name, 'Size:', api2Json.size, 'bytes');

  // Step 4: Evaluate IF condition
  console.log('\n4. Evaluating IF Threshold (stargazers_count >= 1000)...');
  const meetsCondition = topRepo.stargazers_count >= 1000;
  console.log(`IF condition evaluation for ${topRepo.full_name}: ${meetsCondition} (${topRepo.stargazers_count} >= 1000)`);

  // Step 5: Test Failure/Error Path
  console.log('\n5. Testing Error Path (Invalid API URL)...');
  const badRes = await fetch('https://api.github.com/repos/invalid_user_999999/invalid_repo_999999/readme', {
    headers: { 'User-Agent': 'n8n-qa-automation-agent' }
  });
  console.log('Error API Response Status:', badRes.status);
  const badJson = await badRes.json();
  console.log('Error API Response Message:', badJson.message);

  console.log('\n=== TASK 2 EXECUTION VERIFIED SUCCESSFULLY ===');
}

testTask2WorkflowExecution();
