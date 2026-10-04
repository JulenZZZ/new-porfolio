import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';
import { PortfolioService } from '../../services/portfolio.service';
import { pageUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { ProjectGrid } from '../../shared/project-grid';
import { RevealDirective } from '../../shared/reveal.directive';

const siteUrl = environment.siteUrl;

/** Portfolio index: chips DERIVED from projects[].tech (real buttons,
 *  aria-pressed), ProjectGrid, empty-filter reset state. */
@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [RevealDirective, ProjectGrid],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="portfolio">
      <header class="page-head" appReveal>
        <p class="eyebrow">{{ t().eyebrow }}</p>
        <h1>{{ t().title }}</h1>
        <p class="lead">{{ t().lead }}</p>
      </header>

      <div class="chips" role="group" aria-label="Filter by technology" appReveal>
        <button
          type="button"
          class="chip"
          [class.active]="selected() === 'all'"
          [attr.aria-pressed]="selected() === 'all'"
          (click)="select('all')"
        >
          {{ t().all }}
        </button>
        @for (tech of techOptions(); track tech) {
          <button
            type="button"
            class="chip"
            [class.active]="selected() === tech"
            [attr.aria-pressed]="selected() === tech"
            (click)="select(tech)"
          >
            {{ tech }}
          </button>
        }
      </div>

      <p class="results" aria-live="polite">{{ t().results(filtered().length) }}</p>

      @if (filtered().length > 0) {
        <app-project-grid
          [projects]="filtered()"
          [lang]="effLang()"
          [hrefPrefix]="portfolioUrl()"
        />
      } @else {
        <div class="empty" appReveal>
          <p>{{ t().emptyTitle }}</p>
          <button type="button" class="btn-ghost" (click)="select('all')">{{ t().reset }}</button>
        </div>
      }
    </main>
  `,
  styles: [
    `
      .portfolio {
        max-width: min(1120px, 100% - 3rem);
        margin: 0 auto;
      }
      .page-head {
        padding: clamp(4.5rem, 9vw, 8.5rem) 0 1.5rem;
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
        color: var(--muted, #5c6570);
        font-size: 1.125rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .chip {
        min-height: 44px;
        min-width: 44px;
        padding: 0.5rem 1rem;
        border-radius: 999px;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        background: transparent;
        cursor: pointer;
        font: inherit;
        transition: background 200ms var(--ease-out, ease-out);
      }
      .chip.active {
        background: var(--teal, #1d809f);
        border-color: var(--teal, #1d809f);
        color: #fff;
      }
      .chip:focus-visible,
      .btn-ghost:focus-visible {
        outline: 2px solid var(--teal, #1d809f);
        outline-offset: 2px;
      }
      .results {
        color: var(--muted, #5c6570);
        font-size: 0.875rem;
      }
      .empty {
        padding: 3rem 0;
        text-align: center;
      }
      .btn-ghost {
        min-height: 44px;
        padding: 0.625rem 1.25rem;
        border-radius: 999px;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        background: transparent;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
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
export class PortfolioPage implements OnInit {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present (see HomePage note on `AsyncData`). */
  protected readonly t = computed(() => this.store.uiCopy().data!.portfolio);
  protected readonly techOptions = computed(() => this.store.allTech().data ?? []);
  protected readonly portfolioUrl = computed(() => pageUrl(this.effLang(), 'portfolio'));

  protected readonly selected = signal<string>('all');
  protected readonly filtered = computed(() => {
    const sel = this.selected();
    const all = this.store.projects().data ?? [];
    return sel === 'all' ? all : all.filter((p) => p.tech.includes(sel));
  });

  ngOnInit(): void {
    const lang = this.effLang();
    const canonical = `${siteUrl}${pageUrl(lang, 'portfolio')}`;
    this.seo.build({
      title: lang === 'pl' ? 'Portfolio · Julen Zulaika' : 'Portfolio · Julen Zulaika',
      description:
        lang === 'pl'
          ? 'Portfolio Julena Zulaiki: aplikacje w Angularze, Vue i ASP.NET. Filtruj projekty według technologii.'
          : "Julen Zulaika's portfolio: Angular, Vue and ASP.NET projects. Filter projects by technology.",
      canonical,
      ogImage: `${siteUrl}/og-default.png`,
      ogImageAlt: 'Julen Zulaika — portfolio',
      locale: lang,
    });
    this.seo.setAlternates([
      { lang: 'pl', href: `${siteUrl}${pageUrl('pl', 'portfolio')}` },
      { lang: 'en', href: `${siteUrl}${pageUrl('en', 'portfolio')}` },
      { lang: 'x-default', href: `${siteUrl}${pageUrl('pl', 'portfolio')}` },
    ]);
  }

  protected select(tech: string): void {
    this.selected.set(tech);
  }
}
