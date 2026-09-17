import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFinancialImpact } from '../src/financial-model.js';

const example = {
  monthlySavings: 80000,
  extraDeals: 10,
  marginPerDeal: 12000,
  monthlyAiCost: 30000,
  setupCost: 340000
};

test('example combines actual savings and extra margin, then subtracts ongoing costs', () => {
  const result = calculateFinancialImpact(example);
  assert.equal(result.additionalMargin, 120000);
  assert.equal(result.monthlyEffect, 170000);
  assert.equal(result.paybackMonths, 2);
});

test('one-time setup cost changes payback without reducing the recurring monthly effect', () => {
  const result = calculateFinancialImpact({ ...example, setupCost: 510000 });
  assert.equal(result.monthlyEffect, 170000);
  assert.equal(result.paybackMonths, 3);
});

test('payback rounds up to the next tenth instead of understating the term', () => {
  const result = calculateFinancialImpact({ ...example, setupCost: 350000 });
  assert.equal(result.paybackMonths, 2.1);
  assert.ok(result.paybackMonths * result.monthlyEffect >= 350000);
  assert.ok((result.paybackMonths - 0.1) * result.monthlyEffect < 350000);
});

test('an exact tenth stays unchanged', () => {
  const result = calculateFinancialImpact({ monthlySavings: 100, setupCost: 210 });
  assert.equal(result.paybackMonths, 2.1);
});

test('a negative effect remains visible and has no payback period', () => {
  const result = calculateFinancialImpact({ ...example, monthlySavings: 0, extraDeals: 0 });
  assert.equal(result.monthlyEffect, -30000);
  assert.equal(result.paybackMonths, null);
});

test('zero effect has no payback even when setup costs are zero', () => {
  const result = calculateFinancialImpact({ monthlySavings: 30000, monthlyAiCost: 30000, setupCost: 0 });
  assert.equal(result.monthlyEffect, 0);
  assert.equal(result.paybackMonths, null);
});

test('a positive effect with no setup cost has zero months to recover', () => {
  const result = calculateFinancialImpact({ ...example, setupCost: 0 });
  assert.equal(result.paybackMonths, 0);
});

test('empty, negative, missing, and non-finite inputs contribute zero', () => {
  const result = calculateFinancialImpact({ monthlySavings: '', extraDeals: -2, marginPerDeal: 'bad', monthlyAiCost: Infinity, setupCost: NaN });
  assert.deepEqual(result.inputs, { monthlySavings: 0, extraDeals: 0, marginPerDeal: 0, monthlyAiCost: 0, setupCost: 0 });
  assert.equal(result.additionalMargin, 0);
  assert.equal(result.monthlyEffect, 0);
  assert.equal(result.paybackMonths, null);
  assert.equal(calculateFinancialImpact().monthlyEffect, 0);
});

test('numeric strings work and fractional deals do not count as complete extra sales', () => {
  const result = calculateFinancialImpact({ monthlySavings: '80000', extraDeals: '10.9', marginPerDeal: '12000', monthlyAiCost: '30000', setupCost: '340000' });
  assert.equal(result.inputs.extraDeals, 10);
  assert.equal(result.monthlyEffect, 170000);
  assert.equal(result.paybackMonths, 2);
});

test('extreme numeric inputs cannot produce Infinity or NaN', () => {
  const result = calculateFinancialImpact({ monthlySavings: Number.MAX_VALUE, extraDeals: Number.MAX_VALUE, marginPerDeal: Number.MAX_VALUE, monthlyAiCost: 0, setupCost: Number.MAX_VALUE });
  assert.ok(Number.isFinite(result.additionalMargin));
  assert.ok(Number.isFinite(result.monthlyEffect));
  assert.ok(Number.isFinite(result.paybackMonths));
  assert.ok(result.paybackMonths > 0);
});
