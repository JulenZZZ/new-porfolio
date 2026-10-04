import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from './home-page';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let seoSpy: jasmine.SpyObj<SeoService>;
  let languages: LanguageService;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    languages = TestBed.inject(LanguageService);
    languages.use('en');
    fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
  });

  it('creates the editorial hero with gradient name treatment', () => {
    const h1 = fixture.nativeElement.querySelector('#hero-name');
    expect(h1).withContext('hero h1').toBeTruthy();
    expect(h1.querySelector('.name-gradient').textContent).toContain('Julen Zulaika');
  });

  it('renders a 12-item grouped skills strip', () => {
    const badges = fixture.nativeElement.querySelectorAll('.skill-badge');
    expect(badges.length).withContext('12 skills').toBe(12);
    expect(fixture.nativeElement.querySelectorAll('.skill-group').length).toBeGreaterThan(0);
  });

  it('shows 3 featured projects plus a view-all link', () => {
    expect(fixture.nativeElement.querySelectorAll('app-project-card').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.view-all a').getAttribute('href')).toContain(
      '/portfolio',
    );
  });

  it('renders the sticky mobile CTA bar with mail + portfolio links', () => {
    const bar = fixture.nativeElement.querySelector('.sticky-cta');
    expect(bar).toBeTruthy();
    expect(bar.querySelector('.sticky-mail').getAttribute('href')).toContain(
      'mailto:julenz485@gmail.com',
    );
    expect(bar.querySelector('.sticky-portfolio').getAttribute('href')).toContain('/portfolio');
  });

  it('builds SEO meta, alternates and Person JSON-LD on init', () => {
    expect(seoSpy.build).toHaveBeenCalledTimes(1);
    const meta = seoSpy.build.calls.mostRecent().args[0];
    expect(meta.title).toContain('Julen Zulaika');
    expect(meta.canonical).toContain('/en');
    expect(meta.locale).toBe('en');
    expect(meta.ogImage).toContain('/og-default.png');
    expect(seoSpy.setAlternates).toHaveBeenCalledTimes(1);
    expect(seoSpy.setJsonLd).toHaveBeenCalledTimes(1);
    const jsonLd = seoSpy.setJsonLd.calls.mostRecent().args[0] as { '@type': string };
    expect(jsonLd['@type']).toBe('Person');
  });
});
