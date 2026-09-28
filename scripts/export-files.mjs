// Finds the assets a page can actually load: start from the HTML, follow JS and CSS by file name.
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

export function reachableAssets(indexHtml, files) {
  const kept = new Set();
  const queue = [indexHtml];
  while (queue.length) {
    const text = queue.shift();
    for (const [name, content] of files) {
      if (kept.has(name) || !(text.includes(name) || text.includes(name.split('/').pop()))) continue;
      kept.add(name);
      if (/\.(js|css)$/.test(name)) queue.push(content);
    }
  }
  return kept;
}

export function pruneAssets(siteDir) {
  const assetsDir = join(siteDir, 'assets');
  const names = readdirSync(assetsDir, { recursive: true }).filter(name => name.includes('.'));
  const files = new Map(names.map(name => [name, /\.(js|css)$/.test(name) ? readFileSync(join(assetsDir, name), 'utf8') : '']));
  const kept = reachableAssets(readFileSync(join(siteDir, 'index.html'), 'utf8'), files);
  const removed = names.filter(name => !kept.has(name));
  removed.forEach(name => rmSync(join(assetsDir, name)));
  return removed;
}

// Russian shared hosting (REG.RU, Beget, Timeweb) runs Apache: compress text and fonts, cache hashed bundles.
export function buildHtaccess() {
  return [
    'AddType image/webp .webp',
    'AddType font/ttf .ttf',
    'AddType text/plain .txt',
    'AddDefaultCharset utf-8',
    '',
    // AddOutputFilterByType comes from mod_filter; unguarded it turns the whole site into a 500 error.
    '<IfModule mod_deflate.c>',
    '<IfModule mod_filter.c>',
    '  AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/xml text/javascript application/javascript application/json image/svg+xml font/ttf',
    '</IfModule>',
    '</IfModule>',
    '',
    '<IfModule mod_expires.c>',
    '  ExpiresActive On',
    '  ExpiresByType text/html "access plus 0 seconds"',
    '  ExpiresByType text/javascript "access plus 1 year"',
    '  ExpiresByType application/javascript "access plus 1 year"',
    '  ExpiresByType text/css "access plus 1 year"',
    '  ExpiresByType font/ttf "access plus 1 year"',
    '  ExpiresByType image/webp "access plus 1 month"',
    '  ExpiresByType image/png "access plus 1 month"',
    '  ExpiresByType image/jpeg "access plus 1 month"',
    '</IfModule>',
    '',
  ].join('\n');
}
