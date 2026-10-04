// CI gate: every prerendered content page must ship complete SEO tags.
// Fails the build when a page is missing title, description, canonical,
// OG tags, hreflang alternates or (where required) JSON-LD.
// Contact + portfolio index pages intentionally carry no JSON-LD (plan §16).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../dist/julen-website/browser', import.meta.url).pathname;
const JSON_LD_REQUIRED = [/^\/(pl|en)$/, /\/(o-mnie|about)$/, /\/portfolio\/[^/]+$/];

function pages(dir) {
  const out = [];
  for (const entry of readdirSync(join(ROOT, dir))) {
    const rel = dir === '.' ? entry : `${dir}/${entry}`;
    const st = statSync(join(ROOT, rel));
    if (st.isDirectory()) out.push(...pages(rel));
    else if (entry === 'index.html') out.push(dir === '.' ? '/' : `/${dir}`);
  }
  return out;
}

const failures = [];
for (const page of pages('.')) {
  if (page === '/') continue; // '/' redirect stub — Vercel redirects before serving
  const html = readFileSync(join(ROOT, `.${page}/index.html`), 'utf8');
  const missing = [];
  for (const [name, re] of [
    ['title', /<title>[^<]+<\/title>/],
    ['meta-description', /name="description" content="[^"]{20,}"/],
    ['canonical', /rel="canonical" href="[^"]+"/],
    ['og:title', /property="og:title"/],
    ['og:image', /property="og:image"/],
    ['hreflang', /rel="alternate" hreflang="/],
  ]) {
    if (!re.test(html)) missing.push(name);
  }
  if (JSON_LD_REQUIRED.some((re) => re.test(page)) && !/application\/ld\+json/.test(html)) {
    missing.push('json-ld');
  }
  const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical && !canonical.endsWith(page === '/' ? '/' : page)) {
    missing.push(`canonical-mismatch(${canonical})`);
  }
  if (missing.length > 0) failures.push(`${page}: ${missing.join(', ')}`);
}

if (failures.length > 0) {
  console.error(
    `prerender SEO gate FAILED (${failures.length} pages):\n- ${failures.join('\n- ')}`,
  );
  process.exit(1);
}
console.log('prerender SEO gate: all content pages fully tagged');
