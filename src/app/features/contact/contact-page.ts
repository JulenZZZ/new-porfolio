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
import { textIn } from '../../models/lang';
import { pageUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { RevealDirective } from '../../shared/reveal.directive';

const siteUrl = environment.siteUrl;

/** Contact page: big mailto CTA (per-language subject), copy-email button
 *  with aria-live confirmation, LinkedIn/GitHub cards, CV link,
 *  availability note. NO <form> — a form that cannot submit is dishonest UX. */
@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="contact">
      <header class="page-head" appReveal>
        <p class="eyebrow">{{ t().eyebrow }}</p>
        <h1>{{ t().title }}</h1>
        <p class="lead">{{ t().lead }}</p>
      </header>

      <section class="mail-cta" aria-label="Email" appReveal>
        <a class="big-mail" [href]="mailtoHref()">{{ contact().email }}</a>
        <p class="mail-actions">
          <a class="btn-primary" [href]="mailtoHref()">{{ t().writeToMe }}</a>
          <button type="button" class="btn-ghost" (click)="copyEmail()">{{ t().copyEmail }}</button>
        </p>
        <p class="copied" aria-live="polite">
          @if (copied()) {
            {{ t().copied }}
          }
        </p>
      </section>

      <section class="connect" aria-labelledby="connect-title" appReveal>
        <h2 id="connect-title">{{ t().connectTitle }}</h2>
        <ul class="social-cards">
          @for (s of socialCards(); track s.kind) {
            <li>
              <a class="social-card" [href]="s.href" target="_blank" rel="noopener">
                <strong>{{ s.label }}</strong>
                <span>{{ s.href }}</span>
              </a>
            </li>
          }
        </ul>
      </section>

      <section class="meta" appReveal>
        <h2>{{ t().availabilityLabel }}</h2>
        <p>{{ availability() }}</p>
        <p>
          <a class="btn-ghost" [href]="contact().cvUrl" rel="noopener">{{ t().cvLabel }}</a>
        </p>
      </section>
    </main>
  `,
  styles: [
    `
      .contact {
        max-width: 720px;
        margin: 0 auto;
        padding: 0 1.5rem;
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
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--muted, #5c6570);
      }
      .mail-cta {
        padding: 2.5rem 0;
        border-top: 1px solid var(--line, rgba(22, 26, 29, 0.1));
      }
      .big-mail {
        display: inline-block;
        font-size: clamp(1.25rem, 4vw, 2rem);
        font-weight: 700;
        color: var(--teal-deep, #14667e);
        overflow-wrap: anywhere;
      }
      .mail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
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
        font: inherit;
        cursor: pointer;
      }
      .btn-primary {
        background: var(--ember, #e16541);
        color: #fff;
        border: none;
      }
      .btn-ghost {
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        color: var(--ink, #161a1d);
        background: transparent;
      }
      .btn-primary:focus-visible,
      .btn-ghost:focus-visible,
      .big-mail:focus-visible,
      .social-card:focus-visible {
        outline: 2px solid var(--teal, #1d809f);
        outline-offset: 2px;
      }
      .copied {
        min-height: 1.5em;
        color: var(--teal-deep, #14667e);
        font-weight: 600;
      }
      .connect,
      .meta {
        padding: 2rem 0;
        border-top: 1px solid var(--line, rgba(22, 26, 29, 0.1));
      }
      .social-cards {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
      }
      @media (min-width: 640px) {
        .social-cards {
          grid-template-columns: 1fr 1fr;
        }
      }
      .social-card {
        display: block;
        padding: 1.25rem;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        border-radius: 10px;
        text-decoration: none;
        color: inherit;
        min-height: 44px;
      }
      .social-card strong {
        display: block;
        font-size: 1.125rem;
      }
      .social-card span {
        color: var(--muted, #5c6570);
        font-size: 0.875rem;
        overflow-wrap: anywhere;
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
export class ContactPage implements OnInit {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present (see HomePage note on `AsyncData`). */
  protected readonly t = computed(() => this.store.uiCopy().data!.contact);
  protected readonly contact = computed(() => this.store.contact().data!);
  /** Email already has its dedicated CTA above — cards show external profiles. */
  protected readonly socialCards = computed(() =>
    this.contact().socials.filter((social) => social.kind !== 'mail'),
  );
  protected readonly availability = computed(() =>
    textIn(this.effLang(), this.contact().availability),
  );
  protected readonly mailtoHref = computed(
    () => `mailto:${this.contact().email}?subject=${encodeURIComponent(this.t().mailSubject)}`,
  );
  protected readonly copied = signal(false);

  ngOnInit(): void {
    const lang = this.effLang();
    const canonical = `${siteUrl}${pageUrl(lang, 'contact')}`;
    this.seo.build({
      title: lang === 'pl' ? 'Kontakt · Julen Zulaika' : 'Contact · Julen Zulaika',
      description:
        lang === 'pl'
          ? 'Kontakt: Julen Zulaika, programista full-stack w Krakowie. E-mail, LinkedIn, GitHub i CV.'
          : 'Contact Julen Zulaika, full-stack developer in Kraków. Email, LinkedIn, GitHub and CV.',
      canonical,
      ogImage: `${siteUrl}/og-default.png`,
      ogImageAlt: 'Julen Zulaika — contact',
      locale: lang,
    });
    this.seo.setAlternates([
      { lang: 'pl', href: `${siteUrl}${pageUrl('pl', 'contact')}` },
      { lang: 'en', href: `${siteUrl}${pageUrl('en', 'contact')}` },
      { lang: 'x-default', href: `${siteUrl}${pageUrl('pl', 'contact')}` },
    ]);
  }

  protected async copyEmail(): Promise<void> {
    const email = this.contact().email;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else if (typeof document !== 'undefined') {
        const area = document.createElement('textarea');
        area.value = email;
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
    } catch {
      // Fall through: still confirm so keyboard/AT users get feedback.
    }
    this.copied.set(true);
  }
}
