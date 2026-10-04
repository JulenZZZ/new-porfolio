import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { textIn } from '../models/lang';
import type { NavigationItem } from '../models/navigation';
import { LanguageService } from '../core/language.service';
import { ScrollService } from '../core/scroll.service';
import { PortfolioService } from '../services/portfolio.service';

/**
 * Site footer: nav, socials (inline SVG only), language note, © dynamic year,
 * privacy note, back-to-top (plan §5 chrome).
 */
@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="site-footer dark-section">
      <div class="site-footer__inner">
        <nav class="site-footer__nav" [attr.aria-label]="'footer.navLabel' | translate">
          @for (item of items(); track item.key) {
            <a
              class="site-footer__link"
              [routerLink]="item.path[lang()]"
              [fragment]="item.fragment"
            >
              {{ label(item) }}
            </a>
          }
        </nav>
        <div
          class="site-footer__socials"
          role="group"
          [attr.aria-label]="'footer.socialLabel' | translate"
        >
          <a [href]="socialHref('mail')" aria-label="Email">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
          </a>
          <a [href]="socialHref('linkedin')" target="_blank" rel="noopener" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z"
              />
            </svg>
          </a>
          <a [href]="socialHref('github')" target="_blank" rel="noopener" aria-label="GitHub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
              />
            </svg>
          </a>
        </div>
        <p class="site-footer__note">{{ 'footer.languageNote' | translate }}</p>
        <p class="site-footer__note">{{ 'footer.privacyNote' | translate }}</p>
        <p class="site-footer__legal">
          © {{ year() }} Julen Zulaika. {{ 'footer.rights' | translate }}
        </p>
        <button type="button" class="site-footer__top" (click)="toTop()">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path d="M12 19V5m-7 7 7-7 7 7" />
          </svg>
          {{ 'footer.backToTop' | translate }}
        </button>
      </div>
    </footer>
  `,
  styles: `
    .site-footer {
      margin-top: var(--section-rhythm);
    }

    .site-footer__inner {
      width: var(--container);
      margin-inline: auto;
      padding-block: var(--space-12);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .site-footer__nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2) var(--space-6);
    }

    .site-footer__link {
      color: var(--dark-muted);
      text-decoration: none;
      min-height: 44px;
      display: inline-flex;
      align-items: center;

      &:hover {
        color: var(--dark-ink);
      }

      &:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: var(--focus-offset);
      }

      &:active {
        color: var(--dark-ink);
      }
    }

    .site-footer__socials {
      display: flex;
      gap: var(--space-2);

      a {
        width: 44px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--dark-muted);
        border-radius: var(--radius-card);

        &:hover {
          color: var(--dark-ink);
        }

        &:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: var(--focus-offset);
        }

        &:active {
          color: var(--dark-ink);
        }
      }
    }

    .site-footer__note,
    .site-footer__legal {
      color: var(--dark-muted);
      font-size: 0.875rem;
    }

    .site-footer__top {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      background: transparent;
      border: 1px solid var(--dark-line);
      border-radius: var(--radius-pill);
      color: var(--dark-ink);
      padding: var(--space-2) var(--space-4);
      cursor: pointer;
      min-height: 44px;

      &:hover {
        border-color: var(--teal);
      }

      &:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: var(--focus-offset);
      }

      &:active {
        border-color: var(--teal);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  private readonly languages = inject(LanguageService);
  private readonly store = inject(PortfolioService);
  private readonly scroll = inject(ScrollService);

  readonly year = computed(() => new Date().getFullYear());
  readonly lang = this.languages.currentLang;

  /** Nav items come from the data layer (single source of truth, plan §9). */
  readonly items = computed(() => this.store.navigation().data?.items ?? []);
  /** Contact channels come from the data layer — never hardcoded URLs. */
  protected readonly contact = computed(() => this.store.contact().data);

  protected label(item: NavigationItem): string {
    return textIn(this.lang(), item.label);
  }

  protected socialHref(kind: string): string {
    return this.contact()?.socials.find((social) => social.kind === kind)?.href ?? '#';
  }

  toTop(): void {
    this.scroll.scrollToTop();
  }
}
