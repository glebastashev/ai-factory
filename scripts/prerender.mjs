// Builds the client and server bundles, then writes page text into the HTML files.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildHead, injectPrerender } from './seo.mjs';

export const root = fileURLToPath(new URL('..', import.meta.url));
export const clientDir = resolve(root, 'dist/client');

const decode = value => value
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export function buildBundles(env) {
  for (const args of [['vite', 'build'], ['vite', 'build', '--ssr', 'src/entry-server.jsx']]) {
    const result = spawnSync('npx', args, { cwd: root, env: { ...process.env, ...env }, stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
  }
}

// pages: [{ file, head }] where head holds buildHead options; missing title/description stay as in the template.
export async function prerender(pages) {
  const { render, seoData } = await import(pathToFileURL(resolve(root, 'dist/server/entry-server.js')).href);
  for (const { file, head = {} } of pages) {
    const path = resolve(clientDir, file);
    const template = readFileSync(path, 'utf8');
    const variant = template.match(/<div id="root"[^>]*data-hero-variant="(\w+)"/)?.[1] || 'cards';
    const current = {
      title: decode(template.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''),
      description: decode(template.match(/<meta name="description" content="([^"]*)"/)?.[1] || ''),
    };
    const headHtml = buildHead({ data: seoData, ...(head.noindex ? current : {}), ...head });
    writeFileSync(path, injectPrerender(template, { head: headHtml, markup: render(variant) }));
  }
  return seoData;
}
