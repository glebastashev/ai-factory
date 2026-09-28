// Search and AI-assistant metadata for the published site.
// Page text comes from the React components through src/entry-server.jsx,
// so the markup always repeats what visitors actually see.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const SITE = {
  name: 'ai-factory',
  alternateNames: ['ИИ-агентство Макса Люшера', 'AI Factory'],
  description: 'ИИ-агентство Макса Люшера. Внедряем ИИ в продажи, поддержку и контент. Считаем, какие расходы сократятся, сколько дополнительной маржи принесёт решение и когда окупится запуск.',
  logo: 'assets/brand-icon.png',
  knowsAbout: ['Внедрение ИИ в бизнес', 'ИИ-агенты', 'Автоматизация бизнес-процессов', 'ИИ в продажах', 'ИИ в поддержке клиентов', 'Контент с помощью ИИ'],
  founder: {
    name: 'Макс Люшер',
    jobTitle: 'Основатель ai-factory',
    image: 'assets/editorial-founder.webp',
    channel: { name: 'Люшер в AI — избранное', url: 'https://t.me/+KnTNi1AANSIwNDY6' },
    sameAs: ['https://t.me/+KnTNi1AANSIwNDY6', 'https://maxlusher.io/'],
  },
};

export const PAGE = {
  title: 'Внедрение ИИ в бизнес под ключ | ИИ-агентство ai-factory',
  description: 'ИИ-агентство Макса Люшера: ИИ-менеджер для продаж, контент-фабрика и помощник по документам компании. Считаем эффект в рублях и срок окупаемости запуска.',
  ogTitle: 'ai-factory: больше времени, больше прибыли',
  ogDescription: 'Внедряем ИИ в продажи, поддержку и контент. Считаем, какие расходы сократятся и когда окупится запуск.',
  ogImage: 'assets/og-image.jpg',
  ogImageAlt: 'ai-factory, ИИ-агентство Макса Люшера',
};

const AI_AND_SEARCH_BOTS = [
  'Googlebot', 'YandexBot', 'Bingbot',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot', 'Applebot-Extended',
  'DuckAssistBot', 'Meta-ExternalAgent', 'Amazonbot', 'MistralAI-User', 'CCBot',
];

export const MOTION_GUARD = '<script>(function(d){try{if(matchMedia(\'(prefers-reduced-motion: reduce)\').matches||!(\'IntersectionObserver\' in window))return;d.classList.add(\'motion-pending\');setTimeout(function(){d.classList.remove(\'motion-pending\')},4000)}catch(e){}})(document.documentElement)</script>';

const normalize = siteUrl => (siteUrl ? new URL(siteUrl).href.replace(/\/?$/, '/') : '');
const absolute = (site, path) => (site ? new URL(path, site).href : path);
const nodeId = (site, name) => `${site}#${name}`;
const escapeHtml = value => String(value)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rubles = amount => `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;

export function buildJsonLd({ siteUrl = '', data, page = PAGE }) {
  const site = normalize(siteUrl);
  const ids = {
    org: nodeId(site, 'organization'), founder: nodeId(site, 'founder'),
    website: nodeId(site, 'website'), webpage: nodeId(site, 'webpage'), faq: nodeId(site, 'faq'),
  };
  const service = (name, description) => ({ '@type': 'Service', name, description });
  const organization = {
    '@type': 'Organization',
    '@id': ids.org,
    name: SITE.name,
    alternateName: SITE.alternateNames,
    description: SITE.description,
    ...(site && { url: site, logo: { '@type': 'ImageObject', url: absolute(site, SITE.logo) } }),
    founder: { '@id': ids.founder },
    knowsAbout: SITE.knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Продукты и форматы работы ai-factory',
      itemListElement: [
        ...data.products.map(product => ({ '@type': 'Offer', itemOffered: service(product.name, product.description) })),
        ...data.formats.map(format => ({ '@type': 'Offer', itemOffered: service(format.name, format.for) })),
        ...data.pricedOffers.map(offer => ({
          '@type': 'Offer', price: String(offer.price), priceCurrency: 'RUB',
          itemOffered: service(offer.name, offer.description),
        })),
      ],
    },
  };
  const founder = {
    '@type': 'Person',
    '@id': ids.founder,
    name: SITE.founder.name,
    jobTitle: SITE.founder.jobTitle,
    worksFor: { '@id': ids.org },
    knowsAbout: SITE.knowsAbout,
    sameAs: SITE.founder.sameAs,
    ...(site && { image: absolute(site, SITE.founder.image) }),
  };
  const website = {
    '@type': 'WebSite', '@id': ids.website, name: SITE.name, inLanguage: 'ru-RU',
    publisher: { '@id': ids.org }, ...(site && { url: site }),
  };
  const webpage = {
    '@type': 'WebPage', '@id': ids.webpage, name: page.title, description: page.description, inLanguage: 'ru-RU',
    isPartOf: { '@id': ids.website }, about: { '@id': ids.org },
    ...(site && { url: site, primaryImageOfPage: { '@type': 'ImageObject', url: absolute(site, page.ogImage) } }),
  };
  const faq = {
    '@type': 'FAQPage', '@id': ids.faq,
    mainEntity: data.questions.map(([question, answer]) => ({
      '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  return { '@context': 'https://schema.org', '@graph': [organization, founder, website, webpage, faq] };
}

export function buildHead({ siteUrl = '', data, noindex = false, ...overrides }) {
  const page = { ...PAGE, ...overrides };
  const site = normalize(siteUrl);
  const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${escapeHtml(value)}">`;
  const tags = [`<title>${escapeHtml(page.title)}</title>`, meta('name', 'description', page.description)];
  if (noindex) return [...tags, meta('name', 'robots', 'noindex, nofollow')].join('\n    ');
  const image = page.ogImage && absolute(site, page.ogImage);
  const json = JSON.stringify(buildJsonLd({ siteUrl: site, data, page })).replace(/</g, '\\u003c');
  return [
    ...tags,
    meta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'),
    site && `<link rel="canonical" href="${escapeHtml(site)}">`,
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', SITE.name),
    meta('property', 'og:locale', 'ru_RU'),
    meta('property', 'og:title', page.ogTitle),
    meta('property', 'og:description', page.ogDescription),
    site && meta('property', 'og:url', site),
    image && meta('property', 'og:image', image),
    image && meta('property', 'og:image:width', '1200'),
    image && meta('property', 'og:image:height', '630'),
    image && meta('property', 'og:image:alt', page.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', page.ogTitle),
    meta('name', 'twitter:description', page.ogDescription),
    image && meta('name', 'twitter:image', image),
    `<script type="application/ld+json">${json}</script>`,
  ].filter(Boolean).join('\n    ');
}

export function buildRobots({ siteUrl = '' }) {
  const site = normalize(siteUrl);
  const groups = ['*', ...AI_AND_SEARCH_BOTS].map(bot => `User-agent: ${bot}\nAllow: /`);
  return [
    '# ai-factory: поисковые системы и ИИ-ассистенты могут читать весь сайт.',
    '# Отдельные разрешения для ИИ-ботов дублируют общее правило и нужны для явности.',
    groups.join('\n\n'),
    site && `Sitemap: ${site}sitemap.xml`,
  ].filter(Boolean).join('\n\n') + '\n';
}

export function buildSitemap({ siteUrl, lastmod }) {
  const site = normalize(siteUrl);
  return '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + `  <url>\n    <loc>${escapeHtml(site)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>\n`
    + '</urlset>\n';
}

export function buildLlms({ siteUrl = '', data }) {
  const site = normalize(siteUrl);
  const { founder } = SITE;
  return [
    `# ${SITE.name}`,
    `> ${SITE.description}`,
    [
      site && `Сайт: ${site}`,
      `Основатель: ${founder.name}. Канал в Telegram «${founder.channel.name}»: ${founder.channel.url}`,
      `Личный сайт основателя: ${founder.sameAs.find(url => !url.includes('t.me'))}`,
    ].filter(Boolean).join('\n'),
    '## Готовые продукты\n' + data.products.map(p => `- ${p.name}: ${p.description}`).join('\n'),
    '## Форматы работы\n' + data.formats.map(f => `- ${f.name}: ${f.for}`).join('\n'),
    '## Цены\n' + data.pricedOffers.map(o => `- ${o.name}: ${rubles(o.price)}. ${o.description}`).join('\n'),
    '## Вопросы и ответы\n' + data.questions.map(([q, a]) => `### ${q}\n${a}`).join('\n\n'),
  ].join('\n\n') + '\n';
}

export function injectPrerender(template, { head, markup }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<html([^>]*)>/i, (_, attrs) => `<html${attrs} data-prerendered="">`)
    .replace(/(<meta\s+charset="[^"]*"\s*\/?>)/i, (tag) => `${tag}\n    ${MOTION_GUARD}\n    ${head}`)
    .replace(/<div id="root"([^>]*)><\/div>/, (_, attrs) => `<div id="root"${attrs}>${markup}</div>`);
}

export function writeStaticFiles(dir, { siteUrl = '', data, lastmod }) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'robots.txt'), buildRobots({ siteUrl }));
  writeFileSync(join(dir, 'llms.txt'), buildLlms({ siteUrl, data }));
  if (siteUrl) writeFileSync(join(dir, 'sitemap.xml'), buildSitemap({ siteUrl, lastmod }));
}
