// Zero-dependency build helper: derives prerender routes + sitemap from data/.
// Reads project slugs (src/app/data/projects.en.ts) and the canonical host
// (src/environments/environment.ts). Run: `node scripts/export-routes.mjs`.
// Outputs: prerender-routes.txt (build input) + public/sitemap.xml (deployed).
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('..', import.meta.url).pathname;

const projectsSrc = readFileSync(`${ROOT}src/app/data/projects.en.ts`, 'utf8');
const slugs = [...new Set([...projectsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]))];
if (slugs.length === 0) throw new Error('no project slugs found in data');

const envSrc = readFileSync(`${ROOT}src/environments/environment.ts`, 'utf8');
const siteUrl = envSrc.match(/siteUrl:\s*'([^']+)'/)?.[1];
if (!siteUrl) throw new Error('siteUrl not found in environment.ts');

const LANGS = ['pl', 'en'];
const pagePaths = {
  home: { pl: '/pl', en: '/en' },
  about: { pl: '/pl/o-mnie', en: '/en/about' },
  portfolio: { pl: '/pl/portfolio', en: '/en/portfolio' },
  contact: { pl: '/pl/kontakt', en: '/en/contact' },
};

const urls = [];
for (const lang of LANGS) {
  for (const page of Object.values(pagePaths)) urls.push(page[lang]);
  for (const slug of slugs) urls.push(`${pagePaths.portfolio[lang]}/${slug}`);
}

writeFileSync(`${ROOT}prerender-routes.txt`, `${urls.join('\n')}\n`);
console.log(`prerender-routes.txt: ${urls.length} routes`);

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${siteUrl}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;
writeFileSync(`${ROOT}public/sitemap.xml`, sitemap);
console.log(`public/sitemap.xml: ${urls.length} urls`);
