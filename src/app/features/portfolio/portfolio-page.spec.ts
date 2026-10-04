import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PortfolioPage } from './portfolio-page';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('PortfolioPage', () => {
  let fixture: ComponentFixture<PortfolioPage>;
  let seoSpy: jasmine.SpyObj<SeoService>;
  let languages: LanguageService;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    languages = TestBed.inject(LanguageService);
    languages.use('en');
    fixture = TestBed.createComponent(PortfolioPage);
    fixture.detectChanges();
  });

  function chips(): HTMLButtonElement[] {
    return [...fixture.nativeElement.querySelectorAll('.chip')];
  }

  it('derives filter chips from project tech as real buttons with aria-pressed', () => {
    const all = chips();
    expect(all.length).toBeGreaterThan(2);
    for (const chip of all) {
      expect(chip.tagName).toBe('BUTTON');
      expect(chip.getAttribute('aria-pressed')).toMatch(/^(true|false)$/);
    }
    const labels = all.map((c) => c.textContent.trim());
    expect(labels).toContain('Angular');
    expect(labels).toContain('Vue');
  });

  it('filters the grid when a chip is selected', () => {
    const vue = chips().find((c) => c.textContent.trim() === 'Vue')!;
    vue.click();
    fixture.detectChanges();
    expect(vue.getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('app-project-card').length).toBe(1);
  });

  it('restores the full grid when the All chip is reselected', () => {
    const vue = chips().find((c) => c.textContent.trim() === 'Vue')!;
    vue.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-project-card').length).toBe(1);
    const all = chips().find((c) => c.textContent.trim() === 'All')!;
    all.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-project-card').length).toBe(4);
  });

  it('builds SEO meta and alternates on init', () => {
    expect(seoSpy.build).toHaveBeenCalledTimes(1);
    expect(seoSpy.build.calls.mostRecent().args[0].canonical).toContain('/en/portfolio');
    expect(seoSpy.setAlternates).toHaveBeenCalledTimes(1);
  });
});
