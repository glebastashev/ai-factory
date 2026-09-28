import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const assets = 'public/assets';
const sources = ['src', '.'].flatMap(dir => readdirSync(dir)
  .filter(name => /\.(jsx?|html)$/.test(name))
  .map(name => readFileSync(join(dir, name), 'utf8')));
const referenced = new Set(sources.flatMap(code =>
  [...code.matchAll(/['"(/]((?:cases\/)?[\w-]+\.(?:png|jpe?g|webp))['")]/g)].map(match => match[1])));
const files = readdirSync(assets, { recursive: true })
  .filter(name => /\.(png|jpe?g|webp)$/.test(name));

test('every image the code refers to exists', () => {
  for (const name of referenced) assert.ok(existsSync(join(assets, name)), `missing ${name}`);
});

test('the build ships no images that nothing uses', () => {
  const unused = files.filter(name => !referenced.has(name) && name !== 'og-image.jpg');
  assert.deepEqual(unused, []);
});

test('no image is heavier than 400 KB', () => {
  const heavy = files
    .map(name => ({ name, kb: Math.round(statSync(join(assets, name)).size / 1024) }))
    .filter(file => file.kb > 400);
  assert.deepEqual(heavy, []);
});
