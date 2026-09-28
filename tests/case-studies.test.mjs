import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../src/CaseStudies.jsx',import.meta.url),'utf8');
const cases=vm.runInNewContext(`(${source.match(/export const caseStudies = (\[[\s\S]*?\n\]);/)[1]})`);
test('case projections have auditable volumes, costs and consistent payback',()=>{
 for(const c of cases){
  assert.ok(c.calculation,`${c.id}: calculation inputs are required`);
  const n=c.calculation;
  const expected=n.type==='sales'
   ? Math.round(n.volume*(n.targetConversion-n.baseConversion)*n.margin-n.runningCost)
   : Math.round(n.volume*n.beforeUnitCost-n.manualVolume*n.afterUnitCost-n.runningCost);
  assert.equal(c.monthlyEffect,expected,c.id);
  assert.equal(Number(c.metric.replace(/\D/g,'')),expected,c.id);
  assert.equal(c.paybackMonths,Math.round(c.launchCost/expected*10)/10,c.id);
  assert.ok(c.imageSource?.startsWith('https://'),`${c.id}: screenshot provenance is required`);
 }
});
