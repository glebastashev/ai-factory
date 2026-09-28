// Production export of version two for any static host.
// usage: SITE_URL=https://domain.ru/ npm run build:export -- [--out <dir>] [--force]
import { execSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildBundles, clientDir, prerender, root } from './prerender.mjs';
import { writeStaticFiles } from './seo.mjs';
import { buildHtaccess, copyLeadHandler, pruneAssets } from './export-files.mjs';

const args = process.argv.slice(2);
const siteUrl = process.env.SITE_URL || '';
const today = new Date().toISOString().slice(0, 10);
const out = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : resolve(root, '..', 'exports', `ai-factory-v2-${today}`));
if (existsSync(out) && !args.includes('--force')) {
  console.error(`${out} already exists. Pass --force to replace it or --out <dir> for a new folder.`);
  process.exit(1);
}

buildBundles({ SITE_BASE_PATH: './' });
const seoData = await prerender([{ file: 'version-2.html', head: { siteUrl } }]);

const site = resolve(out, 'site');
rmSync(out, { recursive: true, force: true });
mkdirSync(site, { recursive: true });
cpSync(resolve(clientDir, 'assets'), resolve(site, 'assets'), { recursive: true });
cpSync(resolve(clientDir, 'fonts'), resolve(site, 'fonts'), { recursive: true });
cpSync(resolve(clientDir, 'version-2.html'), resolve(site, 'index.html'));
writeStaticFiles(site, { siteUrl, data: seoData, lastmod: today });
const pruned = pruneAssets(site);
writeFileSync(resolve(site, '.htaccess'), buildHtaccess());
copyLeadHandler(root, site);
console.log(`Removed ${pruned.length} files the page never loads: ${pruned.join(', ')}`);

const zip = spawnSync('zip', ['-qr', '-X', resolve(out, 'ai-factory-v2.zip'), '.', '-x', '.DS_Store', '*/.DS_Store'], { cwd: site, stdio: 'inherit' });
if (zip.status !== 0) process.exit(zip.status || 1);

const commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
const dirty = execSync('git status --porcelain', { cwd: root }).toString().trim() ? ' с локальными правками' : '';
const address = siteUrl
  ? [`Адрес сайта: ${siteUrl}. В сборке есть канонический адрес, sitemap.xml и абсолютные ссылки на картинку превью.`]
  : ['Адрес сайта при сборке не указан. Поэтому в index.html нет канонического адреса, ссылка на картинку превью относительная, а sitemap.xml не создан.',
     'Когда домен известен, пересоберите: SITE_URL=https://ваш-домен.ru/ npm run build:export -- --out <папка>'];
writeFileSync(resolve(out, 'Публикация.txt'), [
  'AI-FACTORY: ВТОРАЯ ВЕРСИЯ САЙТА',
  `Сборка от ${today}, исходный коммит ${commit}${dirty}.`,
  '',
  'КАК ОПУБЛИКОВАТЬ',
  'Загрузите содержимое папки site в корень сайта на статическом хостинге.',
  'index.html, robots.txt и llms.txt должны лежать в корне домена рядом с папками assets и fonts.',
  'Архив ai-factory-v2.zip содержит те же файлы без внешней папки.',
  'Скрытый файл .htaccess включает сжатие и кэш на хостингах с Apache (REG.RU, Beget, Timeweb). Его тоже нужно загрузить.',
  'Для публикации не нужны Node.js и установка зависимостей.',
  '',
  'ПОИСК И ИИ-АССИСТЕНТЫ',
  'Текст страницы уже записан в index.html, поэтому поисковики и ИИ-боты видят его без JavaScript.',
  'В index.html есть заголовок и описание для выдачи, превью для соцсетей и разметка schema.org: агентство, основатель, продукты, пакет контента с ценой и вопросы из блока FAQ.',
  'robots.txt открывает сайт поисковикам и ИИ-ботам. llms.txt содержит краткую справку о компании для языковых моделей.',
  ...address,
  'После публикации добавьте сайт в Яндекс Вебмастер и Google Search Console и отправьте туда адрес страницы.',
  '',
  'ЗАЯВКИ В TELEGRAM',
  'Все формы на сайте отправляют заявку в send.php. Он сохраняет её на хостинге и пересылает в Telegram @veermitor.',
  'Нужен хостинг с PHP, с которого открывается Telegram. Проверено 28.09.2026: с Beget открывается, с REG.RU и большинства московских хостингов нет.',
  '1. В Telegram откройте @BotFather, отправьте /newbot и получите токен бота.',
  '2. @veermitor открывает этого бота и нажимает «Запустить». Сделайте это незадолго до проверки: бот находит получателя по сообщениям за последние сутки.',
  '3. На хостинге скопируйте lead-config.example.php в lead-config.php и впишите токен. При желании укажите запасную почту.',
  '4. Отправьте с сайта тестовую заявку. После первой доставленной заявки бот запоминает получателя навсегда.',
  '5. Необязательно: в панели хостинга добавьте cron раз в 5 минут: php <путь к сайту>/send.php retry. Он дошлёт заявки, если Telegram был временно недоступен.',
  'Все заявки хранятся на хостинге в lead-data/leads.php. Открывайте его в файловом менеджере: из браузера он не открывается.',
  'Формы отправляют имя, контакт и задачу, поэтому в них есть согласие на обработку персональных данных со ссылкой на https://maxlusher.io/privacy.',
  '',
].join('\n'));
console.log(`Export ready: ${out}`);
