# Julen Zulaika — Personal Website

Minimalist + elegant personal website for Julen Zulaika, full-stack developer
(Kraków). Angular 20 standalone + prerendered SSG, Polish + English, deployed as
static files on Vercel. No backend in v1.


## Requirements

- Node 24 (pinned toolchain: Angular 20.3 — latest CLI needs Node ≥ 24.15;
  see Decisions)
- `npm ci`

## Scripts

| Command                 | What                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `npm start`             | dev server                                                                                         |
| `npm run build`         | production + prerender 16 routes to `dist/julen-website/browser`                                   |
| `npm run export-routes` | regenerate `prerender-routes.txt` + `public/sitemap.xml` from `data/` (run after adding a project) |
| `npm run verify:seo`    | gate: every prerendered page ships title, description, canonical, OG, hreflang, required JSON-LD   |
| `npm test`              | Karma/Jasmine (`--browsers=ChromeHeadlessNoSandbox` in CI/sandbox)                                 |
| `npm run lint`          | ESLint                                                                                             |

CI (`.github/workflows/ci.yml`) runs: tsc (app + spec), lint, tests,
build, SEO gate.

## Structure

```text
src/app/
  core/       LanguageService, SeoService, ScrollService, langGuard (singletons)
  shared/     Header, MobileMenu, Footer, LanguageSwitcher, SectionHeader,
              CtaBlock, ProjectCard, ProjectGrid, PlaceholderArt, RevealDirective…
  features/   home, about, portfolio, project, contact, not-found (routed pages)
  data/       *.pl.ts / *.en.ts — the ONLY place with copy
  models/     provider-agnostic interfaces (profile, skill, project, …)
  services/   PortfolioService facade → DATA_PROVIDER → StaticDataProvider
  i18n/       pl.json / en.json (chrome strings) + routes.i18n.ts + static-loader.ts
```
