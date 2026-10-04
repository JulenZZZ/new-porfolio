import { TestBed } from '@angular/core/testing';
import { SeoService, type SeoMeta } from './seo.service';

const META: SeoMeta = {
  title: 'About · Julen Zulaika',
  description: 'Full-stack developer based in Kraków, Poland. Bio, diplomy i doświadczenie.',
  canonical: 'https://jzulaika.com/pl/o-mnie',
  ogImage: 'https://jzulaika.com/og-default.png',
  ogImageAlt: 'Julen Zulaika — full-stack developer',
  locale: 'pl',
};

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
  });

  it('sets title, description, canonical and robots', () => {
    service.build(META);
    expect(document.title).toBe(META.title);
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      META.description,
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      META.canonical,
    );
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index, follow',
    );
  });

  it('sets OG + Twitter + locale tags per plan section 16', () => {
    service.build(META);
    const prop = (p: string) =>
      document.querySelector(`meta[property="${p}"]`)?.getAttribute('content');
    expect(prop('og:title')).toBe(META.title);
    expect(prop('og:url')).toBe(META.canonical);
    expect(prop('og:type')).toBe('website');
    expect(prop('og:site_name')).toBe('Julen Zulaika');
    expect(prop('og:image')).toBe(META.ogImage);
    expect(prop('og:image:alt')).toBe(META.ogImageAlt);
    expect(prop('og:locale')).toBe('pl_PL');
    expect(document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe(
      'summary_large_image',
    );
  });

  it('marks noindex pages', () => {
    service.build({ ...META, noindex: true });
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, nofollow',
    );
  });

  it('manages hreflang alternates without duplicates', () => {
    service.setAlternates([
      { lang: 'pl', href: 'https://jzulaika.com/pl/o-mnie' },
      { lang: 'en', href: 'https://jzulaika.com/en/about' },
      { lang: 'x-default', href: 'https://jzulaika.com/pl/o-mnie' },
    ]);
    service.setAlternates([{ lang: 'pl', href: 'https://jzulaika.com/pl/o-mnie' }]);
    const links = document.head.querySelectorAll('link[data-seo="alternate"]');
    expect(links.length).toBe(1);
    expect(links[0].getAttribute('hreflang')).toBe('pl');
  });

  it('injects JSON-LD and escapes closing script tags', () => {
    service.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Julen Zulaika',
      jobTitle: 'Full-Stack Developer',
    });
    const script = document.head.querySelector('script[data-seo="seo-jsonld"]');
    expect(script?.getAttribute('type')).toBe('application/ld+json');
    expect(script?.textContent).toContain('Julen Zulaika');
    expect(script?.textContent).not.toContain('</');
  });
});
