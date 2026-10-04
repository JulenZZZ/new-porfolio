import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { AboutPage } from './about-page';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('AboutPage', () => {
  let fixture: ComponentFixture<AboutPage>;
  let seoSpy: jasmine.SpyObj<SeoService>;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [AboutPage],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    TestBed.inject(LanguageService).use('pl');
    fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
  });

  it('renders the bio and a 2-diploma timeline', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('technologie');
    expect(fixture.nativeElement.querySelectorAll('.timeline li').length).toBe(2);
  });

  it('includes the Kraków note and a CV link', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Krakowa');
    const cv = fixture.nativeElement.querySelector('.bio-copy a[href*="drive.google.com"]');
    expect(cv).withContext('CV link').toBeTruthy();
  });

  it('builds localized SEO meta, alternates and Person JSON-LD on init', () => {
    expect(seoSpy.build).toHaveBeenCalledTimes(1);
    const meta = seoSpy.build.calls.mostRecent().args[0];
    expect(meta.locale).toBe('pl');
    expect(meta.canonical).toContain('/pl/o-mnie');
    expect(seoSpy.setAlternates).toHaveBeenCalledTimes(1);
    const jsonLd = seoSpy.setJsonLd.calls.mostRecent().args[0] as { '@type': string };
    expect(jsonLd['@type']).toBe('Person');
  });
});
