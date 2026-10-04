import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SUPPORTED_LANGS, translatePath, type Lang } from '../i18n/routes.i18n';
import { LanguageService } from '../core/language.service';

/**
 * Accessible language switcher (plan §18): real <a hreflang> links to the
 * same page in the other language (slug-map lookup), current language marked
 * aria-current, full names "Polski / English" — never flags.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  template: `
    <nav class="lang-switcher" [attr.aria-label]="'language.label' | translate">
      @for (lang of langs(); track lang) {
        @if (lang === current()) {
          <span class="lang-switcher__current" aria-current="true">
            <span class="visually-hidden">{{ 'language.current' | translate }}: </span>
            {{ labelFor(lang) }}
          </span>
        } @else {
          <a
            class="lang-switcher__link"
            [href]="hrefFor(lang)"
            [hreflang]="lang"
            [attr.aria-label]="'language.switchTo' | translate"
            (click)="switch($event, lang)"
          >
            {{ labelFor(lang) }}
          </a>
        }
      }
    </nav>
  `,
  styles: `
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
    }

    .lang-switcher__link {
      color: var(--muted);
      text-decoration: none;
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

    .lang-switcher__current {
      font-weight: 600;
      color: var(--ink);
      padding: var(--space-2) var(--space-3);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly router = inject(Router);
  private readonly languages = inject(LanguageService);

  readonly current = this.languages.currentLang;
  readonly langs = computed(() => SUPPORTED_LANGS);

  labelFor(lang: Lang): string {
    return lang === 'pl' ? 'Polski' : 'English';
  }

  /** Same-page target URL in the other language (href works without JS). */
  hrefFor(lang: Lang): string {
    return translatePath(this.router.url, lang);
  }

  /** SPA navigation: same-page switch without a full reload. */
  switch(event: Event, lang: Lang): void {
    event.preventDefault();
    void this.router.navigateByUrl(this.hrefFor(lang));
  }
}
