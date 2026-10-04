import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from '../i18n/routes.i18n';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
    translate = TestBed.inject(TranslateService);
  });

  it('creates with the default language active', () => {
    expect(service).toBeTruthy();
    expect(service.currentLang()).toBe(DEFAULT_LANG);
  });

  it('detect() falls back to the default when nothing is stored', () => {
    window.localStorage.clear();
    expect(service.detect()).toBe(DEFAULT_LANG);
  });

  it('use() switches language, <html lang> and persists the choice', () => {
    service.use('en');
    expect(service.currentLang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('jz-lang')).toBe('en');
    expect(translate.getFallbackLang()).toBeNull();

    service.use('pl');
    expect(service.currentLang()).toBe('pl');
    expect(document.documentElement.lang).toBe('pl');
  });

  it('detect() honors the persisted choice', () => {
    service.use('en');
    expect(service.detect()).toBe('en');
  });
});
