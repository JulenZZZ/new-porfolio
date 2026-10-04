import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';
import { PortfolioService } from '../../services/portfolio.service';
import { pageUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { RevealDirective } from '../../shared/reveal.directive';

const siteUrl = environment.siteUrl;

/** Localized 404 view with home + portfolio links (no dead ends). */
@Component({
  selector: 'app-not-found-view',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="not-found" appReveal>
      <p class="eyebrow">{{ t().eyebrow }}</p>
      <h1>{{ t().title }}</h1>
      <p>{{ t().body }}</p>
      <p class="actions">
        <a class="btn-primary" [href]="homeUrl()">{{ t().home }}</a>
        <a class="btn-ghost" [href]="portfolioUrl()">{{ t().portfolio }}</a>
      </p>
    </main>
  `,
  styles: [
    `
      .not-found {
        max-width: 720px;
        margin: 0 auto;
        padding: clamp(4.5rem, 9vw, 8.5rem) 1.5rem;
        text-align: center;
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
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
      }
      .btn-primary,
      .btn-ghost {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        padding: 0.625rem 1.25rem;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
      }
      .btn-primary {
        background: var(--ember, #e16541);
        color: #fff;
      }
      .btn-ghost {
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        color: var(--ink, #161a1d);
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
export class NotFoundView implements OnInit {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present (see HomePage note on `AsyncData`). */
  protected readonly t = computed(() => this.store.uiCopy().data!.notFound);
  protected readonly homeUrl = computed(() => pageUrl(this.effLang(), 'home'));
  protected readonly portfolioUrl = computed(() => pageUrl(this.effLang(), 'portfolio'));

  ngOnInit(): void {
    const lang = this.effLang();
    this.seo.build({
      title: lang === 'pl' ? 'Nie znaleziono · Julen Zulaika' : 'Not found · Julen Zulaika',
      description: lang === 'pl' ? 'Nie znaleziono strony.' : 'Page not found.',
      canonical: `${siteUrl}${pageUrl(lang, 'home')}`,
      ogImage: `${siteUrl}/og-default.png`,
      ogImageAlt: 'Julen Zulaika',
      locale: lang,
      noindex: true,
    });
  }
}
