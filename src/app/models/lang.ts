/**
 * Language primitives shared by every model and data file.
 *
 * v1 supports exactly two languages: Polish (default) and English.
 * Authorial content uses {@link LocalText} (plain `{ pl, en }` objects)
 * instead of translation keys so translators edit TypeScript and a future
 * CMS can return the same shape unchanged.
 */
export type Lang = 'pl' | 'en';

/** Authorial copy in both supported languages. */
export interface LocalText {
  pl: string;
  en: string;
}

/** All supported languages, in default-first order. */
export const LANGS: readonly Lang[] = ['pl', 'en'];

/** Type guard for values coming from the router (`:lang` param). */
export function isLang(value: unknown): value is Lang {
  return value === 'pl' || value === 'en';
}

/** Selects the copy for the active language from a {@link LocalText}. */
export function textIn(lang: Lang, text: LocalText): string {
  return text[lang];
}
