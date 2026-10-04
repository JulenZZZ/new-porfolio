import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContactPage } from './contact-page';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;
  let seoSpy: jasmine.SpyObj<SeoService>;
  let languages: LanguageService;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    languages = TestBed.inject(LanguageService);
    languages.use('en');
    fixture = TestBed.createComponent(ContactPage);
    fixture.detectChanges();
  });

  it('has no <form> element', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
  });

  it('renders a big mailto CTA with per-language subject', () => {
    const big = fixture.nativeElement.querySelector('.big-mail');
    const href = big.getAttribute('href');
    expect(href).toContain('mailto:julenz485@gmail.com?subject=');
    expect(decodeURIComponent(href)).toContain('inquiry from your website');
    languages.use('pl');
    fixture.detectChanges();
    expect(
      decodeURIComponent(fixture.nativeElement.querySelector('.big-mail').getAttribute('href')),
    ).toContain('wiadomość ze strony');
  });

  it('copies the email with aria-live confirmation', fakeAsync(() => {
    (navigator as unknown as Record<string, unknown>)['clipboard'] = {
      writeText: jasmine.createSpy('writeText').and.resolveTo(undefined),
    };
    const btn = fixture.nativeElement.querySelector('.mail-actions .btn-ghost');
    btn.click();
    tick();
    fixture.detectChanges();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('julenz485@gmail.com');
    const live = fixture.nativeElement.querySelector('.copied[aria-live="polite"]');
    expect(live.textContent).toContain('copied to clipboard');
  }));

  it('renders LinkedIn/GitHub cards, CV link and availability note', () => {
    const cards = fixture.nativeElement.querySelectorAll('.social-card');
    expect(cards.length).toBe(2);
    expect(fixture.nativeElement.querySelector('.meta a[href*="drive.google.com"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.meta p').textContent).toContain(
      'open to new opportunities',
    );
  });

  it('builds SEO meta and alternates on init', () => {
    expect(seoSpy.build).toHaveBeenCalledTimes(1);
    expect(seoSpy.build.calls.mostRecent().args[0].canonical).toContain('/en/contact');
    expect(seoSpy.setAlternates).toHaveBeenCalledTimes(1);
  });
});
