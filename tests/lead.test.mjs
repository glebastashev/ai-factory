import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLead, sendLead, LEAD_ENDPOINT } from '../src/lead.js';

const values = {
  name: '  Анна  ', contact: ' @anna ', interest: 'ИИ-менеджер',
  task: '  Отвечаем на одинаковые вопросы клиентов  ', consent: true, website: '',
};

test('the lead is trimmed, capped and carries how long the form was filled', () => {
  const lead = buildLead({ ...values, name: 'Я'.repeat(200) }, { startedAt: 1_000, now: 10_600, page: 'https://ai.maxlusher.io/', source: 'brief' });
  assert.equal(lead.name.length, 80);
  assert.equal(lead.contact, '@anna');
  assert.equal(lead.task, 'Отвечаем на одинаковые вопросы клиентов');
  assert.equal(lead.elapsed, 9);
  assert.equal(lead.consent, true);
  assert.equal(lead.website, '');
  assert.equal(lead.page, 'https://ai.maxlusher.io/');
  assert.equal(lead.source, 'brief');
});

test('leads go to the handler next to the page', () => {
  assert.equal(LEAD_ENDPOINT, 'send.php');
});

test('a stored lead counts as sent even if Telegram was unreachable', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push([url, init]); return new Response(JSON.stringify({ ok: true, delivered: false }), { status: 200 }); };
  const result = await sendLead({ name: 'Анна' }, fetchImpl);
  assert.deepEqual(result, { ok: true, delivered: false });
  assert.equal(calls[0][0], 'send.php');
  assert.equal(calls[0][1].method, 'POST');
  assert.equal(JSON.parse(calls[0][1].body).name, 'Анна');
});

test('server errors, network errors and non-JSON answers are failures', async () => {
  const cases = [
    async () => new Response(JSON.stringify({ ok: false }), { status: 422 }),
    async () => { throw new TypeError('Failed to fetch'); },
    async () => new Response('<html>405 Not Allowed</html>', { status: 405 }),
  ];
  for (const fetchImpl of cases) assert.deepEqual(await sendLead({}, fetchImpl), { ok: false, delivered: false });
});
