import { Lang, LocalText } from './lang';

/** One header/footer navigation entry with per-language target URLs. */
export interface NavigationItem {
  /** Stable key, e.g. "portfolio". */
  key: string;
  label: LocalText;
  /** Localised path, e.g. `{ pl: '/pl/portfolio', en: '/en/portfolio' }`. */
  path: Record<Lang, string>;
  /** Optional route fragment (e.g. Skills scrolls to the Home section). */
  fragment?: string;
}

/** Site navigation (header + footer share the same data). */
export interface Navigation {
  items: NavigationItem[];
}
