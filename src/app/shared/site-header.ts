import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { localizedPath } from '../i18n/routes.i18n';
import { textIn } from '../models/lang';
import type { NavigationItem } from '../models/navigation';
import { LanguageService } from '../core/language.service';
import { PortfolioService } from '../services/portfolio.service';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';

/** Site header: wordmark, desktop nav, LanguageSwitcher, burger → MobileMenu. */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguageSwitcher, MobileMenu],
  template: `
    <header class="site-header" [class.site-header--scrolled]="scrolled()">
      <div class="site-header__inner">
        <a class="wordmark" [routerLink]="homePath()" [attr.aria-label]="'header.home' | translate">
          <span class="wordmark__mark" aria-hidden="true">JZ</span>
          <span class="wordmark__name">Julen Zulaika</span>
        </a>
        <nav class="desktop-nav" [attr.aria-label]="'header.home' | translate">
          @for (item of items(); track item.key) {
            <a
              class="desktop-nav__link"
              [routerLink]="item.path[lang()]"
              [fragment]="item.fragment"
              routerLinkActive="desktop-nav__link--active"
              [routerLinkActiveOptions]="{ exact: item.key !== 'portfolio' }"
            >
              {{ label(item) }}
            </a>
          }
        </nav>
        <div class="site-header__tools">
          <app-language-switcher class="site-header__lang" />
          <button
            type="button"
            class="burger"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-menu"
            [attr.aria-label]="
              menuOpen() ? ('header.menuClose' | translate) : ('header.menuOpen' | translate)
            "
            (click)="menuOpen.set(true)"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </header>
    <app-mobile-menu [open]="menuOpen()" (closed)="menuOpen.set(false)" />
  `,
  styles: `
    .site-header {
      position: sticky;
      top: 0;
      z-index: var(--z-header);
      background: transparent;
      border-bottom: 1px solid transparent;
      transition:
        background var(--dur-base) var(--ease-out),
        border-color var(--dur-base) var(--ease-out);
    }

    .site-header--scrolled {
      background: color-mix(in srgb, var(--bg) 88%, transparent);
      backdrop-filter: blur(12px);
      border-bottom-color: var(--line);
    }

    .site-header__inner {
      width: var(--container);
      margin-inline: auto;
      height: var(--header-height);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .wordmark {
      display: inline-flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: var(--ink);
      margin-right: auto;
      min-height: 44px;

      &:hover .wordmark__name {
        color: var(--teal-deep);
      }

      &:focus-visible {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }
    }

    .wordmark__mark {
      font-family: var(--font-mono);
      font-weight: 500;
      font-size: 0.875rem;
      color: #fff;
      background: var(--teal-deep);
      border-radius: 6px;
      padding: var(--space-1) var(--space-2);
    }

    .wordmark__name {
      font-family: var(--font-display);
      font-weight: 500;
      font-size: 1.125rem;
      transition: color var(--dur-fast) var(--ease-out);
    }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: var(--space-2);
    }

    @media (min-width: 1024px) {
      .desktop-nav {
        display: inline-flex;
      }
    }

    .desktop-nav__link {
      color: var(--muted);
      text-decoration: none;
      font-weight: 500;
      padding: var(--space-2) var(--space-3);
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      border-radius: var(--radius-card);

      &:hover {
        color: var(--teal-deep);
      }

      &:focus-visible {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }

      &:active {
        color: var(--teal-deep);
      }
    }

    .desktop-nav__link--active {
      color: var(--ink);
      text-decoration: underline;
      text-decoration-color: var(--ember);
      text-decoration-thickness: 2px;
      text-underline-offset: 6px;
    }

    .site-header__tools {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .site-header__lang {
      display: none;
    }

    @media (min-width: 1024px) {
      .site-header__lang {
        display: inline-flex;
      }
    }

    .burger {
      width: 44px;
      height: 44px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-card);
      cursor: pointer;

      span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--ink);
        border-radius: 1px;
      }

      &:hover span {
        background: var(--teal-deep);
      }

      &:focus-visible {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }

      &:active span {
        background: var(--teal-deep);
      }
    }

    @media (min-width: 1024px) {
      .burger {
        display: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  private readonly languages = inject(LanguageService);
  private readonly store = inject(PortfolioService);

  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly lang = this.languages.currentLang;
  readonly homePath = computed(() => localizedPath(this.lang(), ''));

  /** Nav items come from the data layer (single source of truth, plan §9). */
  readonly items = computed(() => this.store.navigation().data?.items ?? []);

  protected label(item: NavigationItem): string {
    return textIn(this.lang(), item.label);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }
}
