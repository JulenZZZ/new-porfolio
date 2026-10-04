import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  convertToParamMap,
} from '@angular/router';
import { provideRouter } from '@angular/router';
import { langGuard } from './lang.guard';
import { LanguageService } from './language.service';

function snapshot(lang: string | null): ActivatedRouteSnapshot {
  return {
    paramMap: convertToParamMap(lang === null ? {} : { lang }),
  } as ActivatedRouteSnapshot;
}

describe('langGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('activates supported languages and syncs the language service', () => {
    const languages = TestBed.inject(LanguageService);
    const state = { url: '/pl' } as never;
    expect(TestBed.runInInjectionContext(() => langGuard(snapshot('pl'), state))).toBeTrue();
    expect(languages.currentLang()).toBe('pl');
    expect(TestBed.runInInjectionContext(() => langGuard(snapshot('en'), state))).toBeTrue();
    expect(languages.currentLang()).toBe('en');
  });

  it('redirects unknown languages to /en (404-safe)', () => {
    const router = TestBed.inject(Router);
    const state = { url: '/de' } as never;
    const result = TestBed.runInInjectionContext(() => langGuard(snapshot('de'), state));
    expect(result).toBeInstanceOf(RedirectCommand);
    expect(router.serializeUrl((result as RedirectCommand).redirectTo)).toBe('/en');
  });

  it('redirects a missing :lang param to /en', () => {
    const result = TestBed.runInInjectionContext(() =>
      langGuard(snapshot(null), { url: '/' } as never),
    );
    expect(result).toBeInstanceOf(RedirectCommand);
  });
});
