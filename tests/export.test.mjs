import test from 'node:test';
import assert from 'node:assert/strict';
import { reachableAssets } from '../scripts/export-files.mjs';

test('the export keeps only assets the page can reach', () => {
  const html = '<link rel="icon" href="./assets/brand-icon.png"><script type="module" src="./assets/main-1.js"></script>'
    + '<link rel="stylesheet" href="./assets/main-2.css"><meta property="og:image" content="assets/og-image.jpg">';
  const files = new Map([
    ['main-1.js', 'import "./client-3.js"; const img = "assets/editorial-manager.webp";'],
    ['client-3.js', 'react'],
    ['main-2.css', 'body{}'],
    ['brand-icon.png', ''], ['og-image.jpg', ''], ['editorial-manager.webp', ''],
    ['animations-9.js', 'lab'], ['animations-9.css', '@font-face{src:url(./Unbounded-variable-X.ttf)}'],
    ['Unbounded-variable-X.ttf', ''], ['cases/yardestate-home.webp', ''],
  ]);
  files.set('main-1.js', files.get('main-1.js') + ' "cases/yardestate-home.webp"');
  assert.deepEqual([...reachableAssets(html, files)].sort(), [
    'brand-icon.png', 'cases/yardestate-home.webp', 'client-3.js', 'editorial-manager.webp',
    'main-1.js', 'main-2.css', 'og-image.jpg',
  ]);
});

test('.htaccess compresses text and fonts and caches hashed bundles on Apache hosting', async () => {
  const { buildHtaccess } = await import('../scripts/export-files.mjs');
  const rules = buildHtaccess();
  assert.match(rules, /AddOutputFilterByType DEFLATE[^\n]*text\/javascript[^\n]*application\/javascript[^\n]*font\/ttf/);
  // AddOutputFilterByType lives in mod_filter: without the guard Apache answers 500 for the whole site.
  assert.match(rules, /<IfModule mod_filter\.c>\s*AddOutputFilterByType/);
  assert.match(rules, /ExpiresByType text\/javascript "access plus 1 year"/);
  assert.match(rules, /AddType image\/webp \.webp/);
  assert.match(rules, /ExpiresByType application\/javascript "access plus 1 year"/);
  assert.match(rules, /ExpiresByType text\/html "access plus 0 seconds"/);
});
