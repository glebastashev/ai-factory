import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// The export uses a relative base so it works in any folder. Server markup must keep asset paths
// relative too: hydration does not repair attributes, so a wrong src stays broken in the browser.
test('prerendered markup keeps relative asset paths for a relative base', async () => {
  // Inside the project so the bundle resolves react from node_modules.
  mkdirSync('node_modules/.cache', { recursive: true });
  const outDir = mkdtempSync(join('node_modules/.cache', 'ssr-base-'));
  after(() => rmSync(outDir, { recursive: true, force: true }));
  await build({ base: './', logLevel: 'silent', build: { ssr: 'src/entry-server.jsx', outDir } });
  const { render } = await import(pathToFileURL(join(process.cwd(), outDir, 'entry-server.js')).href);
  const html = render('flow');
  assert.doesNotMatch(html, /src="\/assets\//, 'absolute asset path in prerendered markup');
  assert.match(html, /src="\.\/assets\/brand-icon\.png"/);
});
