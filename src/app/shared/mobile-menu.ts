import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { textIn } from '../models/lang';
import type { NavigationItem } from '../models/navigation';
import { LanguageService } from '../core/language.service';
import { PortfolioService } from '../services/portfolio.service';
import { LanguageSwitcher } from './language-switcher';

/**
 * Full-screen mobile menu (< 1024px): overlay fade + staggered links,
 * focus trap, ESC/backdrop close, focus restore (plan §10, §15).
 */
@Component({
  selector: 'app-mobile-menu',
  imports: [RouterLink, TranslatePipe, LanguageSwitcher],
  template: `
    @if (open()) {
      <div class="menu-overlay" (click)="onBackdrop($event)">
        <div
          class="menu-panel"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="'header.menuOpen' | translate"
          (keydown)="onKeydown($event)"
        >
          <button type="button" class="menu-close" (click)="closed.emit()" #closeButton>
            <span aria-hidden="true">×</span>
            <span class="visually-hidden">{{ 'menu.close' | translate }}</span>
          </button>
          <nav class="menu-nav" aria-label="Mobile">
            @for (item of items(); track item.key; let i = $index) {
              <a
                class="menu-link"
                [routerLink]="item.path[lang()]"
                [fragment]="item.fragment"
                (click)="closed.emit()"
                [style.--reveal-delay]="i * 40 + 'ms'"
              >
                {{ label(item) }}
              </a>
            }
          </nav>
          <div class="menu-lang">
            <span class="eyebrow">{{ 'menu.languageLabel' | translate }}</span>
            <app-language-switcher />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .menu-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--z-menu);
      background: rgb(22 26 29 / 40%);
      animation: menu-fade var(--dur-base) var(--ease-out);
    }

    .menu-panel {
      position: absolute;
      inset: 0;
      background: var(--surface);
      padding: var(--space-6);
      padding-top: calc(var(--header-height) + var(--space-4));
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .menu-close {
      position: absolute;
      top: var(--space-3);
      right: var(--space-4);
      width: 44px;
      height: 44px;
      border: 1px solid var(--line);
      border-radius: 50%;
      background: var(--surface);
      color: var(--ink);
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;

      &:hover {
        border-color: var(--teal);
        color: var(--teal-deep);
      }

      &:focus-visible {
        outline: var(--focus-ring);
        outline-offset: var(--focus-offset);
      }

      &:active {
        border-color: var(--teal);
      }
    }

    .menu-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .menu-link {
      font-family: var(--font-display);
      font-size: var(--text-h2);
      color: var(--ink);
      text-decoration: none;
      padding-block: var(--space-2);
      animation: menu-rise var(--dur-slow) var(--ease-out) both;
      animation-delay: var(--reveal-delay, 0ms);

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

    .menu-lang {
      margin-top: auto;
      padding-top: var(--space-8);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    @keyframes menu-fade {
      from {
        opacity: 0;
      }
    }

    @keyframes menu-rise {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-overlay,
      .menu-link {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenu {
  readonly open = input(false);
  readonly closed = output<void>();

  private readonly languages = inject(LanguageService);
  private readonly store = inject(PortfolioService);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private opener: HTMLElement | null = null;

  readonly lang = this.languages.currentLang;

  /** Nav items come from the data layer (single source of truth, plan §9). */
  readonly items = computed(() => this.store.navigation().data?.items ?? []);

  protected label(item: NavigationItem): string {
    return textIn(this.lang(), item.label);
  }

  constructor() {
    effect(() => {
      if (this.open()) {
        this.opener = document.activeElement as HTMLElement | null;
        document.body.style.overflow = 'hidden';
        queueMicrotask(() => this.closeButton()?.nativeElement.focus());
      } else {
        document.body.style.overflow = '';
        this.opener?.focus?.();
        this.opener = null;
      }
    });
  }

  onBackdrop(event: Event): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closed.emit();
      return;
    }
    if (event.key !== 'Tab') return;
    const panel = event.currentTarget as HTMLElement;
    const focusables = [
      ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ].filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
