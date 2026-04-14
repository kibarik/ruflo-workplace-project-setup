const fs = require('fs');
const path = require('path');

function detectSourceFiles(projectPath) {
  const extensions = ['.ts', '.js', '.py', '.tsx', '.jsx'];
  const maxDepth = 3;

  function searchRecursive(currentPath, depth) {
    if (depth > maxDepth) return false;
    try {
      const items = fs.readdirSync(currentPath);
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          if (searchRecursive(itemPath, depth + 1)) return true;
        } else {
          const ext = path.extname(item);
          if (extensions.includes(ext)) return true;
        }
      }
    } catch (error) {
      // Skip directories we can't read (node_modules, etc.)
    }
    return false;
  }

  return searchRecursive(projectPath, 0);
}

function checkOnboardingFreshness(projectPath) {
  const statusPath = path.join(
    process.env.HOME,
    '.claude/projects',
    path.basename(projectPath),
    'memory/serena-status.json'
  );
  try {
    const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    const lastOnboarding = new Date(status.lastOnboarding);
    const daysSince = (Date.now() - lastOnboarding) / (1000 * 60 * 60 * 24);
    return daysSince > 7;
  } catch (error) {
    return true;
  }
}

function estimateTaskComplexity(task) {
  if (!task || !task.description) return 0;
  const description = task.description;
  let complexity = 0.3;
  const complexKeywords = [
    'refactor', 'architecture', 'system', 'integration',
    'optimize', 'performance', 'security', 'authentication'
  ];
  const hasComplexKeyword = complexKeywords.some(keyword =>
    description.toLowerCase().includes(keyword)
  );
  if (hasComplexKeyword) complexity += 0.3;
  const simpleKeywords = [
    'create file', 'add comment', 'update readme',
    'fix typo', 'change text'
  ];
  const hasSimpleKeyword = simpleKeywords.some(keyword =>
    description.toLowerCase().includes(keyword)
  );
  if (hasSimpleKeyword) complexity -= 0.2;
  return Math.max(0, Math.min(1, complexity));
}

function shouldUseSerena(task, projectPath) {
  const hasCode = detectSourceFiles(projectPath);
  const complexity = estimateTaskComplexity(task);
  return hasCode && complexity >= 0.3;
}

module.exports = {
  detectSourceFiles,
  checkOnboardingFreshness,
  estimateTaskComplexity,
  shouldUseSerena
};
