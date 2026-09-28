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

test('.htaccess keeps the bot settings and stored leads out of reach', async () => {
  const { buildHtaccess } = await import('../scripts/export-files.mjs');
  const rules = buildHtaccess();
  assert.match(rules, /<FilesMatch "\^lead-config[^"]*">[\s\S]*Require all denied[\s\S]*<\/FilesMatch>/);
  assert.match(rules, /RedirectMatch 404 \/lead-data\//);
});

test('the export ships the lead handler and a settings template, never real settings', async () => {
  const { mkdtempSync, existsSync, readFileSync, writeFileSync, mkdirSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { copyLeadHandler } = await import('../scripts/export-files.mjs');
  const repo = mkdtempSync(join(tmpdir(), 'repo-'));
  mkdirSync(join(repo, 'server'));
  writeFileSync(join(repo, 'server/send.php'), '<?php // handler');
  writeFileSync(join(repo, 'server/lead-config.example.php'), '<?php return [];');
  writeFileSync(join(repo, 'server/lead-config.php'), '<?php return ["bot_token" => "SECRET"];');
  const site = mkdtempSync(join(tmpdir(), 'site-'));
  copyLeadHandler(repo, site);
  assert.ok(existsSync(join(site, 'send.php')));
  assert.ok(existsSync(join(site, 'lead-config.example.php')));
  assert.ok(!existsSync(join(site, 'lead-config.php')), 'real settings must never be exported');
  assert.match(readFileSync(join(site, 'lead-data/.htaccess'), 'utf8'), /Require all denied/);
  assert.match(readFileSync(join(site, 'lead-data/index.php'), 'utf8'), /http_response_code\(404\)/);
});
