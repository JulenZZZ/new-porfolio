import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
} from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { SeoService } from '../../core/seo.service';
import { PortfolioService } from '../../services/portfolio.service';
import { textIn } from '../../models/lang';
import { pageUrl } from '../../i18n/routes.i18n';
import { environment } from '../../../environments/environment';
import { CtaBlock } from '../../shared/cta-block';
import { PlaceholderArt } from '../../shared/placeholder-art';
import { ProjectGrid } from '../../shared/project-grid';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeader } from '../../shared/section-header';
import { TranslateService } from '@ngx-translate/core';

const siteUrl = environment.siteUrl;

/** Home page (plan section 5.1). 2-col editorial hero with the ONLY gradient
 *  name treatment on the site; skills strip; 3 featured + view-all. */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RevealDirective, SectionHeader, CtaBlock, ProjectGrid, PlaceholderArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="home">
      <section class="hero" aria-labelledby="hero-name">
        <div class="hero-copy" appReveal>
          <p class="eyebrow">{{ t('home.eyebrow') }}</p>
          <h1 id="hero-name">
            Hi, I'm <span class="name-gradient">{{ profile().name }}</span>
          </h1>
          <p class="role">{{ role() }}</p>
          <p class="lead">{{ t('home.heroLead') }}</p>
          <p class="hero-ctas">
            <a class="btn-primary" [href]="portfolioUrl()">{{ t('home.viewWork') }}</a>
            <a class="btn-ghost" [href]="contactUrl()">{{ t('home.getInTouch') }}</a>
          </p>
        </div>
       <!-- <div class="hero-portrait" appReveal>
          <app-placeholder-art [src]="profile().portrait" [alt]="portraitAlt()" [priority]="true" monogram="JZ" ratio="4 / 5" />
        </div>-->
      </section>

      <section class="about-teaser" aria-labelledby="about-teaser-title">
        <app-section-header
          [eyebrow]="t('home.aboutEyebrow')"
          [title]="t('home.aboutTitle')"
          [lead]="t('home.aboutLead')"
        />
        <a class="text-link" [href]="aboutUrl()">{{ t('home.aboutMore') }} →</a>
      </section>

      <section class="skills" id="skills" aria-labelledby="skills-title">
        <app-section-header [eyebrow]="t('home.skillsEyebrow')" [title]="t('home.skillsTitle')" />
        <h2 id="skills-title" class="visually-hidden">{{ t('home.skillsTitle') }}</h2>
        <div class="skill-groups">
          @for (group of skillsGrouped(); track group.category) {
            <div class="skill-group" appReveal>
              <h3>{{ t('home.categoryNames.' + group.category) }}</h3>
              <ul>
                @for (skill of group.items; track skill.id) {
                  <li class="skill-badge">{{ skill.name }}</li>
                }
              </ul>
            </div>
          }
        </div>
      </section>

      <section class="featured" aria-labelledby="featured-title">
        <app-section-header [eyebrow]="t('home.featuredEyebrow')" [title]="t('home.featuredTitle')" />
        <h2 id="featured-title" class="visually-hidden">{{ t('home.featuredTitle') }}</h2>
        <app-project-grid
          [projects]="featured()"
          [lang]="effLang()"
          [hrefPrefix]="portfolioUrl()"
          [priority]="true"
        />
        <p class="view-all">
          <a class="btn-ghost" [href]="portfolioUrl()">{{ t('home.viewAll') }}</a>
        </p>
      </section>

      <app-cta-block
        [title]="t('home.contactTitle')"
        [text]="t('home.contactBody')"
        [primary]="{ label: profile().email, href: mailtoHref() }"
        [secondary]="{ label: t('home.getInTouch'), href: contactUrl() }"
      />
    </main>

    <nav class="sticky-cta" aria-label="Quick contact">
      <a class="sticky-mail" [href]="mailtoHref()">✉ {{ profile().email }}</a>
      <a class="sticky-portfolio" [href]="portfolioUrl()">{{ t('home.viewWork') }}</a>
    </nav>
  `,
  styles: [
    `
      .home {
        max-width: min(1120px, 100% - 3rem);
        margin: 0 auto;
      }
      .hero {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        padding: clamp(4.5rem, 9vw, 8.5rem) 0 3rem;
      }
      @media (min-width: 1024px) {
        .hero {
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
        }
      }
      .eyebrow {
        font-family: ui-monospace, monospace;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--teal-deep, #14667e);
      }
      h1 {
        font-size: clamp(2.5rem, 6vw, 4.75rem);
        line-height: 1.05;
        letter-spacing: -0.03em;
        margin: 0.5rem 0;
      }
      /* Gradient name treatment — ONLY used on this page. */
      .name-gradient {
        background: linear-gradient(90deg, #1d809f, #e16541 55%, #ecb807 110%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .role {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
      }
      .lead {
        font-size: 1.125rem;
        line-height: 1.7;
        color: var(--muted, #5c6570);
        max-width: 65ch;
      }
      .hero-ctas {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .hero-portrait {
        max-width: 26rem;
      }
      .hero-portrait.parallax {
        will-change: transform;
      }
      section {
        padding: 2.5rem 0;
      }
      .text-link {
        color: var(--teal-deep, #14667e);
        font-weight: 600;
      }
      .skill-groups {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
      }
      @media (min-width: 640px) {
        .skill-groups {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 1024px) {
        .skill-groups {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      .skill-group h3 {
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted, #5c6570);
        margin: 0 0 0.5rem;
      }
      .skill-group ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .skill-badge {
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        border-radius: 999px;
        padding: 0.375rem 0.875rem;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
      }
      .view-all {
        margin-top: 2rem;
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
      .sticky-cta {
        position: sticky;
        bottom: 0;
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem calc(0.5rem + env(safe-area-inset-bottom));
        background: var(--surface, #fff);
        border-top: 1px solid var(--line, rgba(22, 26, 29, 0.1));
      }
      .sticky-cta a {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9375rem;
      }
      .sticky-mail {
        background: var(--ember, #e16541);
        color: #fff;
      }
      .sticky-portfolio {
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        color: var(--ink, #161a1d);
      }
      @media (min-width: 1024px) {
        .sticky-cta {
          display: none;
        }
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
export class HomePage implements OnInit {
  private readonly store = inject(PortfolioService);
  private readonly languages = inject(LanguageService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translations = inject(TranslateService);

  protected readonly effLang = this.languages.currentLang;
  /** Static v1 data is always present — the assertion documents the
   *  `AsyncData` contract the future `ApiProvider` will fill asynchronously. */
  protected readonly t = (key: string, params?: Record<string, any>) =>
      this.translations.instant(key, params); 
  protected readonly profile = computed(() => this.store.profile().data!);
  protected readonly featured = computed(() => this.store.featured().data ?? []);
  protected readonly skillsGrouped = computed(() => this.store.skillsGrouped().data ?? []);
  protected readonly role = computed(() => textIn(this.effLang(), this.profile().role));
  protected readonly portraitAlt = computed(() =>
    textIn(this.effLang(), this.profile().portraitAlt),
  );
  protected readonly portfolioUrl = computed(() => pageUrl(this.effLang(), 'portfolio'));
  protected readonly aboutUrl = computed(() => pageUrl(this.effLang(), 'about'));
  protected readonly contactUrl = computed(() => pageUrl(this.effLang(), 'contact'));
  protected readonly mailtoHref = computed(() => `mailto:${this.profile().email}`);

  ngOnInit(): void {
    const lang = this.effLang();
    const profile = this.profile();
    const role = textIn(lang, profile.role);
    const canonical = `${siteUrl}${pageUrl(lang, 'home')}`;
    this.seo.build({
      title: `Julen Zulaika · Full Stack Developer`,
      description:
        lang === 'pl'
          ? 'Julen Zulaika — programista full-stack w Krakowie. Angular, TypeScript, nowoczesne aplikacje internetowe. Zobacz portfolio i skontaktuj się.'
          : 'Julen Zulaika — full-stack developer in Kraków. Angular, TypeScript, modern web apps. Browse the portfolio and get in touch.',
      canonical,
      ogImage: `${siteUrl}/og-default.png`,
      ogImageAlt: `${profile.name} — ${role}`,
      locale: lang,
    });
    this.seo.setAlternates([
      { lang: 'pl', href: `${siteUrl}${pageUrl('pl', 'home')}` },
      { lang: 'en', href: `${siteUrl}${pageUrl('en', 'home')}` },
      { lang: 'x-default', href: `${siteUrl}${pageUrl('pl', 'home')}` },
    ]);
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: role,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kraków',
        addressCountry: 'PL',
      },
      email: `mailto:${profile.email}`,
      url: canonical,
      sameAs: profile.socials.map((social) => social.href),
    });
    this.initParallax();
  }

  /** Subtle parallax: hero portrait only, rAF-throttled, desktop ≥1024px,
   *  disabled under reduced motion (plan section 15). */
  private initParallax(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia !== 'undefined') {
      const mq = window.matchMedia('(min-width: 1024px)');
      const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (!mq.matches || rm.matches) return;
    }
    let ticking = false;
    const onScroll = (): void => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>('.hero-portrait');
        if (el && window.scrollY < window.innerHeight) {
          el.style.transform = `translateY(${Math.min(window.scrollY * 0.06, 24)}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
