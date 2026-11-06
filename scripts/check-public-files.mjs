import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// This checks tracked filenames only, not file contents or secrets. Review any
// addition before extending this list. CI cannot remove data already pushed.
const allowed = new Set([
  '.github/workflows/pages.yml',
  '.gitignore',
  'LICENSE',
  'PROVENANCE.md',
  'README.md',
  'drill.js',
  'encounters.js',
  'engine.js',
  'expansions.js',
  'figures.js',
  'game.js',
  'hints.js',
  'index.html',
  'landing-art.svg',
  'logo.svg',
  'mark.svg',
  'narrative.js',
  'package.json',
  'practice.js',
  'scenes.js',
  'school.js',
  'scripts/build.mjs',
  'scripts/check-public-files.mjs',
  'scripts/title-art.mjs',
  'style.css',
  'tests/campaign.test.js',
  'tests/drill.test.js',
  'tests/fixtures/legacy-op3.json',
  'tests/fixtures/legacy-op6.json',
  'tests/harness.js',
  'tests/interface.test.js',
  'tests/narrative-continuity.test.js',
  'tests/narrative.test.js',
  'tests/practice.test.js',
  'tests/school.test.js',
  'tests/tutorial.test.js',
  'tutorial.js',
]);

if (!existsSync(path.join(root, '.git'))) {
  console.error('The public-file check requires a Git checkout. Source downloads can still run npm test and npm run build.');
  process.exit(1);
}

let files;
try {
  files = execFileSync('git', ['ls-files', '-z'], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).split('\0').filter(Boolean);
} catch {
  console.error('Could not list tracked files. The public-file check requires Git and a readable checkout.');
  process.exit(1);
}

const unexpected = [...new Set(files.filter(file => !allowed.has(file)))].sort();
if (unexpected.length) {
  console.error('Unexpected tracked files outside the public release allowlist:');
  for (const file of unexpected) console.error(`  ${JSON.stringify(file)}`);
  process.exit(1);
}

console.log(`Public-file check passed: ${new Set(files).size} tracked filenames are allowed.`);
