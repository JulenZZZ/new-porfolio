import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, SUPPORTED_LANGS, isLang, type Lang } from '../i18n/routes.i18n';

const STORAGE_KEY = 'jz-lang';
const COOKIE_KEY = 'jz-lang';

/** Minimal persisted-choice + runtime language state (plan §8, §14). */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly langSignal = signal<Lang>(DEFAULT_LANG);
  readonly currentLang = this.langSignal.asReadonly();

  constructor() {
    this.translate.addLangs([...SUPPORTED_LANGS]);
  }

  /** Resolve the initial language: stored choice → browser → default. */
  detect(): Lang {
    if (this.isBrowser) {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLang(stored)) return stored;
      } catch {
        /* storage unavailable (private mode) — fall through */
      }
      const browser = this.translate.getBrowserLang();
      if (isLang(browser)) return browser;
    }
    return DEFAULT_LANG;
  }

  /**
   * Activate a language: translate service, <html lang>, persisted choice.
   * The choice is stored in localStorage (in-app) AND a `jz-lang` cookie so
   * the Vercel edge redirect (`vercel.json`) can honour it for bare `/`
   * visits without any server code.
   */
  use(lang: Lang): void {
    this.langSignal.set(lang);
    this.translate.use(lang);
    if (this.isBrowser) {
      document.documentElement.lang = lang;
      try {
        window.localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* non-fatal: language still applies to this session */
      }
      document.cookie = `${COOKIE_KEY}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  }
}
