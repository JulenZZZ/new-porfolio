import { SiteMeta } from '../models/seo';

/**
 * Language-level SEO defaults (English). `canonical` is per-URL and is
 * supplied at render time by `SeoService`, so it is intentionally absent.
 * `ogImage` requires `/og-default.png` (branded 1200x630) to exist in v1.
 */
export const metaEn: SiteMeta = {
  title: 'Julen Zulaika — Full Stack Developer from Kraków',
  description:
    'Portfolio of Julen Zulaika, full-stack developer based in Kraków, Poland. Angular, TypeScript and modern web apps — view projects and get in touch.',
  ogImage: 'https://www.jzulaika.com/og-default.png',
  locale: 'en_US',
};
