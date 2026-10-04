import { isDevMode } from '@angular/core';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  provideMissingTranslationHandler,
  provideTranslateLoader,
  provideTranslateService,
} from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { routes } from './app.routes';
import { DEFAULT_LANG } from './i18n/routes.i18n';
import { StaticTranslationLoader } from './i18n/static-loader';

/**
 * Missing-key handler that fails loudly in dev (plan §14): warns with the
 * missing key so untranslated chrome strings break the console, not the UI.
 */
@Injectable()
export class LoudMissingTranslationHandler extends MissingTranslationHandler {
  override handle(params: MissingTranslationHandlerParams): string {
    if (isDevMode()) {
      console.warn(`[i18n] Missing translation key "${params.key}".`);
    }
    return params.key;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      fallbackLang: DEFAULT_LANG,
      /* Bundled dictionaries (see static-loader.ts): translations resolve
         synchronously in browser AND during SSG prerender. No HttpClient in
         v1 — the future ApiProvider re-adds provideHttpClient (§20). */
      loader: provideTranslateLoader(() => new StaticTranslationLoader()),
      missingTranslationHandler: provideMissingTranslationHandler(LoudMissingTranslationHandler),
    }),
  ],
};
