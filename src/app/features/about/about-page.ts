import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';
import { PortfolioService } from '../../services/portfolio.service';
import { textIn } from '../../models/lang';
import { pageUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { CtaBlock } from '../../shared/cta-block';
import { PlaceholderArt } from '../../shared/placeholder-art';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeader } from '../../shared/section-header';
import { TranslateService } from '@ngx-translate/core';

const siteUrl = environment.siteUrl;

/** About page: full bio, 2-diploma timeline, Kraków note, CV link. */
@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RevealDirective, SectionHeader, CtaBlock, PlaceholderArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="about">
      <header class="page-head" appReveal>
        <p class="eyebrow">{{ t('about.eyebrow') }}</p>
        <h1>{{ t('about.title') }}</h1>
      </header>

      <div class="bio-grid">
        <div class="bio-copy" appReveal>
          <p>{{ t('about.para1') }}</p>
          <p>{{ t('about.para2') }}</p>
          <p>
            <a class="btn-ghost" [href]="profile().cvUrl" rel="noopener">{{ t('about.cvLabel') }}</a>
          </p>
        </div>
        <div class="bio-portrait" appReveal>
          <app-placeholder-art [alt]="portraitAlt()" monogram="JZ" ratio="4 / 5" />
        </div>
      </div>

      <section class="education" aria-labelledby="education-title">
        <app-section-header [eyebrow]="t('about.educationEyebrow')" [title]="t('about.educationTitle')" />
        <h2 id="education-title" class="visually-hidden">{{ t('about.educationTitle') }}</h2>
        <ol class="timeline">
          <li appReveal>
            <h3>{{ t('about.diploma1Title') }}</h3>
            <p class="timeline-meta">{{ t('about.diploma1Meta') }}</p>
            <p>{{ t('about.diploma1Body') }}</p>
          </li>
          <li appReveal [appRevealDelay]="80">
            <h3>{{ t('about.diploma2Title') }}</h3>
            <p class="timeline-meta">{{ t('about.diploma2Meta') }}</p>
            <p>{{ t('about.diploma2Body') }}</p>
          </li>
        </ol>
      </section>

      <section class="krakow" aria-labelledby="krakow-title">
        <app-section-header
          [eyebrow]="t('about.krakowEyebrow')"
          [title]="t('about.krakowTitle')"
          [lead]="t('about.krakowBody')"
        />
        <h2 id="krakow-title" class="visually-hidden">{{ t('about.krakowTitle') }}</h2>
      </section>

      <app-cta-block
        [title]="t('about.ctaTitle')"
        [text]="t('about.ctaBody')"
        [primary]="{ label: profile().email, href: mailtoHref() }"
        [secondary]="{ label: t('about.ctaSecondary'), href: contactUrl() }"
      />
    </main>
  `,
  styles: [
    `
      .about {
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
        margin: 0.5rem 0 0;
        letter-spacing: -0.02em;
      }
      .bio-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        max-width: 720px;
      }
      .bio-copy p {
        line-height: 1.65;
      }
      .bio-portrait {
        max-width: 22rem;
      }
      .education,
      .krakow {
        padding: 2.5rem 0;
        max-width: 720px;
      }
      .timeline {
        list-style: none;
        margin: 0;
        padding: 0 0 0 1.25rem;
        border-left: 2px solid var(--teal, #1d809f);
        display: grid;
        gap: 2rem;
      }
      .timeline h3 {
        margin: 0 0 0.25rem;
      }
      .timeline-meta {
        margin: 0 0 0.5rem;
        color: var(--muted, #5c6570);
        font-size: 0.875rem;
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
export class AboutPage implements OnInit {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);
  private readonly translations = inject(TranslateService);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present (see HomePage note on `AsyncData`). */
  protected readonly t = (key: string, params?: Record<string, any>) =>
      this.translations.instant(key, params);  
  protected readonly profile = computed(() => this.store.profile().data!);
  protected readonly portraitAlt = computed(() =>
    textIn(this.effLang(), this.profile().portraitAlt),
  );
  protected readonly contactUrl = computed(() => pageUrl(this.effLang(), 'contact'));
  protected readonly mailtoHref = computed(() => `mailto:${this.profile().email}`);

  ngOnInit(): void {
    const lang = this.effLang();
    const profile = this.profile();
    const canonical = `${siteUrl}${pageUrl(lang, 'about')}`;
    this.seo.build({
      title: lang === 'pl' ? 'O mnie · Julen Zulaika' : 'About · Julen Zulaika',
      description:
        lang === 'pl'
          ? 'O mnie: Julen Zulaika, programista full-stack w Krakowie. Dwa dyplomy z tworzenia aplikacji, doświadczenie komercyjne, CV do pobrania.'
          : 'About Julen Zulaika, full-stack developer in Kraków. Two application-development diplomas, commercial experience, downloadable CV.',
      canonical,
      ogImage: `${siteUrl}/og-default.png`,
      ogImageAlt: `${profile.name} — ${textIn(lang, profile.role)}`,
      locale: lang,
    });
    this.seo.setAlternates([
      { lang: 'pl', href: `${siteUrl}${pageUrl('pl', 'about')}` },
      { lang: 'en', href: `${siteUrl}${pageUrl('en', 'about')}` },
      { lang: 'x-default', href: `${siteUrl}${pageUrl('pl', 'about')}` },
    ]);
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: textIn(lang, profile.role),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kraków',
        addressCountry: 'PL',
      },
      email: `mailto:${profile.email}`,
      url: canonical,
      sameAs: profile.socials.map((social) => social.href),
    });
  }
}
