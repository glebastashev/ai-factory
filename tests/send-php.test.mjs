import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFile, spawn, spawnSync } from 'node:child_process';
import { promisify } from 'node:util';
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const hasPhp = spawnSync('php', ['-v']).status === 0;
// Async on purpose: a blocking call would freeze the fake Telegram server in this same process.
const runPhp = (args, cwd) => promisify(execFile)('php', args, { cwd });
const skip = hasPhp ? false : 'PHP is not installed';

// Fake Telegram Bot API: records messages, can pretend to be unreachable.
const telegram = { up: true, messages: [], getUpdates: 0 };
const mock = createServer((req, res) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    if (!telegram.up) { res.writeHead(502).end(); return; }
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/botTEST/getUpdates') {
      telegram.getUpdates += 1;
      res.end(JSON.stringify({ ok: true, result: [
        { update_id: 1, message: { from: { id: 111, username: 'someone' }, chat: { id: 111, type: 'private' }, text: '/start' } },
        { update_id: 2, message: { from: { id: 555, username: 'VeerMitor' }, chat: { id: 555, type: 'private' }, text: '/start' } },
      ] }));
    } else if (req.url === '/botTEST/sendMessage') {
      telegram.messages.push(JSON.parse(body));
      res.end(JSON.stringify({ ok: true, result: { message_id: telegram.messages.length } }));
    } else {
      res.writeHead(404).end('{}');
    }
  });
});

const servers = [];
async function startSite(config) {
  const root = mkdtempSync(join(tmpdir(), 'ai-factory-lead-'));
  copyFileSync('server/send.php', join(root, 'send.php'));
  const apiBase = `http://127.0.0.1:${mock.address().port}`;
  writeFileSync(join(root, 'lead-config.php'), `<?php return ${JSON.stringify({ bot_token: 'TEST', recipient_username: 'veermitor', api_base: apiBase, ...config })
    .replace(/^\{/, '[').replace(/\}$/, ']').replace(/":/g, '" =>')};\n`);
  const port = 18_400 + servers.length;
  const php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', root], { stdio: 'ignore' });
  servers.push(php);
  for (let i = 0; i < 50; i += 1) {
    try { await fetch(`http://127.0.0.1:${port}/`); break; } catch { await new Promise(r => setTimeout(r, 100)); }
  }
  const post = (lead, init = {}) => fetch(`http://127.0.0.1:${port}/send.php`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead), ...init,
  });
  return { root, port, post };
}

const lead = (extra = {}) => ({
  name: 'Анна <b>Тест</b>', contact: '@anna_test', interest: 'ИИ-менеджер',
  task: 'Отвечаем на одинаковые вопросы клиентов и переносим заявки в CRM',
  consent: true, website: '', elapsed: 42, page: 'https://ai.maxlusher.io/', source: 'brief', ...extra,
});

let site;
before(async () => {
  if (skip) return;
  await new Promise(resolve => mock.listen(0, '127.0.0.1', resolve));
  site = await startSite({ rate_max: 100 });
});
after(() => { servers.forEach(server => server.kill()); mock.close(); });

test('a valid lead is stored on the hosting and delivered to the recipient', { skip }, async () => {
  const response = await site.post(lead());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, delivered: true });
  const message = telegram.messages.at(-1);
  assert.equal(message.chat_id, 555, 'chat found by username in getUpdates');
  assert.match(message.text, /Анна &lt;b&gt;Тест&lt;\/b&gt;/, 'user text is escaped for HTML mode');
  assert.match(message.text, /@anna_test/);
  assert.match(message.text, /ИИ-менеджер/);
  assert.match(message.text, /переносим заявки в CRM/);
  assert.match(readFileSync(join(site.root, 'lead-data/leads.php'), 'utf8'), /anna_test/);
});

test('the recipient chat is looked up once and then cached', { skip }, async () => {
  const before = telegram.getUpdates;
  await site.post(lead({ contact: 'second@example.com' }));
  assert.equal(telegram.getUpdates, before);
  assert.equal(telegram.messages.at(-1).chat_id, 555);
});

test('stored leads cannot be opened from the browser', { skip }, async () => {
  for (const path of ['lead-data/leads.php', 'lead-data/delivered.php', 'lead-data/chat-id.php', 'lead-config.php']) {
    const text = await (await fetch(`http://127.0.0.1:${site.port}/${path}`)).text();
    assert.doesNotMatch(text, /anna|TEST|555/, path);
  }
});

test('bots are dropped without an error or a message', { skip }, async () => {
  const sent = telegram.messages.length;
  for (const bot of [lead({ website: 'http://spam.example' }), lead({ elapsed: 1 })]) {
    const response = await site.post(bot);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
  }
  assert.equal(telegram.messages.length, sent);
  assert.doesNotMatch(readFileSync(join(site.root, 'lead-data/leads.php'), 'utf8'), /spam\.example/);
});

test('incomplete leads are rejected with the field name', { skip }, async () => {
  for (const [bad, field] of [[{ contact: ' ' }, 'contact'], [{ consent: false }, 'consent'], [{ task: 'коротко' }, 'task'], [{ name: '' }, 'name']]) {
    const response = await site.post(lead(bad));
    assert.equal(response.status, 422, field);
    assert.deepEqual(await response.json(), { ok: false, error: field });
  }
});

test('only POST requests are accepted', { skip }, async () => {
  assert.equal((await fetch(`http://127.0.0.1:${site.port}/send.php`)).status, 405);
});

test('when Telegram is down the lead is kept and the retry command delivers it later', { skip }, async () => {
  telegram.up = false;
  const response = await site.post(lead({ contact: '@delayed_lead' }));
  assert.deepEqual(await response.json(), { ok: true, delivered: false });
  telegram.up = true;
  const sent = telegram.messages.length;
  await runPhp(['send.php', 'retry'], site.root);
  assert.equal(telegram.messages.length, sent + 1);
  assert.match(telegram.messages.at(-1).text, /@delayed_lead/);
  await runPhp(['send.php', 'retry'], site.root);
  assert.equal(telegram.messages.length, sent + 1, 'a delivered lead is not sent twice');
});

test('one address cannot flood the chat', { skip }, async () => {
  const strict = await startSite({ rate_max: 2 });
  const codes = [];
  for (let i = 0; i < 3; i += 1) codes.push((await strict.post(lead({ contact: `@flood_${i}` }))).status);
  assert.deepEqual(codes, [200, 200, 429]);
});
