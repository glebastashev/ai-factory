import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildJsonLd,
  buildHead,
  buildRobots,
  buildSitemap,
  buildLlms,
  injectPrerender,
  writeStaticFiles,
} from '../scripts/seo.mjs';

const data = {
  products: [
    { name: 'ИИ-менеджер', description: 'Уточняет запрос и готовит заявку для отдела продаж.' },
    { name: 'Контент-фабрика', description: 'Готовит посты, сценарии и рассылки из вашей экспертизы.' },
  ],
  formats: [{ name: 'Внедрить решение', for: 'Когда есть конкретный процесс, который пора автоматизировать.' }],
  pricedOffers: [{ name: 'Пакет из 90 материалов с ИИ', description: '30 роликов, 30 каруселей и 30 статей.', price: 150000 }],
  questions: [
    ['Как понять, что внедрение окупится?', 'Зафиксируем текущие расходы и маржу с продажи.'],
    ['Можно ли начать с одной небольшой задачи?', 'Да. Для первого внедрения можно выделить один сценарий.'],
  ],
};
const siteUrl = 'https://example.ru/';
const byType = (graph, type) => graph['@graph'].find(node => [].concat(node['@type']).includes(type));

test('JSON-LD describes the agency, its founder and the site', () => {
  const graph = buildJsonLd({ siteUrl, data });
  const org = byType(graph, 'Organization');
  const person = byType(graph, 'Person');
  assert.equal(org.name, 'ai-factory');
  assert.equal(person.name, 'Макс Люшер');
  assert.equal(org.founder['@id'], person['@id']);
  assert.equal(person.worksFor['@id'], org['@id']);
  assert.ok(byType(graph, 'WebSite'));
  assert.ok(byType(graph, 'WebPage'));
  assert.ok(person.sameAs.includes('https://t.me/+KnTNi1AANSIwNDY6'));
});

test('FAQ markup repeats every visible question word for word', () => {
  const faq = byType(buildJsonLd({ siteUrl, data }), 'FAQPage');
  assert.equal(faq.mainEntity.length, data.questions.length);
  faq.mainEntity.forEach((item, index) => {
    assert.equal(item.name, data.questions[index][0]);
    assert.equal(item.acceptedAnswer.text, data.questions[index][1]);
  });
});

test('service catalogue lists products and the priced package in roubles', () => {
  const org = byType(buildJsonLd({ siteUrl, data }), 'Organization');
  const offers = org.hasOfferCatalog.itemListElement;
  const names = offers.map(offer => offer.itemOffered.name);
  assert.ok(names.includes('ИИ-менеджер'));
  assert.ok(names.includes('Внедрить решение'));
  const priced = offers.find(offer => offer.price);
  assert.equal(priced.itemOffered.name, 'Пакет из 90 материалов с ИИ');
  assert.equal(priced.price, '150000');
  assert.equal(priced.priceCurrency, 'RUB');
});

test('without a site address the markup invents no own absolute URLs', () => {
  const graph = buildJsonLd({ siteUrl: '', data });
  const org = byType(graph, 'Organization');
  assert.equal(org.url, undefined);
  assert.ok(!JSON.stringify(graph).includes('example.ru'));
  assert.ok(org['@id'].startsWith('#'));
});

test('head has title, description, preview rules, open graph and parsable JSON-LD', () => {
  const head = buildHead({ siteUrl, title: 'Заголовок', description: 'Описание "в кавычках" & амперсанд', ogImage: 'assets/og-image.jpg', data });
  assert.match(head, /<title>Заголовок<\/title>/);
  assert.match(head, /<meta name="description" content="Описание &quot;в кавычках&quot; &amp; амперсанд">/);
  assert.match(head, /max-image-preview:large/);
  assert.match(head, /<link rel="canonical" href="https:\/\/example\.ru\/">/);
  assert.match(head, /<meta property="og:image" content="https:\/\/example\.ru\/assets\/og-image\.jpg">/);
  assert.match(head, /<meta name="twitter:card" content="summary_large_image">/);
  const json = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.ok(JSON.parse(json)['@graph'].length >= 5);
});

test('JSON-LD cannot break out of its script tag', () => {
  const hostile = { ...data, questions: [['Вопрос </script><script>alert(1)</script>', 'Ответ']] };
  const head = buildHead({ siteUrl, title: 't', description: 'd', data: hostile });
  assert.equal(head.split('</script>').length - 1, 1);
});

test('prototype head is noindex and has no canonical', () => {
  const head = buildHead({ siteUrl: '', title: 't', description: 'd', data, noindex: true });
  assert.match(head, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(head, /rel="canonical"/);
  assert.doesNotMatch(head, /application\/ld\+json/);
});

test('robots.txt explicitly allows search engines and AI crawlers', () => {
  const robots = buildRobots({ siteUrl });
  for (const bot of ['Googlebot', 'YandexBot', 'GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\nAllow: /`));
  }
  assert.match(robots, /Sitemap: https:\/\/example\.ru\/sitemap\.xml/);
  assert.doesNotMatch(buildRobots({ siteUrl: '' }), /Sitemap:/);
});

test('sitemap lists the home page with an absolute address', () => {
  const sitemap = buildSitemap({ siteUrl, lastmod: '2026-09-28' });
  assert.match(sitemap, /<loc>https:\/\/example\.ru\/<\/loc>/);
  assert.match(sitemap, /<lastmod>2026-09-28<\/lastmod>/);
});

test('llms.txt summarises the agency in plain markdown', () => {
  const llms = buildLlms({ siteUrl, data });
  assert.match(llms, /^# ai-factory/);
  assert.match(llms, /Макс Люшер/);
  assert.match(llms, /ИИ-менеджер/);
  assert.match(llms, /150 000 ₽/);
  assert.match(llms, /Как понять, что внедрение окупится\?/);
});

test('prerender puts markup into the root and replaces title and description', () => {
  const template = '<!doctype html><html lang="ru"><head><meta charset="UTF-8" />'
    + '<meta name="description" content="старое" /><title>Старый</title>'
    + '<script type="module" crossorigin src="./assets/main.js"></script></head>'
    + '<body><div id="root" data-hero-variant="flow"></div></body></html>';
  const html = injectPrerender(template, { head: '<title>Новый</title>', markup: '<main>Текст</main>' });
  assert.match(html, /<html lang="ru" data-prerendered="">/);
  assert.match(html, /<div id="root" data-hero-variant="flow"><main>Текст<\/main><\/div>/);
  assert.equal(html.match(/<title>/g).length, 1);
  assert.match(html, /<title>Новый<\/title>/);
  assert.doesNotMatch(html, /старое/);
  assert.ok(html.indexOf('motion-pending') < html.indexOf('assets/main.js'), 'motion guard must run before the app');
});

test('static files for the site root are written next to index.html', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ai-factory-seo-'));
  writeStaticFiles(dir, { siteUrl, data, lastmod: '2026-09-28' });
  assert.match(readFileSync(join(dir, 'robots.txt'), 'utf8'), /GPTBot/);
  assert.match(readFileSync(join(dir, 'sitemap.xml'), 'utf8'), /example\.ru/);
  assert.match(readFileSync(join(dir, 'llms.txt'), 'utf8'), /ai-factory/);
  const bare = mkdtempSync(join(tmpdir(), 'ai-factory-seo-'));
  writeStaticFiles(bare, { siteUrl: '', data, lastmod: '2026-09-28' });
  assert.ok(!existsSync(join(bare, 'sitemap.xml')), 'a sitemap needs absolute addresses');
});
