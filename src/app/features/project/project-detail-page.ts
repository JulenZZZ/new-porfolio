import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';
import { PortfolioService } from '../../services/portfolio.service';
import { textIn } from '../../models/lang';
import { pageUrl, projectUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { CtaBlock } from '../../shared/cta-block';
import { PlaceholderArt } from '../../shared/placeholder-art';
import { RevealDirective } from '../../shared/reveal.directive';

const siteUrl = environment.siteUrl;

/** Project detail: masthead, tech list, description, keyboard-operable
 *  scroll-snap gallery, prev/next nav, contact CTA. Unknown slug → 404. */
@Component({
  selector: 'app-project-detail-page',
  standalone: true,
  imports: [RevealDirective, CtaBlock, PlaceholderArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="detail">
      @if (project(); as p) {
        <p class="back" appReveal>
          <a [href]="portfolioUrl()">{{ t().back }}</a>
        </p>
        <header class="masthead" appReveal>
          <p class="eyebrow">{{ yearRole(p.year, roleText()) }}</p>
          <h1>{{ p.title }}</h1>
          <p class="lead">{{ tagline() }}</p>
        </header>

        <section class="tech" aria-labelledby="tech-title" appReveal>
          <h2 id="tech-title">{{ t().techTitle }}</h2>
          <ul>
            @for (tech of p.tech; track tech) {
              <li>{{ tech }}</li>
            }
          </ul>
        </section>

        <section class="description" aria-labelledby="desc-title" appReveal>
          <h2 id="desc-title" class="visually-hidden">{{ p.title }}</h2>
          <p>{{ description() }}</p>
        </section>

        <section class="gallery-wrap" aria-labelledby="gallery-title" appReveal>
          <h2 id="gallery-title">{{ t().galleryTitle }}</h2>
          <p class="hint">{{ t().galleryHint }}</p>
          <div
            class="gallery"
            role="region"
            aria-roledescription="carousel"
            aria-label="{{ p.title }}"
            tabindex="0"
            (keydown)="onGalleryKey($event)"
          >
            <div class="track">
              @for (img of p.images; track $index; let i = $index) {
                <figure
                  class="slide"
                  [class.active]="i === activeImage()"
                  [attr.aria-hidden]="i !== activeImage()"
                >
                  <app-placeholder-art [alt]="imgAlt(i)" monogram="JZ" ratio="16 / 10" />
                </figure>
              }
            </div>
          </div>
          @if (p.images.length > 1) {
            <p class="gallery-nav">
              <button type="button" (click)="stepImage(-1)" [attr.aria-label]="t().prevImage">
                ←
              </button>
              <span aria-live="polite">{{ activeImage() + 1 }} / {{ p.images.length }}</span>
              <button type="button" (click)="stepImage(1)" [attr.aria-label]="t().nextImage">
                →
              </button>
            </p>
          }
        </section>

        <nav class="neighbors" aria-label="Projects">
          @if (neighbors().prev; as prev) {
            <a class="neighbor" [href]="projectHref(prev.slug)">
              <span>{{ t().prevProject }}</span>
              <strong>{{ prev.title }}</strong>
            </a>
          }
          @if (neighbors().next; as next) {
            <a class="neighbor" [href]="projectHref(next.slug)">
              <span>{{ t().nextProject }}</span>
              <strong>{{ next.title }}</strong>
            </a>
          }
        </nav>

        <app-cta-block
          [title]="t().contactTitle"
          [text]="t().contactBody"
          [primary]="{ label: t().contactCta, href: contactUrl() }"
        />
      } @else {
        <div class="not-found" appReveal>
          <p class="eyebrow">{{ t().notFoundEyebrow }}</p>
          <h1>{{ t().notFoundTitle }}</h1>
          <p>{{ t().notFoundBody }}</p>
          <p>
            <a class="btn-ghost" [href]="portfolioUrl()">{{ t().back }}</a>
          </p>
        </div>
      }
    </main>
  `,
  styles: [
    `
      .detail {
        max-width: 720px;
        margin: 0 auto;
        padding: 0 1.5rem;
      }
      .back {
        padding-top: clamp(4.5rem, 9vw, 8.5rem);
      }
      .back a,
      .text-link {
        color: var(--teal-deep, #14667e);
        font-weight: 600;
      }
      .eyebrow {
        font-family: ui-monospace, monospace;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--teal-deep, #14667e);
      }
      h1 {
        font-size: clamp(2rem, 4.5vw, 3.25rem);
        margin: 0.5rem 0;
      }
      .lead {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--muted, #5c6570);
      }
      .tech ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tech li {
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        border-radius: 999px;
        padding: 0.375rem 0.875rem;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
      }
      .description p {
        line-height: 1.65;
      }
      .gallery {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        border-radius: 10px;
      }
      .gallery:focus-visible {
        outline: 2px solid var(--teal, #1d809f);
        outline-offset: 2px;
      }
      .track {
        display: flex;
        gap: 1rem;
        transition: opacity 300ms var(--ease-out, ease-out);
      }
      .slide {
        flex: 0 0 100%;
        scroll-snap-align: start;
        margin: 0;
      }
      .gallery-nav {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
      }
      .gallery-nav button {
        min-width: 44px;
        min-height: 44px;
        border-radius: 999px;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        background: transparent;
        cursor: pointer;
        font-size: 1.125rem;
      }
      .neighbors {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        margin-top: 3rem;
        border-top: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        padding-top: 1.5rem;
      }
      @media (min-width: 640px) {
        .neighbors {
          grid-template-columns: 1fr 1fr;
        }
      }
      .neighbor {
        display: block;
        text-decoration: none;
        color: inherit;
        min-height: 44px;
      }
      .neighbor span {
        color: var(--teal-deep, #14667e);
        font-size: 0.875rem;
        font-weight: 600;
      }
      .neighbor strong {
        display: block;
      }
      .not-found {
        padding: clamp(4.5rem, 9vw, 8.5rem) 0;
        text-align: center;
      }
      .btn-ghost {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        padding: 0.625rem 1.25rem;
        border-radius: 999px;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        color: var(--ink, #161a1d);
        text-decoration: none;
        font-weight: 600;
      }
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `,
  ],
})
export class ProjectDetailPage {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present (see HomePage note on `AsyncData`). */
  protected readonly t = computed(() => this.store.uiCopy().data!.project);
  protected readonly slug = computed(() => this.params()?.get('slug') ?? '');
  protected readonly project = computed(() => this.store.projectBySlug(this.slug())().data);
  protected readonly neighbors = computed(() => this.store.neighborsOf(this.slug()));
  protected readonly tagline = computed(() => {
    const p = this.project();
    return p ? textIn(this.effLang(), p.tagline) : '';
  });
  protected readonly description = computed(() => {
    const p = this.project();
    return p ? textIn(this.effLang(), p.description) : '';
  });
  protected readonly roleText = computed(() => {
    const p = this.project();
    return p ? textIn(this.effLang(), p.role) : '';
  });
  protected readonly portfolioUrl = computed(() => pageUrl(this.effLang(), 'portfolio'));
  protected readonly contactUrl = computed(() => pageUrl(this.effLang(), 'contact'));
  protected readonly activeImage = signal(0);

  constructor() {
    /* Router reuses this component across :slug navigations — refresh SEO
     * and the gallery cursor whenever slug or language changes. */
    effect(
      () => {
        const lang = this.effLang();
        /* `project` already depends on `slug` — reading it subscribes this
         * effect to slug, language and data changes. */
        const p = this.project();
        this.activeImage.set(0);
        if (p) {
          const canonical = `${siteUrl}${projectUrl(lang, p.slug)}`;
          this.seo.build({
            title: `${p.title} · Julen Zulaika`,
            description: textIn(lang, p.tagline),
            canonical,
            ogImage: `${siteUrl}/og-default.png`,
            ogImageAlt: `${p.title} — ${textIn(lang, p.tagline)}`,
            locale: lang,
          });
          this.seo.setAlternates([
            { lang: 'pl', href: `${siteUrl}${projectUrl('pl', p.slug)}` },
            { lang: 'en', href: `${siteUrl}${projectUrl('en', p.slug)}` },
            { lang: 'x-default', href: `${siteUrl}${projectUrl('pl', p.slug)}` },
          ]);
          this.seo.setJsonLd({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: p.title,
            description: textIn(lang, p.description),
            url: canonical,
            datePublished: String(p.year),
            keywords: p.tech.join(', '),
            author: { '@type': 'Person', name: 'Julen Zulaika' },
          });
        } else {
          this.seo.build({
            title: lang === 'pl' ? 'Nie znaleziono · Julen Zulaika' : 'Not found · Julen Zulaika',
            description: lang === 'pl' ? 'Nie znaleziono projektu.' : 'Project not found.',
            canonical: `${siteUrl}${pageUrl(lang, 'portfolio')}`,
            ogImage: `${siteUrl}/og-default.png`,
            ogImageAlt: 'Julen Zulaika — portfolio',
            locale: lang,
            noindex: true,
          });
          this.seo.setAlternates([
            { lang: 'pl', href: `${siteUrl}${pageUrl('pl', 'portfolio')}` },
            { lang: 'en', href: `${siteUrl}${pageUrl('en', 'portfolio')}` },
            { lang: 'x-default', href: `${siteUrl}${pageUrl('pl', 'portfolio')}` },
          ]);
        }
      },
      { allowSignalWrites: true },
    );
  }

  protected yearRole(year: number, role: string): string {
    return `${year} · ${role}`;
  }

  protected imgAlt(i: number): string {
    const p = this.project();
    const img = p?.images[i];
    return img ? textIn(this.effLang(), img.alt) : '';
  }

  protected stepImage(dir: 1 | -1): void {
    const p = this.project();
    if (!p || p.images.length < 2) return;
    const n = p.images.length;
    this.activeImage.set((this.activeImage() + dir + n) % n);
    this.scrollToActive();
  }

  protected onGalleryKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.stepImage(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.stepImage(-1);
    }
  }

  private scrollToActive(): void {
    if (typeof document === 'undefined') return;
    const slides = document.querySelectorAll('.gallery .slide');
    slides[this.activeImage()]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }

  protected projectHref(slug: string): string {
    return projectUrl(this.effLang(), slug);
  }
}
