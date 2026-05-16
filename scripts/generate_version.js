const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outputPath = path.join(__dirname, '../src/version.json');

function sh(cmd, fallback) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return fallback;
  }
}

// Commit count is monotonically increasing — it always goes up with each commit.
const build = parseInt(sh('git rev-list --count HEAD', '0'), 10);
const commit = sh('git rev-parse --short HEAD', 'local');
const date = new Date().toISOString();

const version = { build, commit, date };

fs.writeFileSync(outputPath, JSON.stringify(version, null, 2) + '\n');
console.log(`Genereret src/version.json: build ${build} (${commit})`);
