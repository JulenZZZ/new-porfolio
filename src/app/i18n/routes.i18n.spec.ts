import {
  DEFAULT_LANG,
  OG_LOCALE,
  PAGE_SLUGS,
  SUPPORTED_LANGS,
  isLang,
  localizedPath,
  pageFromSlug,
  slugFor,
  translatePath,
} from './routes.i18n';

describe('routes.i18n', () => {
  it('supports exactly pl and en with pl default', () => {
    expect([...SUPPORTED_LANGS]).toEqual(['pl', 'en']);
    expect(DEFAULT_LANG).toBe('pl');
  });

  it('maps per-lang og:locale values', () => {
    expect(OG_LOCALE).toEqual({ pl: 'pl_PL', en: 'en_US' });
  });

  it('holds the frozen localized slugs', () => {
    expect(PAGE_SLUGS.about).toEqual({ pl: 'o-mnie', en: 'about' });
    expect(PAGE_SLUGS.contact).toEqual({ pl: 'kontakt', en: 'contact' });
  });

  it('validates language tags', () => {
    expect(isLang('pl')).toBeTrue();
    expect(isLang('en')).toBeTrue();
    expect(isLang('de')).toBeFalse();
    expect(isLang(null)).toBeFalse();
    expect(isLang(undefined)).toBeFalse();
  });

  it('round-trips slugs to pages in both languages', () => {
    expect(pageFromSlug('o-mnie')).toBe('about');
    expect(pageFromSlug('about')).toBe('about');
    expect(pageFromSlug('kontakt')).toBe('contact');
    expect(pageFromSlug('contact')).toBe('contact');
    expect(pageFromSlug('portfolio')).toBeNull();
    expect(slugFor('about', 'pl')).toBe('o-mnie');
    expect(slugFor('contact', 'en')).toBe('contact');
  });

  it('builds localized page paths (project slugs stay neutral)', () => {
    expect(localizedPath('pl', '')).toBe('/pl');
    expect(localizedPath('en', 'about')).toBe('/en/about');
    expect(localizedPath('pl', 'about')).toBe('/pl/o-mnie');
    expect(localizedPath('en', 'portfolio')).toBe('/en/portfolio');
    expect(localizedPath('pl', 'contact')).toBe('/pl/kontakt');
  });

  it('switches the same page between languages', () => {
    expect(translatePath('/pl/o-mnie', 'en')).toBe('/en/about');
    expect(translatePath('/en/about', 'pl')).toBe('/pl/o-mnie');
    expect(translatePath('/pl/kontakt', 'en')).toBe('/en/contact');
    expect(translatePath('/pl', 'en')).toBe('/en');
    expect(translatePath('/en/portfolio/todo-list-app', 'pl')).toBe('/pl/portfolio/todo-list-app');
    expect(translatePath('/pl/portfolio', 'en')).toBe('/en/portfolio');
  });

  it('falls back to the target home for unknown shapes', () => {
    expect(translatePath('/', 'en')).toBe('/en');
    expect(translatePath('/de/irgendwas', 'pl')).toBe('/pl/irgendwas');
  });
});
