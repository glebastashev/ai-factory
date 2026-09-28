import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

test('every hero version renders on the server with the text crawlers need', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
  try {
    const { render, seoData } = await vite.ssrLoadModule('/src/entry-server.jsx');
    assert.equal(seoData.questions.length, 8);
    assert.equal(seoData.products.length, 3);
    assert.equal(seoData.pricedOffers[0].price, 150000);
    for (const variant of ['cards', 'flow', 'orbit']) {
      const html = render(variant);
      assert.match(html, /Больше времени\./, `${variant}: hero heading`);
      assert.match(html, /ИИ-агентство Макса Люшера/, `${variant}: eyebrow`);
      for (const [question] of seoData.questions) assert.ok(html.includes(question), `${variant}: ${question}`);
      for (const product of seoData.products) assert.ok(html.includes(product.name), `${variant}: ${product.name}`);
    }
  } finally {
    await vite.close();
  }
});
