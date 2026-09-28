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
  assert.deepEqual(cases.slice(0, 2).map(c => c.id), ['multipage-website', 'content-production']);
  for (const c of cases) {
    assert.ok(c.imageSource.startsWith('https://'));
    assert.ok(c.review.verification);
    assert.equal(c.launchCost, undefined, 'no unsupported setup price');
    assert.equal(c.paybackMonths, undefined, 'no unsupported payback promise');
    assert.equal(Number(c.metric.replace(/\D/g, '')), calculateCaseEffect(c.calculation));
  }
});

test('website savings are per project; content counts all nine deliverables per interview', () => {
  const [site, content] = buildVersionTwoCases(legacy);
  assert.equal(site.period, '/ проект');
  assert.equal(site.monthlyEffect, undefined);
  assert.equal(site.effect, 180000);
  assert.equal(content.monthlyEffect, 248000);
  assert.equal(content.outputs.interviews * (content.outputs.clips + content.outputs.posts + content.outputs.emails), 144);
});

test('revised sales forecast covers running costs only after eight extra paid orders', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'b2b-sales');
  assert.equal(c.monthlyEffect, 150000);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .20 }), -120000);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .20 + 8 / 600 }), 0);
  assert.equal(calculateCaseEffect({ ...c.calculation, targetConversion: .30 }), 780000);
});

test('document cost charges for every page and includes remaining human review', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'documents-1c');
  assert.equal(c.monthlyEffect, 266000);
  assert.equal(calculateCaseEffect({ ...c.calculation, pagesPerDocument: 1 }), 338000);
  assert.equal(calculateCaseEffect({ ...c.calculation, pagesPerDocument: 3 }), 194000);
});

test('support counts only fully resolved paid tickets as avoided costs', () => {
  const c = buildVersionTwoCases(legacy).find(c => c.id === 'commerce-support');
  assert.equal(c.monthlyEffect, 258000);
  assert.equal(calculateCaseEffect({ ...c.calculation, manualVolume: 18000 }), -120000);
  assert.equal(calculateCaseEffect({ ...c.calculation, manualVolume: 9000 }), 510000);
});
