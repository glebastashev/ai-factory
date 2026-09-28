import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildBundles, clientDir, prerender, root } from './prerender.mjs';

buildBundles({ SITE_BASE_PATH: process.env.SITE_BASE_PATH || '/ai-factory/' });
for (const page of ['index.html', 'version-2.html', 'version-3.html', 'animations.html']) {
  if (!existsSync(resolve(clientDir, page))) throw new Error(`Missing page: ${page}`);
}
// GitHub Pages hosts design prototypes: keep them out of search so they never compete with the real site.
await prerender(['index.html', 'version-2.html', 'version-3.html'].map(file => ({ file, head: { noindex: true } })));
const destination = resolve(root, 'docs');
rmSync(destination, { recursive: true, force: true });
cpSync(clientDir, destination, { recursive: true });
writeFileSync(resolve(destination, '.nojekyll'), '');
console.log('GitHub Pages files prepared in docs/');
