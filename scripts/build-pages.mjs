import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const result = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  env: { ...process.env, SITE_BASE_PATH: process.env.SITE_BASE_PATH || '/ai-factory/' },
  stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status || 1);
for (const page of ['index.html', 'version-2.html', 'version-3.html', 'animations.html']) {
  if (!existsSync(resolve(root, 'dist/client', page))) throw new Error(`Missing page: ${page}`);
}
const destination = resolve(root, 'docs');
rmSync(destination, { recursive: true, force: true });
cpSync(resolve(root, 'dist/client'), destination, { recursive: true });
writeFileSync(resolve(destination, '.nojekyll'), '');
console.log('GitHub Pages files prepared in docs/');
