import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { OG_LOCALE, type Lang } from '../i18n/routes.i18n';

/**
 * Centralised SEO builder — mirrors the Headstack SeoInput contract
 * (plan §2.2.2, §16). No meta literals in components: every page calls
 * build() with a SeoMeta object.
 */
export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogImageAlt: string;
  locale: Lang;
  noindex?: boolean;
}

export interface JsonLdNode {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}

const SITE_NAME = 'Julen Zulaika';
const TWITTER_CARD = 'summary_large_image';
const THEME_COLOR = '#FAFAF7';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly doc = inject(DOCUMENT);

  /** Set title, description, canonical, robots, OG + Twitter, locale. */
  build(meta: SeoMeta): void {
    this.title.setTitle(meta.title);
    this.meta.updateTag({ name: 'description', content: meta.description });
    this.meta.updateTag({
      name: 'robots',
      content: meta.noindex ? 'noindex, nofollow' : 'index, follow',
    });
    this.setCanonical(meta.canonical);

    this.meta.updateTag({ property: 'og:title', content: meta.title });
    this.meta.updateTag({ property: 'og:description', content: meta.description });
    this.meta.updateTag({ property: 'og:url', content: meta.canonical });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:image', content: meta.ogImage });
    this.meta.updateTag({ property: 'og:image:alt', content: meta.ogImageAlt });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[meta.locale] });

    this.meta.updateTag({ name: 'twitter:card', content: TWITTER_CARD });
    this.meta.updateTag({ name: 'twitter:title', content: meta.title });
    this.meta.updateTag({ name: 'twitter:description', content: meta.description });
    this.meta.updateTag({ name: 'twitter:image', content: meta.ogImage });

    this.meta.updateTag({ name: 'theme-color', content: THEME_COLOR });
  }

  /**
   * hreflang alternates (pl, en, x-default) for a URL pair.
   * Runs on server AND browser: during prerender the tags serialize into
   * the static HTML (platform-server provides a DOM); in the browser they
   * update live on navigation.
   */
  setAlternates(hreflangs: { lang: string; href: string }[]): void {
    const head = this.doc.head;
    head.querySelectorAll('link[data-seo="alternate"]').forEach((el) => el.remove());
    for (const { lang, href } of hreflangs) {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      link.setAttribute('data-seo', 'alternate');
      head.appendChild(link);
    }
  }

  /** Inject (or replace) a JSON-LD script block, e.g. Person / CreativeWork. */
  setJsonLd(node: JsonLdNode | JsonLdNode[], id = 'seo-jsonld'): void {
    const head = this.doc.head;
    head.querySelector(`script[data-seo="${id}"]`)?.remove();
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-seo', id);
    script.textContent = JSON.stringify(Array.isArray(node) ? node : [node]).replace(
      /<\//g,
      '<\\/',
    );
    head.appendChild(script);
  }

  /**
   * NOTE: set attributes via `setAttribute`, never via IDL property
   * assignment (`link.href = …`). Verified during SSG prerender: IDL sets on
   * the server DOM do not survive serialization, `setAttribute` does.
   */
  private setCanonical(href: string): void {
    const head = this.doc.head;
    head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
    const link = this.doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', href);
    head.appendChild(link);
  }
}
