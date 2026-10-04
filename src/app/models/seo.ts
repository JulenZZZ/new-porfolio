/**
 * SEO metadata for one concrete URL.
 * Mirrors the Headstack `SeoInput` contract (title, description, canonical,
 * OG/Twitter image, locale).
 */
export interface SeoMeta {
  /** Page title, ≤ 60 chars, `Page · Julen Zulaika` pattern. */
  title: string;
  /** Meta description, 140-160 chars, translated. */
  description: string;
  /** Absolute canonical URL of the page. */
  canonical: string;
  /** Absolute URL of the share image (1200x630). */
  ogImage: string;
  /** OG locale, `pl_PL` or `en_US`. */
  locale: string;
  /** Set for 404 / noindex pages. */
  noindex?: boolean;
}

/**
 * Language-level SEO defaults stored in `data/meta.*.ts`.
 * `canonical` is per-URL, so it is supplied at render time by `SeoService`.
 */
export type SiteMeta = Omit<SeoMeta, 'canonical'>;
