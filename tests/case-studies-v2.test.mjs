import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { buildVersionTwoCases, calculateCaseEffect } from '../src/case-studies-v2.js';

const source = readFileSync(new URL('../src/CaseStudies.jsx', import.meta.url), 'utf8');
const legacy = vm.runInNewContext(`(${source.match(/export const caseStudies = (\[[\s\S]*?\n\]);/)[1]})`);

test('version two adds website and content without mutating versions one and three', () => {
  const before = JSON.stringify(legacy);
  const cases = buildVersionTwoCases(legacy);
  assert.equal(JSON.stringify(legacy), before);
  assert.equal(cases.length, 5);
  assert.equal(new Set(cases.map(c => c.id)).size, 5);
  // Card order confirmed by the user on 28.09.2026.
  assert.deepEqual(cases.map(c => c.id), ['multipage-website', 'commerce-support', 'b2b-sales', 'content-production', 'sales-call-analysis']);

  for (const c of cases) {
    assert.ok(c.imageSource.startsWith('https://'));
    assert.ok(c.review?.verification || c.pricing);
    assert.equal(c.launchCost, undefined, 'no unsupported setup price');
    assert.equal(c.paybackMonths, undefined, 'no unsupported payback promise');
    if (c.calculation) assert.equal(Number(c.metric.replace(/\D/g, '')), calculateCaseEffect(c.calculation));
  }
});

test('Yardestate is a delivered agency project for 290000, not projected savings', () => {
  const cases = buildVersionTwoCases(legacy);
  const site = cases.find(c => c.id === 'multipage-website');
  const content = cases.find(c => c.id === 'content-production');
  assert.equal(site.projectUrl, 'https://yardestate.ru/');
  assert.equal(site.pricing.amount, 290000);
  assert.equal(site.period, '/ проект');
  assert.equal(site.monthlyEffect, undefined);
  assert.equal(site.calculation, undefined);
  assert.match(JSON.stringify(site.detailSections), /ученик/);
  assert.match(JSON.stringify(site.detailSections), /Макс/);
  assert.equal(content.monthlyEffect, undefined);
});

test('content offer is 30 videos, 30 carousels and 30 articles for a 150000 package', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'content-production');
  assert.deepEqual(c.outputs, { clips: 30, carousels: 30, articles: 30 });
  assert.equal(c.pricing.amount, 150000);
  assert.equal(c.period, '/ пакет');
  assert.equal(c.calculation, undefined);
  assert.equal(c.effect, undefined);
  assert.equal(c.monthlyEffect, undefined);
  assert.doesNotMatch(JSON.stringify(c), /248[\s\u00a0]*000|144 материала|16 интервью/);
});

test('revised sales forecast covers running costs only after eight extra paid orders', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'b2b-sales');
  assert.equal(c.monthlyEffect, 150000);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .20 }), -120000);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .20 + 8 / 600 }), 0);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .30 }), 780000);
});

test('call analysis replaces document processing without inventing a financial result', () => {
  const cases = buildVersionTwoCases(legacy);
  assert.ok(!cases.some(c => c.id === 'documents-1c'));
  const c = cases.find(c => c.id === 'sales-call-analysis');
  assert.ok(c);
  assert.equal(c.calculation, undefined);
  assert.equal(c.monthlyEffect, undefined);
  assert.equal(c.period, '');
  assert.doesNotMatch(c.metric, /₽/);
  assert.ok(c.economicsPlan.rows.length >= 3);
  assert.match(c.economicsPlan.formula, /маржа/i);
  assert.match(c.economicsPlan.condition, /оплаченных/);
  assert.match(c.brief, /звонк/);
});

test('support counts only fully resolved paid tickets as avoided costs', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'commerce-support');
  assert.equal(c.monthlyEffect, 258000);
  assert.equal(calculateCaseEffect({ ...c.calculation, manualVolume: 18000 }), -120000);
  assert.equal(calculateCaseEffect({ ...c.calculation, manualVolume: 9000 }), 510000);
});
