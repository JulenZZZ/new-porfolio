import { Observable, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import en from './en.json';
import pl from './pl.json';

/**
 * Bundled translation loader (replaces the HTTP loader).
 *
 * Decision: relative-URL `HttpClient` calls fail during SSG prerender
 * (platform-server supports absolute URLs only), so prerendered HTML would
 * ship untranslated keys for header/footer/nav. Both dictionaries are ~2 KB
 * total — bundling them costs nothing measurable and makes translations
 * available synchronously in browser AND prerender. `HttpClient` therefore
 * has no v1 user and is NOT provided (the future `ApiProvider` re-adds it).
 */
type Dictionary = typeof en;

export class StaticTranslationLoader extends TranslateLoader {
  private readonly dictionaries: Record<string, Dictionary> = { pl: pl as Dictionary, en };

  override getTranslation(lang: string): Observable<Dictionary> {
    return of(this.dictionaries[lang] ?? en);
  }
}
