import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProjectDetailPage } from './project-detail-page';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';

const translateStub = {
  addLangs: () => undefined,
  use: () => undefined,
  getBrowserLang: () => 'en',
};

describe('ProjectDetailPage', () => {
  let seoSpy: jasmine.SpyObj<SeoService>;
  let languages: LanguageService;

  beforeEach(async () => {
    seoSpy = jasmine.createSpyObj<SeoService>('SeoService', [
      'build',
      'setAlternates',
      'setJsonLd',
    ]);
    await TestBed.configureTestingModule({
      imports: [ProjectDetailPage],
      providers: [
        { provide: SeoService, useValue: seoSpy },
        { provide: TranslateService, useValue: translateStub },
      ],
    }).compileComponents();
    languages = TestBed.inject(LanguageService);
  });

  function setup(slug: string, lang: 'pl' | 'en' = 'en'): ComponentFixture<ProjectDetailPage> {
    languages.use(lang);
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { paramMap: of(convertToParamMap({ slug })) },
    });
    const fixture = TestBed.createComponent(ProjectDetailPage);
    fixture.detectChanges();
    return fixture;
  }

  it('renders masthead, tech list and description for a known slug', () => {
    const fixture = setup('todo-list-app');
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('To-Do List App');
    expect(fixture.nativeElement.querySelectorAll('.tech li').length).toBe(4);
    expect(
      fixture.nativeElement.querySelector('.description p').textContent.length,
    ).toBeGreaterThan(50);
  });

  it('has a keyboard-operable scroll-snap gallery with arrows', () => {
    const fixture = setup('todo-list-app');
    const region = fixture.nativeElement.querySelector('[aria-roledescription="carousel"]');
    expect(region).withContext('carousel region').toBeTruthy();
    expect(region.getAttribute('tabindex')).toBe('0');
    const counter = fixture.nativeElement.querySelector('.gallery-nav span').textContent;
    expect(counter).toContain('1 / 2');
    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.gallery-nav span').textContent).toContain('2 / 2');
  });

  it('renders prev/next project navigation and a contact CTA', () => {
    const fixture = setup('car-store');
    const neighbors = fixture.nativeElement.querySelectorAll('.neighbor');
    expect(neighbors.length).toBe(2);
    expect(neighbors[0].getAttribute('href')).toContain('choreographer-website');
    expect(neighbors[1].getAttribute('href')).toContain('job-portal');
    expect(fixture.nativeElement.querySelector('app-cta-block')).toBeTruthy();
  });

  it('renders a localized 404 with noindex for an unknown slug', () => {
    const fixture = setup('no-such-project', 'pl');
    expect(fixture.nativeElement.querySelector('.not-found h1').textContent).toContain(
      'Nie znaleziono',
    );
    expect(fixture.nativeElement.querySelector('.not-found a').getAttribute('href')).toContain(
      '/portfolio',
    );
    const meta = seoSpy.build.calls.mostRecent().args[0];
    expect(meta.noindex).toBeTrue();
    expect(meta.locale).toBe('pl');
  });

  it('builds project SEO meta with CreativeWork JSON-LD for a known slug', () => {
    setup('job-portal');
    const meta = seoSpy.build.calls.mostRecent().args[0];
    expect(meta.title).toContain('Job Portal Site');
    expect(meta.canonical).toContain('/en/portfolio/job-portal');
    expect(seoSpy.setAlternates).toHaveBeenCalled();
    const jsonLd = seoSpy.setJsonLd.calls.mostRecent().args[0] as { '@type': string };
    expect(jsonLd['@type']).toBe('CreativeWork');
  });
});
