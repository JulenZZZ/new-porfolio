/* Localized slug dictionary — single source for hreflang / canonical /
   same-page language switching (plan §5, §14). Project slugs stay
   language-neutral (identifiers, one URL per project). */

export type Lang = 'pl' | 'en';

export const SUPPORTED_LANGS: readonly Lang[] = ['pl', 'en'];

/** Default language: owner lives/works in Poland (plan §14). */
export const DEFAULT_LANG: Lang = 'pl';

export const OG_LOCALE: Record<Lang, string> = {
  pl: 'pl_PL',
  en: 'en_US',
} as const;

export type LocalizedPage = 'about' | 'contact';

/** Localized path segments per page (home + portfolio slugs are identical). */
export const PAGE_SLUGS: Record<LocalizedPage, Record<Lang, string>> = {
  about: { pl: 'o-mnie', en: 'about' },
  contact: { pl: 'kontakt', en: 'contact' },
} as const;

export function isLang(value: string | null | undefined): value is Lang {
  return value === 'pl' || value === 'en';
}

/** Reverse-lookup: localized segment → page key (null when not localized). */
export function pageFromSlug(slug: string): LocalizedPage | null {
  for (const page of Object.keys(PAGE_SLUGS) as LocalizedPage[]) {
    const entry = PAGE_SLUGS[page];
    if (entry.pl === slug || entry.en === slug) return page;
  }
  return null;
}

export function slugFor(page: LocalizedPage, lang: Lang): string {
  return PAGE_SLUGS[page][lang];
}

export type SitePage = 'home' | 'about' | 'portfolio' | 'contact';

/** Localized path for a site page root (no host, no trailing slash). */
export function pageUrl(lang: Lang, page: SitePage): string {
  if (page === 'home') return `/${lang}`;
  return localizedPath(lang, page === 'portfolio' ? 'portfolio' : page);
}

/** Localized URL of a project detail page (slugs stay language-neutral). */
export function projectUrl(lang: Lang, slug: string): string {
  return `${localizedPath(lang, 'portfolio')}/${slug}`;
}

/** Localized URL for a page root: '' (home), 'portfolio', about/contact slug. */
export function localizedPath(lang: Lang, page: '' | 'portfolio' | LocalizedPage): string {
  if (page === '') return `/${lang}`;
  if (page === 'portfolio') return `/${lang}/portfolio`;
  return `/${lang}/${slugFor(page, lang)}`;
}

/**
 * Same-page language switch: rewrites the first two URL segments
 * (current lang + page slug) into the target language. Unknown shapes
 * fall back to the target home — never to a dead end.
 */
export function translatePath(url: string, target: Lang): string {
  const [path, query] = url.split('?');
  const segments = path.split('/').filter(Boolean);
  const suffix = query !== undefined ? `?${query}` : '';

  if (segments.length === 0) return `/${target}${suffix}`;

  const [, ...rest] = segments;
  if (rest.length === 0) return `/${target}${suffix}`;

  const [head, ...tail] = rest;
  const page = head !== undefined ? pageFromSlug(head) : null;
  if (page !== null) {
    return `/${target}/${slugFor(page, target)}${tail.length > 0 ? `/${tail.join('/')}` : ''}${suffix}`;
  }
  return `/${target}/${rest.join('/')}${suffix}`;
}
