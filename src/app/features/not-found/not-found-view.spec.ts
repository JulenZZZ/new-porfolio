import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { NotFoundView } from './not-found-view';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('NotFoundView', () => {
  let seoSpy: jasmine.SpyObj<SeoService>;
  let languages: LanguageService;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [NotFoundView],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    languages = TestBed.inject(LanguageService);
  });

  function setup(lang: 'pl' | 'en'): ComponentFixture<NotFoundView> {
    languages.use(lang);
    const fixture = TestBed.createComponent(NotFoundView);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a localized 404 with home + portfolio links (EN)', () => {
    const fixture = setup('en');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Page not found');
    const hrefs = [...fixture.nativeElement.querySelectorAll('.actions a')].map((a: unknown) =>
      (a as HTMLAnchorElement).getAttribute('href'),
    );
    expect(hrefs).toEqual(['/en', '/en/portfolio']);
  });

  it('renders a localized 404 with home + portfolio links (PL)', () => {
    const fixture = setup('pl');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
      'Nie znaleziono strony',
    );
    const hrefs = [...fixture.nativeElement.querySelectorAll('.actions a')].map((a: unknown) =>
      (a as HTMLAnchorElement).getAttribute('href'),
    );
    expect(hrefs).toEqual(['/pl', '/pl/portfolio']);
  });

  it('builds noindex SEO meta on init', () => {
    setup('en');
    const meta = seoSpy.build.calls.mostRecent().args[0];
    expect(meta.noindex).toBeTrue();
    expect(meta.locale).toBe('en');
  });
});
