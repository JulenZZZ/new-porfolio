# Website Rebuild — Implementation Plan
### Julen Zulaika personal website · Angular · PL + EN · Vercel

> **Implementation status (2026-10-04): IMPLEMENTED in this repo** — Angular
> 20.3 SSG per this spec (see README.md for build/test/deploy). Deviations from
> the plan are recorded in README “Decisions” (static translate loader,
> `@ngx-translate/core` only, budgets in raw bytes). Owner review still needed:
> PL copy, photo/thumbnail binaries, production domain, Vercel deploy.

> Status: **PLAN ONLY — do not implement.** This document is the complete build
> specification. Another senior developer must be able to implement the entire
> website from this file without rediscovering the architecture.
> Rule: no code, no components, no refactoring of any existing app until a
> follow-up instruction explicitly authorises implementation.

---

## 1. Executive summary

Build a new minimalist + elegant personal website for **Julen Zulaika (full-stack
developer, based in Kraków, Poland)**. Content, structure and branding come from
the current site at `https://www.jzulaika.com/`; engineering quality bar,
component discipline and infrastructure practices are informed by the Headstack
project (`/Users/szymonglowka/Desktop/GIT/headstack`, live at
`https://headstack.pl/`). The design itself is **new** — neither a clone of
Jzulaika's Bootstrap-based one-pager nor a copy of Headstack's dark/lime studio
aesthetic.

Key decisions (each justified in its section):

| # | Decision | Rationale in short |
|---|----------|--------------------|
| 1 | Greenfield **Angular (latest stable, ≥ v20)** standalone-component app | Target stack required; Headstack is React and contributes zero reusable UI code |
| 2 | **Prerendered SSG**, no SSR server on Vercel v1 | SEO-ready without backend; SSR only if/when a backend arrives |
| 3 | `/pl` + `/en` prefixed routes, **ngx-translate** with lazy JSON | Runtime switching without reload or double builds; correct multilingual SEO via `hreflang` + per-lang meta |
| 4 | **No GSAP.** CSS transitions + one `RevealDirective` (IntersectionObserver) | "Medium" animation level is fully achievable natively; avoids ~60 KB JS |
| 5 | Data layer: typed **models → `PortfolioService` facade → swappable provider** (`StaticDataProvider` now, `ApiProvider` later) | UI never rewritten when CMS/API arrives (Rule 4) |
| 6 | Contact = `mailto:` + `tel:` + external social links only | No backend in v1 (Rule 5); form-shaped UI must not imply a working form |
| 7 | Light, typography-first design system derived from Jzulaika's teal accent | Preserves brand recognition without the Bootstrap template look |

**Scope of v1:** 5 page-equivalents (Home incl. hero/about/skills/portfolio-preview,
About, Portfolio index + project detail, Contact), PL + EN, mobile-first,
WCAG 2.2 AA, prerendered, deployed on Vercel.

**Explicitly out of v1:** backend, CMS, contact-form submission, auth, database,
blog, analytics beyond privacy-friendly script (optional, deferred).

---

## 2. Current Headstack analysis (inspected, not assumed)

Inspected directly: `/Users/szymonglowka/Desktop/GIT/headstack`
(`frontend/` tree, configs, styles, tests, CI, deploy; `backend/`, `docs/` at
directory level). All claims below were read from the repo.

### 2.1 Actual stack (finding: it is NOT Angular)

- **React 19 + React Router 7 (SSR via Express `server.js`) + Vite 7**,
  `headstack-frontend@0.2.0`, Node ≥ 22. TypeScript **strict**
  (`noUncheckedIndexedAccess`, `noUnusedLocals`, `verbatimModuleSyntax`).
- Validation: **Zod** (+ dev-only response-schema checks in `src/lib/api/client.ts`);
  forms: `react-hook-form` + `@hookform/resolvers`.
- Tests: **Vitest** + Testing Library (`ContactForm.test.tsx`,
  `homepageCopy.test.ts`, `inquiry.test.ts`, `meta.test.ts`, `canonical.test.ts`).
- Lint/format: ESLint 9 flat config + Prettier. CI: `.github/workflows/ci.yml`
  (backend job with Postgres 17 + Redis 7 services; frontend job), `deploy.yml`.
  Deploy: multi-stage **Docker** (`deps → builder → runner`, non-root user,
  `npm prune --omit=dev`, `/healthz`), behind `deploy/nginx.conf` edge proxy.
- Backend: **Django** + DRF + Postgres (directory-level inspection only).

### 2.2 Reusable — as patterns to re-implement in Angular, not as code

Nothing ports line-for-line (different framework), but these proven ideas are
adopted (each mapped to its Angular equivalent in §8):

1. **Typed data layer with static fallbacks** — `src/types/*` mirror backend
   serializer shapes; `src/content/*.ts` hold signed-off copy as single source of
   truth (e.g. `HERO_COPY`); `src/lib/api/*` is a typed fetch wrapper with a
   normalised `ApiError` shape; `AppDataProvider` exposes `AsyncState<T>`
   (`loading | success | error` + `refetch`) with SSR-hydration support.
   → Angular: `models/` + `data/` + `PortfolioService` facade + `AsyncData<T>`.
2. **Centralised SEO builder** — `app/lib/seo/meta.ts` (`buildMeta`: title,
   description, canonical, OG + Twitter, `og:locale`, default share image,
   JSON-LD helpers) with unit tests. No meta literals in components.
   → Angular: `SeoService` with identical input contract (§16).
3. **Design tokens as single source of truth** — `app/styles/tokens.css`:
   color / 4px spacing / type scale / semantic sizes / **motion tokens**
   (`--ease-out`, `--duration-fast/base/slow`) + a **global
   `prefers-reduced-motion` kill-switch**. Rule "no hardcoded values in
   components" is adopted verbatim.
4. **Self-hosted fonts with latin + latin-ext subsets** — `fonts.css` declares
   separate `@font-face` rules per subset (a documented bug: one rule with two
   files drops Polish glyphs ą ć ę ł ń ś ź ż into fallback). Mandatory for PL.
5. **Skeleton/loading + error + not-found states** as first-class components
   (`CaseStudySkeleton`, `WorkIndexSkeleton`, `CaseStudyNotFound`, error page).
6. **Strict TS + ESLint + Prettier + Vitest-equivalent baseline**, canonical-URL
   handling (`server/canonical.test.ts`), `/healthz` pattern, Docker layering
   discipline (irrelevant on Vercel, but the "slim production artifact" mindset
   carries over to bundle budgets).

### 2.3 Replace

| Headstack element | Replacement in new project | Why |
|---|---|---|
| React 19 + React Router 7 + Express SSR | Angular standalone + Router + **prerendered SSG** | Required target stack; v1 has no backend to justify a Node server |
| Django/DRF + Postgres data source | `StaticDataProvider` (local typed data) behind a provider interface | No backend in v1; swappable later |
| Server-validated contact form (Zod + RHF) | `mailto:`/social contact section, no form submission | A form that POSTs nowhere is dishonest UX and dead code |
| Docker + nginx edge proxy | Vercel static output (`angular.json` prerender) | Target platform; zero server to containerise |
| Dark `#080808` + lime `#B8FF3D` studio theme | New light minimalist identity (§7) | Must not clone Headstack's look (Rule 3) |

### 2.4 Remove (do not carry over)

- Entire `backend/` (Django), `server/` + `server.js` (Express SSR),
  `docker-compose*`, `deploy/`, Postgres/Redis, admin, auth, inquiry API.
- React-only deps: `react`, `react-dom`, `react-router`, `react-hook-form`,
  `@hookform/resolvers` (replaced by Angular equivalents or nothing).
- Blog system (`blog`, `blog-slug` routes) — Jzulaika has no blog; no speculative CMS.
- Team/case-study machinery (`zespol`, multi-section case-study stack) — a
  one-person portfolio needs project detail pages, not agency case studies.

### 2.5 Refactor (structural lessons — problems to NOT repeat)

1. **Dual-tree residue (`app/` SSR-era + `src/` legacy client) with 9-path alias
   maze** (`@`, `@/lib`, `@/src`, `@app`…). New project: **one `src/app` tree**,
   default `@angular/*` paths, at most one `@app/*` alias if needed.
2. **Types re-exported from a server module** (`src/types/*.ts` re-export from
   `@/lib/api/server`) — pragmatic under SSR pressure, but fragile. New project:
   `models/` are hand-owned, provider-agnostic interfaces from day one (§12).
3. **Static `content/*.ts` duplicating backend shapes** without a shared contract —
   caused drift risk. New project: static data files are typed **as** the model
   interfaces, so the compiler enforces the contract.

### 2.6 Risks inherited if we are careless

- **Framework mismatch:** zero Headstack UI code is reusable; any "reuse" attempt
  (e.g. porting CSS class-for-class) drags the dark/lime identity along.
  Mitigation: reuse *contracts and disciplines* (§2.2), never markup.
- **SSR habit:** Headstack defaults to a Node server. On Vercel v1 that means
  cost, cold starts and failure modes for zero benefit. Mitigation: SSG (§16).
- **Over-abstraction habit:** providers/contexts per entity + alias maze.
  Mitigation: one facade service, signals, no store (Rule 6, §8).
- **Polish-glyph font bug class:** any font pipeline must ship latin-ext and be
  verified with `ą ć ę ł ń ś ź ż` (§7, §25).

---

## 3. Jzulaika analysis (inventory of https://www.jzulaika.com/)

Fetched and inspected 2026-10-04 (HTTP 200, ~43 KB HTML). The current site is
itself an **Angular 17.3.1 app, SSG-prerendered** (`ng-server-context="ssg"`),
derived from the Start Bootstrap **"Stylish Portfolio"** theme (Bootstrap 5.3.3,
`simple-line-icons`, `devicons`, sidebar + `page-top` anchor pattern). It is a
**single-page anchor site** — no sub-routes; portfolio links (`/ortopedia`,
`/cars`, `/portfolio`) exist in markup but the IA is one scrolling page.

### 3.1 Page/section inventory (complete — nothing omitted)

| # | Section (anchor) | Content |
|---|---|---|
| 1 | Header nav (fixed sidebar toggle) | Links: Home, About, Skills, Portfolio, Contact |
| 2 | Hero (`#page-top`) | "Hi, I'm Julen Zulaika", role line "Full Stack Developer", portrait photo, scroll cue |
| 3 | About (`#about`) | Heading "I have always loved tech"; 2 bio paragraphs (Spain; two official diplomas — Web application development + multiplatform application development; part-time web dev while studying; internship + relocation to Kraków; now established in Poland, seeking growth); **CV button** (Google Drive link) |
| 4 | Skills (`#skills`, `#habilidades`) | Intro line + **12 skills**: HTML5, CSS3, JavaScript, Angular, TypeScript, Angular Material (Frontend/Framework); PHP, Python (Backend); Tailwind CSS, Sass (Frontend); Git (SCM Tool); SQL (Database) |
| 5 | Portfolio (`#portfolio`) | Heading + "Click to view my projects!"; **4 projects**: (a) To-Do List App — "Modern To-Do web app for tracking everyday tasks" — Angular, Angular Material, ASP.NET, SQL Server; (b) Choreographer Personal Website — "Elegant site to promote choreographer services" — Angular, Tailwind CSS, ASP.NET, SCSS; (c) Car Store — "Simple to manage car store" — Angular, JavaScript, HTML, CSS; (d) Job Portal Site — "Using Vue, JavaScript, CSS and HTML" — Vue, JavaScript, HTML, CSS; each with thumbnail image |
| 6 | Contact (`#contact`, `#contacto`) | "Let's get in touch!", email `julenz485@gmail.com` (mailto), LinkedIn + GitHub icon links |
| 7 | Footer | "Julen Zulaika - 2024", back-to-top button |
| 8 | Legal pages | **None exist.** No privacy policy, no terms. (New: minimal privacy note in footer, §13 — no trackers, so a full policy page is optional; decide in Phase 0.) |

### 3.2 Branding elements found (source of truth — preserved, not rebranded)

- **Name/wordmark:** "Julen Zulaika" text (no custom logo file observed; favicon.ico only). → New: refined text wordmark "JZ / Julen Zulaika", keep favicon concept.
- **Accent teal `#1D809F`** (Stylish Portfolio primary) + warm gradient-text accents
  sampled from markup: `#ca4246 → #e16541 → #f18f43` with highlight `#ecb807`;
  base neutrals `#212529 / #343a40 / #6c757d`, off-white `#fffeea`, `#f8f9fa`.
- **Typography:** Bootstrap system stack (no custom webfont observed). → New: pair a
  distinctive display serif/grotesque with a neutral body face (§7); this is a
  *refresh within identity*, not a rebrand — teal + warm gradient accents stay.
- **Imagery:** portrait photo, 4 project thumbnails. → Must be re-sourced/
  re-optimised (WebP/AVIF, responsive sizes); ["needs verification" — exact
  image licenses/dimensions to confirm in Phase 0 from site owner].
- **Copy:** all English; ["needs verification" — no PL version exists; Polish
  translations must be commissioned/provided in Phase 6, not machine-guessed].
- **No animations of note** beyond theme smooth-scroll; responsive via Bootstrap
  grid; single social pair (LinkedIn, GitHub).

### 3.3 Gaps the rebuild fixes (content/UX, not branding)

Single-page anchor IA (weak SEO — one URL for everything); no project detail
pages; no PL; no meta/OG pipeline visible; 2024-stale footer; Bootstrap +
3 third-party CSS CDNs (blocking, heavy); thumbnails unoptimised; no reduced-motion,
skip-link, or landmark discipline observable.

---

## 4. Requirements (locked for v1)

- **F1** Pages: Home (hero, about teaser, skills, featured portfolio, contact
  teaser), About, Portfolio index, Project detail (×4), Contact. Legal: footer
  privacy note (full page only if trackers added — none planned).
- **F2** PL + EN from day one: `/pl/...`, `/en/...`, runtime switcher, per-lang
  SEO (§14).
- **F3** Contact via `mailto:`, `tel:` (if owner provides number), LinkedIn,
  GitHub, CV download link. No form submission.
- **F4** All content typed via models; zero copy in components (§9).
- **N1** Prerendered SSG on Vercel; LCP ≤ 2.5 s, CLS < 0.1, INP < 200 ms on 4G
  Moto-G-class; Lighthouse ≥ 90 all categories (§17).
- **N2** WCAG 2.2 AA (§18). **N3** Medium animation, reduced-motion safe (§15).
- **C1** No backend/CMS/auth/database in v1; architecture must accept them later
  (§20). **C2** No unnecessary deps/state libs (Rule 6; §22 allows exactly 2 runtime packages).

---

## 5. New information architecture

URL strategy: **language-prefixed routes** (`/pl/...`, `/en/...`), bare `/`
301-redirects to the preferred language (§14). Single-page anchors are
**abolished** — every major block becomes a crawlable URL.

```text
/                       → 301 to /pl or /en (detection, §14)
/pl                     Home        /en            Home
/pl/o-mnie              About       /en/about      About
/pl/portfolio           Portfolio   /en/portfolio  Portfolio
/pl/portfolio/:slug     Project     /en/portfolio/:slug  Project
/pl/kontakt             Contact     /en/contact    Contact
/**                     404 (per language)
```

Localized slugs (`o-mnie`/`about`, `kontakt`/`contact`) read native and give
clean per-language SERP titles; the slug *dictionary* lives in one
`routes.i18n.ts` map so hreflang/canonical generation is mechanical. Project
slugs stay language-neutral (`todo-list-app`, …) — they are identifiers, and
one URL per project avoids duplicate-content splits.

### 5.1 Page specifications

**Home (`/pl`, `/en`)** — purpose: 10-second comprehension (who / what / proof /
next step). Target: recruiter or client skimming. Sections: Hero (name, role,
portrait, 2 CTAs: view portfolio + get in touch), About teaser (2–3 lines +
link), Skills strip (grouped, 12 items), Featured projects (3 cards + "view
all"), Contact teaser (email + socials). Content: `profile`, `skills`,
`projects`. Desktop: 2-col hero, 3-col grids; mobile: stacked, portrait first,
sticky bottom CTA bar with mail + portfolio links (§"mobile" per component).

**About** — purpose: trust/background for shortlist decisions. Full bio (current
2 paragraphs, lightly edited), education timeline (2 diplomas), Kraków note, CV
download, portrait. Reuses `SectionHeader`, `Timeline`, `CtaBlock`.

**Portfolio index** — purpose: scannability of all 4 projects. Filter chips by
technology (Angular / Vue / ASP.NET — derived from data, not hardcoded),
`ProjectGrid` of `ProjectCard`s (thumbnail, title, one-liner, tech tags).
Empty-filter state included ("no projects with X" + reset).

**Project detail (`:slug`)** — purpose: depth for the 1–2 interested visitors.
Sections: masthead (title, one-liner, year, role), tech stack list, description
(2–4 paragraphs — ["needs verification": current copy is one line per project;
owner must supply or approve extended copy]), gallery (thumbnails + any new
screenshots), prev/next project nav, CTA to contact. Unknown slug → localized
404 with search-less "back to portfolio" (no dead ends).

**Contact** — purpose: zero-friction outreach. Big email CTA (`mailto:` with
prefilled subject per language), copy-email button with "copied" feedback,
LinkedIn/GitHub cards, CV link, availability note. **No `<form>` element** —
a form that cannot submit is a broken promise; if a backend lands later, §20
adds a real form then.

**Chrome:** `Header` (wordmark, desktop nav, `LanguageSwitcher`, mobile burger →
full-screen `MobileMenu` with staggered link entrance, focus trap, ESC close),
`Footer` (nav, socials, language note, © with dynamic year, privacy note,
back-to-top). 404 per language with home + portfolio links.

---

## 6. UX/UI specification

Minimalist + elegant = **restraint with intent**: generous whitespace,
typography-led hierarchy, one accent used sparingly, hairline borders instead of
boxes, imagery given room. Anti-goals: SaaS gradients-everywhere, card soup,
template grids, icon decoration without meaning.

### 6.1 Typography

- **Display:** Fraunces (serif, 300–600, optical sizing) for H1/H2/hero —
  premium editorial voice, clearly not a SaaS template. **Body/UI:** Inter
  (400/500/600). **Mono accents** (eyebrows, labels, meta): JetBrains Mono or
  system mono. ["needs verification": final license/self-host check in Phase 0;
  fallback pairing Sora + Inter if Fraunces rejected by owner].
- Scale (fluid `clamp`): hero `clamp(2.5rem, 6vw, 4.75rem)/1.05/-0.03em`;
  H1 `clamp(2rem, 4.5vw, 3.25rem)`; H2 `clamp(1.5rem, 3vw, 2.25rem)`;
  H3 `1.25–1.5rem`; body `1rem/1.65`; lead `1.125rem/1.7`; eyebrow mono
  `0.75rem/uppercase/0.14em`. Mobile: hero floor 2.5rem, section titles −1 step,
  body stays 1rem (never below 0.9375rem), line-length ≤ 65ch.
- Hierarchy rule: one display face per viewport (hero OR section title, never
  competing); eyebrows label every section for skimmability.

### 6.2 Colors (light-first, teal-anchored to current brand)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF7` warm paper | page background |
| `--surface` | `#FFFFFF` | cards, menu overlay |
| `--ink` | `#161A1D` | primary text |
| `--muted` | `#5C6570` (≥4.5:1 on paper) | secondary text |
| `--line` | `rgba(22,26,29,.1)` | hairlines, borders |
| `--teal` | `#1D809F` (brand, from current site) | links, active states, key accents |
| `--teal-deep` | `#14667E` | hover, text-on-light AA |
| `--ember` | `#E16541` (brand gradient family) | sparing: CTA fill, active markers |
| `--gold` | `#ECB807` | sparing: highlights, availability dot |
| Dark section | `#101415` bg / `#F2F4F3` text | footer + contact finale contrast |

Warm gradient (teal → ember → gold) is reserved for **two** moments: hero name
treatment and the contact finale — everywhere else, flat color. Dark mode: not
in v1 (light identity is the brand statement; no OS-following half-theme).

### 6.3 Layout

Container `min(1120px, 100% − 3rem)`, narrow `720px` (bio, detail body);
section rhythm `clamp(4.5rem, 9vw, 8.5rem)`; 12-col grid ≥1024px, 2-col
≥640px, 1-col below; breakpoints `640 / 1024 / 1440`; mobile-first CSS
(min-width queries only), touch targets ≥ 44px.

---

## 7. Design system

Single source of truth: `src/styles/_tokens.scss` (CSS custom properties;
SCSS only for mixins — no hardcoded values in components, per Headstack §2.2.3
discipline). Tokens: colors (§6.2), 4px spacing scale, type scale (§6.1),
radii (`10px` cards / `999px` pills), shadows (one soft `0 20px 50px
rgba(22,26,29,.08)`, used sparingly), motion tokens
(`--ease-out: cubic-bezier(.16,1,.3,1)`; `--dur-fast:150ms/base:240ms/slow:450ms`)
plus a **global `prefers-reduced-motion` kill-switch** copied as a concept from
Headstack. Fonts **self-hosted** (`/fonts/*.woff2`, separate latin + latin-ext
`@font-face` rules — the Headstack-documented Polish-glyph pitfall), `display:
swap`, preloaded (2 files max). Images: AVIF/WebP + JPEG fallback,
`srcset` widths, `loading="lazy"` below fold, explicit dimensions (CLS), every
image with meaningful `alt` in both languages (part of translation files).

---

## 8. Angular architecture

- **Standalone components + `ApplicationConfig`-based bootstrap**, `OnPush`
  change detection everywhere, `input()`/`output()` signal APIs, `inject()`
  instead of constructor injection, `@for/@if` control flow.
- **State: signals only.** `PortfolioService` exposes `signal`/`computed` views
  (`projects()`, `featured()`, `skillsGrouped()`); async represented as
  `AsyncData<T> = { status: 'loading'|'ok'|'error'; data?; error? }` (Headstack
  `AsyncState` pattern, §2.2.1). **No NgRx/ngxs/store of any kind** — there is
  no client state that justifies it (filter selection and language live in the
  router + a tiny `LanguageService`).
- **Routing:** lazy `loadComponent` per page; language-param layout route
  (`:lang` guard validates `pl|en`, sets `LanguageService`, `TranslateService`
  language, `<html lang>`, SEO defaults); `Title` + `SeoService` per route via
  resolver data; `ScrollService` (top on navigation, fragment support).
- **Forms:** none in v1 (no backend) — when the backend lands, Reactive Forms +
  built-in + custom validators (§20). **HTTP:** `HttpClient` only inside the
  future `ApiProvider`; static v1 needs no HTTP at all (translations load via
  `TranslateHttpLoader` — the single justified `HttpClient` use).
- **Error/loading:** per-section skeleton components (Headstack §2.2.5 habit),
  localized error + 404 views, global `ErrorHandler` that logs (console v1,
  endpoint later) without breaking prerender.

## 9. Project structure

```text
src/
  app/
    core/            LanguageService, SeoService, ScrollService, guards, interceptors(future)
    shared/          Header, Footer, MobileMenu, SectionHeader, CtaBlock, RevealDirective, pipes
    features/
      home/          HomePage + Hero, SkillsStrip, FeaturedWork, ContactTeaser
      about/         AboutPage + Timeline
      portfolio/     PortfolioPage + ProjectGrid/Card/FilterChips
      project/       ProjectDetailPage + ProjectGallery, prev/next nav
      contact/       ContactPage + CopyEmailButton
      not-found/     NotFoundView
    data/            *.pl.ts / *.en.ts static sets (profile, skills, projects, navigation, contact, meta)
    models/          profile, skill, project, navigation, contact, seo, api (provider-agnostic)
    services/        PortfolioService (facade) + providers (StaticDataProvider now, ApiProvider later)
    i18n/            pl.json / en.json (UI chrome only) + routes.i18n.ts slug dictionary
    app.config.ts  app.routes.ts
  assets/fonts|images  styles/(_tokens, base, utilities)
```

`core` = singletons; `shared` = dumb reusable UI; `features/` = routed pages and
their private sections; `data/` is the **only** place with copy; `services/`
the **only** path components use to reach it. `environments/` holds
`siteUrl`, `defaultLang`, future `apiBaseUrl` (empty in v1 so no code can
accidentally call a backend).

## 10. Components (contract summary)

Page components are thin orchestrators: read `:lang`/`:slug` from the router,
select data from `PortfolioService`, set SEO via `SeoService`, compose
presentational children. Presentational components take typed `input()`s
(`project: Project`, `items: Skill[]`), emit `output()`s (filter change,
menu close), never import from `data/`. `RevealDirective`
(`[appReveal]`, `IntersectionObserver`, once, staggered via `--reveal-delay`)
is the **only** animation primitive. Mobile deltas: `MobileMenu` replaces nav
< 1024px (full-screen overlay, focus trap, staggered links); hero stacks with
portrait first; grids 3→1 col; sticky bottom CTA bar (Home/Contact only);
galleries become swipeable scroll-snaps; hover-only affordances get tap
equivalents.

## 11. Routing (see map in §5)

`:lang` parent (guard `langGuard`) → lazy page children; data: `{ page: 'home'
| 'about' | … }` drives SEO + nav highlighting. Redirects: `/` → detection (§14);
unknown lang → `/en` + 404-safe; unknown slug → localized 404. Prerender list
= all langs × all pages × all project slugs (mechanical from `data/`).

## 12. Data models (provider-agnostic, owned by frontend)

```ts
Profile { name, role: LocalText, location, bio: LocalText, portrait, cvUrl, email, socials: SocialLink[] }
Skill { id, name, category: 'frontend'|'framework'|'backend'|'styling'|'tooling'|'database', level?: 1..3 }
Project { slug, title, tagline: LocalText, description: LocalText, tech: string[], year, role: LocalText, thumbnail, images: ProjectImage[], links: { live?, repo? }, featured: boolean }
Navigation { items: { key, label: LocalText, path: Record<Lang,'…'> }[] }
Contact { email, phone?: string, socials, availability: LocalText, cvUrl }
SeoMeta { title, description, canonical, ogImage, locale, noindex? }  // mirrors Headstack SeoInput
type LocalText = { pl: string; en: string }; type Lang = 'pl' | 'en';
```

`LocalText` (not ngx-translate keys) for authorial content keeps translators in
plain TS and lets a future CMS return `{pl,en}` objects unchanged.

## 13. Data-access architecture (Rule 4 — the load-bearing section)

```text
Component → PortfolioService (facade: signals + AsyncData) → DataProvider (interface) → StaticDataProvider (v1: imports data/*.ts) → later: ApiProvider (HttpClient → CMS/REST)
```

`DataProvider` interface (`getProfile/lang`, `getSkills`, `getProjects`,
`getProjectBySlug`, `getNavigation`, `getContact`) is the **seam**: components
depend only on the facade, the facade only on the `DATA_PROVIDER` injection
token. Backend swap = write `ApiProvider implements DataProvider`, flip one
`useClass` line in `app.config.ts`. Rules: no `fetch`/`HttpClient` outside
providers; no `data/` imports outside providers; loading/error shapes identical
for static and API (skeletons keep working); tech-filter chips derived from
`projects[].tech` (new CMS entries appear automatically). Verified by a
contract test: every `DataProvider` implementation must satisfy the same spec
(§19) — the UI-rewrite risk is a test failure, not a surprise.

## 14. Internationalization

- **Strategy `/pl` + `/en`** (chosen over subdomains — unnecessary operational
  cost for 2 languages — and over query params — unindexable, unshareable).
  Default: `pl` (owner lives/works in Poland; primary market) — ["needs
  verification": confirm with owner].
- **Detection:** bare `/` reads `Accept-Language` at edge (Vercel rewrite or
  tiny middleware; static fallback → `/pl`) + persisted choice (`localStorage`)
  wins on return visits. In-app `LanguageSwitcher` navigates to the same page in
  the other language (slug dictionary lookup), never to home.
- **Content split:** UI chrome → `i18n/pl.json|en.json` via **ngx-translate**
  (lazy-loaded, missing-key handler fails loudly in dev); authorial content →
  `LocalText` in `data/` (no translation keys for prose — translators edit TS,
  CMS-ready). `<html lang>` synced per route.
- **Why ngx-translate over `@angular/localize`:** localize needs one build per
  locale (× build minutes, × prerender complexity, language switch = full reload
  to a different deployment); ngx-translate gives runtime switching, one build,
  one deployment — decisive for a 2-language static site. Rejected alternative
  documented; if the site ever needs localize-grade ICU pluralization at scale,
  revisit (unlikely for portfolio copy).
- **Multilingual SEO:** `hreflang` (`pl`, `en`, `x-default`) + canonical per
  URL, per-lang `og:locale` (`pl_PL`/`en_US`), translated titles/descriptions/
  alts from `data/*.lang.ts`, per-lang `sitemap.xml` entries (§16).

---

## 15. Animation architecture (medium level — restraint is the spec)

**Decision: no GSAP, no animation library.** All planned motion (reveals,
transitions, hovers, menu, micro-interactions, subtle parallax) is achievable
with CSS transitions + one IntersectionObserver directive at ~0 KB JS cost.
GSAP (~60 KB + wrapper) is justified for scrubbed storytelling, physics, or
orchestrated timelines — none exist here; adopting it would be popularity-driven
bloat. Revisit only if a future case-study page needs scroll-scrubbed visuals.

| Animation | Trigger | Behaviour / duration / easing | Mobile | a11y |
|---|---|---|---|---|
| Scroll reveal (sections, cards) | `RevealDirective`, once, 12% visible | fade + 16px rise, 450ms `--ease-out`, `--reveal-delay` stagger ≤ 6 items | same, stagger ≤ 3, no rise on low-end (`matchMedia` data-saver guard) | `prefers-reduced-motion` → visible instantly |
| Hero entrance | route activation | eyebrow → name → role → CTAs, 3 staggered 500ms fades; portrait soft scale 1.04→1 | no scale, fades only | skipped under reduced motion |
| Header state | scroll > 24px | backdrop blur + hairline border, 240ms | same | n/a (opacity only) |
| Mobile menu | burger toggle | overlay fade 200ms + links stagger 40ms; ESC/backdrop close, focus trap, focus restore | — (mobile-only) | focus managed; reduced-motion → no stagger |
| Hover/tap | pointer | cards: thumbnail scale 1.03 + title teal shift 240ms; buttons: fill sweep 200ms | tap = same end-state via `:active`; no hover-dependent info | `:focus-visible` mirrors every hover |
| Gallery | click/swipe | crossfade 300ms; swipe = native scroll-snap, no JS lib | scroll-snap primary | arrows keyboard-operable, `aria-roledescription="carousel"` |
| Subtle parallax | `requestAnimationFrame` scroll, hero portrait only | translate ≤ 24px, passive listener, rAF-throttled | **disabled** < 1024px (jank + battery) | disabled under reduced motion |
| Page transitions | navigation | none orchestrated — instant swap + scroll-top (SSG multi-URL site; fake transitions hurt perceived speed) | same | n/a |

Global kill-switch: `@media (prefers-reduced-motion: reduce) { *,*::before,
*::after { animation-duration:.01ms !important; transition-duration:.01ms
!important; }` + directive short-circuit (Headstack pattern, §2.2.3).

## 16. SEO (SSR is NOT needed — prerender is the answer)

**Decision: Angular application-builder prerender (SSG), evaluated against CSR
and SSR.** CSR alone is rejected: single-URL crawl risk, empty meta for
sharers, and the old site's anchor-IA proved weak indexing. Full SSR is
rejected for v1: it needs a Node server on Vercel (cost, cold starts, failure
modes) with zero dynamic data to serve. Prerender gives crawler-ready HTML per
URL (§11 list), instant FCP, and static hosting — re-evaluate SSR only when a
backend makes content genuinely dynamic (§20).

- Per route via `SeoService.build(meta: SeoMeta)` (Headstack `SeoInput`
  contract, §2.2.2): unique `<title>` (≤60 ch, `Page · Julen Zulaika` pattern,
  project pages include tech), meta description (140–160 ch, translated),
  canonical, `robots`, OG (`title/description/url/type/site_name/image
  1200×630/image:alt/locale`) + Twitter `summary_large_image`, default share
  image `/og-default.png` (branded, must exist — blank cards are the Headstack-
  documented failure), `theme-color`.
- Semantic HTML: one `h1` per page, ordered sections with `h2`, landmarks
  (`header/main/nav/footer`), skip-link, descriptive link text (never "click
  here"), translated `alt` on all images.
- `sitemap.xml` (all langs + slugs, generated at build from `data/`),
  `robots.txt` (allow + sitemap pointer), JSON-LD `Person` (name, jobTitle,
  address Kraków, sameAs LinkedIn/GitHub) on Home/About + `CreativeWork` per
  project. `hreflang`/`x-default` on every URL (§14).
- Prerender verification (§25): every planned URL fetched from the static
  output must contain its title, description, canonical and JSON-LD — a page
  missing meta fails the build gate, not QA.

## 17. Performance (budgets are gates, not wishes)

- Images: AVIF/WebP + fallback, responsive `srcset`, hero portrait
  `fetchpriority="high"` + preload, everything else lazy; explicit w/h (CLS).
- Fonts: 2 preloaded woff2 (latin + latin-ext), `swap`, self-hosted (no Google
  Fonts runtime request).
- JS: route-level code splitting (lazy pages), **2 runtime packages total** (§22),
  no icon library (inline SVG: LinkedIn, GitHub, mail, copy, burger, arrow —
  ~2 KB), `RevealDirective` tree-shaken to one file.
- Zero third-party scripts in v1 (ex-Bootstrap CDNs eliminated); CV stays a
  plain Drive/asset link. Caching: immutable hashed assets (1y), HTML
  `stale-while-revalidate` via `vercel.json`, fonts immutable.
- **Budgets (enforced `budgets` in `angular.json`, fail the build):**
  initial ≤ 180 KB gz, per lazy route ≤ 60 KB gz; targets LCP ≤ 2.5 s /
  CLS < 0.1 / INP < 200 ms (Moto G, 4G), Lighthouse ≥ 90 ×4, measured per
  language (latin-ext tables shift layout differently).

## 18. Accessibility (target: WCAG 2.2 AA, audited not assumed)

Semantic landmarks + skip-link + one-h1 order; full keyboard operability
(menu trap/ESC, gallery arrows, chips as real buttons with `aria-pressed`,
copy-button `aria-live="polite"` confirmation); visible `:focus-visible` rings
on all interactives; contrast AA verified (muted `#5C6570` on `#FAFAF7`;
teal `#14667E` for body-size links); ARIA only where native falls short
(menu `aria-expanded`, carousel roles); translated alts + `lang` sync;
reduced-motion kill-switch (§15); accessible `LanguageSwitcher` (real
`<a hreflang>` links, current language `aria-current`, full name "Polski /
English" — never flags). Audit: axe on every page ×2 languages + manual
keyboard walkthrough + 200%-zoom reflow check (§19, §25 gate).

## 19. Vercel deployment

- `vercel.json`: build `ng build` (application builder, prerender on),
  output `dist/<app>/browser`; `/` → language detection rewrite (§14);
  `/pl|/en` clean URLs (no trailing-slash duplicates — pick one, redirect the
  other); security headers (`nosniff`, `frame-ancestors 'none'`,
  `referrer-policy`); hashed-asset immutability; preview deployments per PR,
  production on `main`, custom domain + per-lang canonical host consistency.
- Env: `SITE_URL`, `DEFAULT_LANG` (+ future `API_BASE_URL`, empty in v1);
  no secrets in v1. No serverless functions in v1 (forms arrive with backend).
- Pipeline gate: typecheck + lint + unit/contract tests + production build +
  **prerender-meta check** (§16) + Lighthouse CI on preview (2 langs).

## 20. Future backend / CMS integration (no code now — boundaries only)

| Layer | Owns | v1 | Later |
|---|---|---|---|
| Presentation (components) | rendering, interaction | ✅ | untouched |
| `PortfolioService` facade | signals, `AsyncData` shapes | ✅ | untouched |
| `DataProvider` seam | interface + DI token | ✅ interface | add `ApiProvider` |
| `StaticDataProvider` | local `data/*.ts` | ✅ | deleted or kept as offline fallback |
| Backend (future) | persistence, validation, email | — | CMS/REST returning model-shaped JSON incl. `{pl,en}` |

Contact form arrives *with* the backend (Reactive Forms + POST → `ApiProvider`
+ success/error states already shaped like Headstack's inquiry flow); projects/
services/testimonials become CMS collections mapped 1:1 onto existing models;
analytics (privacy-friendly, cookieless) is the only sanctioned pre-backend
addition and must not block rendering. Rule: **no component rewrite** — a
backend PR touches `services/providers/` + `app.config.ts` (+ new form UI),
nothing else; the contract test (§13) proves it.

## 21. Testing strategy (lean — no infrastructure theatre)

- **Unit (Vitest-equivalent: Karma/Jasmine or Jest — decide in Phase 0 by
  Angular-version default):** `SeoService` meta builder (port Headstack
  `meta.test.ts` cases), slug dictionary round-trips, filter derivation,
  `mailto:` link builders.
- **Contract:** every `DataProvider` impl satisfies the same spec — missing
  project, unknown slug, both languages complete, no empty required fields.
  This test *is* the Rule-4 guarantee.
- **Component:** `ProjectCard`, `FilterChips`, `MobileMenu` (open/close/focus),
  `CopyEmailButton` feedback, `RevealDirective` (mocked IO).
- **E2E (Playwright, smoke only):** home→portfolio→detail→contact per language,
  language switch preserves page, 404 pages, copy-email, menu on 390px.
- **Responsive/a11y/visual:** 390/768/1280 matrix; axe per page ×2 langs;
  reduced-motion run; Playwright screenshot diff for hero + portfolio grid only
  (full-page screenshotting 10 URLs is noise — two high-risk views suffice).
- No mutation testing, no coverage thresholds as gates (small codebase; review
  enforces meaningful assertions).

## 22. Dependencies (proposed — 2 runtime packages, zero bloat)

| Package | Purpose | Why / alternative rejected |
|---|---|---|
| `@ngx-translate/core` | runtime PL/EN switching, pipe/directive/service | `@angular/localize` needs per-locale builds + reload-switch (§14) |
| `@ngx-translate/http-loader` | lazy-loads `i18n/*.json` via HttpClient | bundling both languages inline wastes bytes on first load |

Toolchain (not runtime bloat): Angular latest stable (≥ v20, pinned at Phase 0),
TypeScript strict, SCSS, ESLint + Prettier, Playwright, axe-core. Sitemap +
`robots.txt` come from a zero-dependency build script (`scripts/sitemap.mjs`)
reading `data/` — hand-maintained sitemaps rot, a runtime dep for this would be
absurd.

Explicitly **not** included: GSAP/framer (§15), NgRx (§8), UI kit/Bootstrap
(custom CSS ~15 KB replaces ~200 KB of theme), icon library (inline SVG, §17),
form libraries (no forms in v1), date/object utilities (no use case), analytics
SDK (deferred to §20). Each future addition must earn a row in this table:
purpose, why needed, alternative rejected.

## 23. Implementation phases

| Phase | Objective → key tasks → acceptance → risks |
|---|---|
| **0 — Repo prep & verification** | init Angular standalone/SCSS/strict, ESLint/Prettier, budgets, `vercel.json`, CI skeleton; close every ["needs verification"] (fonts license, PL copy source, images/CV, default lang, privacy-note scope, test-runner default) | `ng build` + lint green; verification log signed off | unverified brand/copy assumptions leaking into build |
| **1 — Design tokens & base styles** | `_tokens.scss`, fonts (latin-ext check with ąćęłńśźż), base/typography/utilities, reduced-motion switch | token-only demo page matches §6–7; no component values hardcoded | glyph fallback bug (Headstack §2.2.4) |
| **2 — Data layer** | `models/`, `data/*.pl|en.ts` (EN from live site; PL commissioned), `DataProvider` + `StaticDataProvider` + `PortfolioService`, contract spec test | contract test green; components still untouched (none exist) | thin project copy — owner must approve extended text |
| **3 — Layout chrome** | `SkipLink/Header/MobileMenu/Footer/LanguageSwitcher/BackToTop`, `:lang` routing + guard + 404s | keyboard + 390px menu verified; language switch preserves page | focus-trap edge cases |
| **4 — Pages** | Home → About → Portfolio → Detail → Contact (in that order; each with `SeoService` meta) | per-page checklist (§5.1 + meta present in prerender) | scope creep into blog/case-study machinery |
| **5 — i18n completion** | JSON chrome copy, `LocalText` audit (zero hardcoded strings — grep gate), hreflang/canonical, `html lang` | full PL + EN walkthrough, both sitemaps | machine-guessed Polish — must be human-supplied |
| **6 — Motion** | `RevealDirective`, menu/hero/hover/gallery, parallax (desktop only), reduced-motion pass | §15 table verified row-by-row incl. mobile-disabled items | jank on low-end — keep rAF discipline |
| **7 — SEO + perf + a11y hardening** | JSON-LD, OG image, sitemap/robots, image pipeline, budgets, axe + keyboard + zoom audit | §25 numeric gates met | OG/social preview surprises — check real sharers |
| **8 — Testing + Vercel** | unit/contract/component/E2E (§21), preview deploys, domain, headers, detection rewrite | green pipeline + preview Lighthouse ≥ 90 | detection-rewrite redirect loops |
| **9 — Release** | final copy freeze, footer year dynamic, owner walkthrough PL+EN × mobile/desktop, tag v1.0 | **Definition of Done (§24)** all green | last-minute copy edits bypassing i18n files |

## 24. Risks (top 5 + mitigations)

1. **PL copy quality** — no Polish source exists; machine translation would
   embarrass a Poland-based developer. Mitigation: owner-supplied or professional
   PL before Phase 5; build fails a "translation completeness" lint otherwise.
2. **Thin project content** — one-liners can't fill detail pages. Mitigation:
   owner interview in Phase 2; ship detail pages with honest compact scope rather
   than padded lorem.
3. **Image rights/quality** — portrait + 4 thumbnails need licensing and
   high-res originals for AVIF/srcset. Mitigation: Phase-0 asset inventory.
4. **Framework-version drift** — Angular releases move fast; pin major at Phase 0,
   record in README, revisit only for LTS/security.
5. **Scope creep toward agency site** (blog, CMS now, SSR now) — each violates a
   numbered rule (§4). Mitigation: every new request cites its rule; deferrals
   go to a guarded §20 backlog, not the build.

---

## 25. Definition of Done (all must hold — no partial credit)

- Desktop (1280+), tablet (768), mobile (390): layout per §6.3, no horizontal
  scroll, 44px targets, menu/gallery/CTA behaviours per §10/§15.
- PL + EN: every URL in both languages, zero hardcoded UI strings (grep gate),
  switch preserves page, `html lang` + hreflang + per-lang meta/sitemap correct.
- Prerender: all §11 URLs emit static HTML containing title, description,
  canonical, JSON-LD (build-gate script).
- Accessibility: axe clean per page ×2 langs, keyboard-only walkthrough passes,
  contrast AA, reduced-motion verified, 200% zoom reflows.
- Performance: budgets enforced (§17), Lighthouse ≥ 90 ×4 on preview (both
  langs), LCP/CLS/INP targets met.
- Motion: §15 table verified incl. mobile-disabled and reduced-motion rows.
- Data seam: `ApiProvider` stub (unregistered, test-only) satisfies the contract
  test — proving Rule 4 without building the backend.
- Vercel: production deploy green, previews per PR, headers/redirects verified,
  no backend env required.
- Docs: README (setup, scripts, structure map, adding a project/language,
  backend-swap recipe) + this plan marked implemented.

---

*End of plan. STOP — do not implement. Await further instructions.*

### 6.4 Reusable component catalogue (only what earns its existence)

`Header, MobileMenu, Footer, LanguageSwitcher, Hero, SectionHeader, CtaBlock,
SkillGroup/SkillBadge, ProjectCard, ProjectGrid, FilterChips, ProjectGallery,
Timeline, CopyEmailButton, RevealDirective, BackToTop, SkipLink, NotFoundView`.
Each: typed `@Input`s, `OnPush`, presentational except routed page components.
No generic `Card`/`Button`/`Modal` primitives — buttons are two CSS classes
(`.btn-primary/.btn-ghost`); inventing a component library for 5 pages is
over-engineering (Rule 6).
