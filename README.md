# Julen Zulaika — Personal Website

Minimalist + elegant personal website for Julen Zulaika, full-stack developer
(Kraków). Angular 20 standalone + prerendered SSG, Polish + English, deployed as
static files on Vercel. No backend in v1.

Spec: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) (24 sections — the
binding build document).

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

## Rules (from the plan)

- Components never import from `data/` — only via `PortfolioService`.
- No `HttpClient`/`fetch` outside providers (none in v1 at all).
- Exactly 1 runtime dependency: `@ngx-translate/core` (bundled static loader).
- Page-chrome copy lives in `data/ui-copy.*.ts`, never in components.

## Adding a project

1. Append to `src/app/data/projects.{en,pl}.ts` (all required fields — the
   contract spec enforces completeness).
2. `npm run export-routes` (adds the detail URL to prerender + sitemap).
3. `npm run build && npm run verify:seo`.

## Adding a language

Add `xx` to `Lang`/`LANGS`/`PAGE_SLUGS`, add `data/*..xx.ts` sets,
`i18n/xx.json`, extend the contract spec loops (they iterate `LANGS`), extend
`export-routes.mjs`.

## Backend swap (no UI rewrite)

Implement `ApiProvider implements DataProvider`, register it in the contract
spec (`describeDataProviderContract('Api', …)`), flip one `useClass` line in
`app.config.ts` (+ re-add `provideHttpClient`). Components and facade stay
untouched. Contact form arrives WITH the backend (Reactive Forms + POST).

## Decisions (why, and what was rejected)

- **Prerendered SSG, no SSR server**: SEO-ready HTML per URL with zero runtime
  server. Full SSR rejected (cost/failure modes, no dynamic data).
- **ngx-translate + bundled static loader** over `@angular/localize`: one
  build, runtime switching. HTTP loader rejected — relative-URL `HttpClient`
  fails during prerender (platform-server supports absolute URLs only), which
  would ship untranslated keys into static HTML.
- **No GSAP**: CSS + one `RevealDirective` covers the whole §15 table at ~0 KB.
- **Budgets are raw bytes** (Angular measures raw, not gzip): `initial`
  340 kB warn / 400 kB error ≈ the plan's ≤180 kB gzip goal (currently
  ~89 kB transfer).
- **`cli.cache.enabled: false`**: Angular's disk cache (lmdb/mmap) aborts in
  sandboxed shells; harmless elsewhere — re-enable with one line if desired.
- **Server DOM quirk**: IDL property sets (`link.href = …`) do not survive
  prerender serialization — `SeoService` uses `setAttribute` only (verified).
- **`main.server.ts` needs `BootstrapContext`** (NG0401 otherwise) — build-time
  only, nothing is deployed.

## Known gaps (owner input needed)

- Portrait + 4 project thumbnails ship as monogram placeholders
  (`PlaceholderArt`); real binaries (AVIF/WebP + JPEG, with dimensions) still
  needed, plus CV PDF hosting confirmation (currently Google Drive link).
- Polish copy is owner-grade draft — human review required before release.
- Canonical host is `https://www.jzulaika.com` (old site) — confirm the
  production domain, then update `environment.ts`, `robots.txt`, vercel.json.
- Karma specs compile (test bundle builds) but could not EXECUTE in this
  sandbox (TCP listen blocked) — CI runs them; run `npm test` locally.
- No axe/Lighthouse run from here (no browser automation in sandbox) —
  manual + CI follow-up per plan §25 before release.
