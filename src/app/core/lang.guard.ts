import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { isLang } from '../i18n/routes.i18n';
import { LanguageService } from './language.service';

/**
 * Validates the :lang parent param (plan §8, §11). Unknown languages
 * redirect to /en (404-safe); valid ones activate the language
 * (TranslateService + <html lang> + persisted choice).
 */
export const langGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const languages = inject(LanguageService);
  const param = route.paramMap.get('lang');

  if (!isLang(param)) {
    return new RedirectCommand(router.parseUrl('/en'));
  }
  languages.use(param);
  return true;
};
