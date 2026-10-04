import { TestBed } from '@angular/core/testing';
import { DataProvider } from './data-provider';
import { StaticDataProvider } from './static-data-provider';
import { PortfolioService } from './portfolio.service';
import { Lang, LANGS } from '../models/lang';
import { Skill, SkillCategory } from '../models/skill';
import { Profile } from '../models/profile';
import { Project } from '../models/project';
import { Navigation } from '../models/navigation';
import { Contact } from '../models/contact';
import { SiteMeta } from '../models/seo';
import { UiCopy } from '../models/ui-copy';

/**
 * Contract spec (plan §13/§19, Rule 4 guarantee): EVERY `DataProvider`
 * implementation must satisfy this spec. When `ApiProvider` arrives, register
 * it here with one line — `describeDataProviderContract(() => new
 * ApiProvider(...))` — and the UI-rewrite risk becomes a test failure.
 */
export function describeDataProviderContract(name: string, create: () => DataProvider): void {
  describe(`DataProvider contract: ${name}`, () => {
    let provider: DataProvider;

    beforeEach(() => {
      provider = create();
    });

    for (const lang of LANGS) {
      describe(`language '${lang}'`, () => {
        it('provides a complete profile with no empty required fields', () => {
          const profile = provider.getProfile(lang);
          expectNonEmpty(profile.name, 'profile.name');
          expectNonEmpty(profile.role[lang], 'profile.role');
          expectNonEmpty(profile.bio[lang], 'profile.bio');
          expectNonEmpty(profile.location, 'profile.location');
          expectNonEmpty(profile.portrait, 'profile.portrait');
          expectNonEmpty(profile.portraitAlt[lang], 'profile.portraitAlt');
          expectNonEmpty(profile.cvUrl, 'profile.cvUrl');
          expectNonEmpty(profile.email, 'profile.email');
          expect(profile.email).toContain('@');
          expect(profile.socials.length).toBeGreaterThan(0);
          for (const social of profile.socials) {
            expectNonEmpty(social.label, 'social.label');
            expectNonEmpty(social.href, 'social.href');
          }
        });

        it('provides exactly the 12 skills with unique ids and valid categories', () => {
          const skills = provider.getSkills(lang);
          expect(skills.length).toBe(12);
          const ids = skills.map((skill) => skill.id);
          expect(new Set(ids).size).toBe(ids.length);
          const valid: readonly SkillCategory[] = [
            'frontend',
            'framework',
            'backend',
            'styling',
            'tooling',
            'database',
          ];
          for (const skill of skills) {
            expectNonEmpty(skill.id, 'skill.id');
            expectNonEmpty(skill.name, 'skill.name');
            expect(valid).toContain(skill.category);
          }
        });

        it('provides exactly the 4 projects with no empty required fields', () => {
          const projects = provider.getProjects(lang);
          expect(projects.length).toBe(4);
          const slugs = projects.map((project) => project.slug);
          expect(new Set(slugs).size).toBe(slugs.length);
          for (const project of projects) {
            expectNonEmpty(project.slug, 'project.slug');
            expectNonEmpty(project.title, 'project.title');
            expectNonEmpty(project.tagline[lang], `project[${project.slug}].tagline`);
            expectNonEmpty(project.description[lang], `project[${project.slug}].description`);
            expect(project.tech.length).toBeGreaterThan(0);
            for (const tech of project.tech) expectNonEmpty(tech, 'project.tech[]');
            expect(project.year).toBeGreaterThan(2000);
            expectNonEmpty(project.role[lang], `project[${project.slug}].role`);
            expectNonEmpty(project.thumbnail, `project[${project.slug}].thumbnail`);
            expectNonEmpty(project.thumbnailAlt[lang], `project[${project.slug}].thumbnailAlt`);
            expect(project.images.length).toBeGreaterThan(0);
            for (const image of project.images) {
              expectNonEmpty(image.src, 'project.image.src');
              expectNonEmpty(image.alt[lang], 'project.image.alt');
            }
          }
        });

        it('resolves every known slug and undefined for an unknown slug', () => {
          for (const project of provider.getProjects(lang)) {
            const found = provider.getProjectBySlug(lang, project.slug);
            expect(found).toBeDefined();
            expect(found?.slug).toBe(project.slug);
          }
          expect(provider.getProjectBySlug(lang, 'no-such-project')).toBeUndefined();
          expect(provider.getProjectBySlug(lang, '')).toBeUndefined();
        });

        it('provides navigation with localised non-empty paths', () => {
          const navigation = provider.getNavigation(lang);
          expect(navigation.items.length).toBeGreaterThanOrEqual(4);
          for (const item of navigation.items) {
            expectNonEmpty(item.key, 'nav.key');
            expectNonEmpty(item.label[lang], `nav[${item.key}].label`);
            expectNonEmpty(item.path[lang], `nav[${item.key}].path`);
            expect(item.path[lang].startsWith('/')).toBeTrue();
            expect(item.path[lang]).not.toContain('#');
            if (item.fragment !== undefined) {
              expectNonEmpty(item.fragment, `nav[${item.key}].fragment`);
            }
          }
          const skills = navigation.items.find((item) => item.key === 'skills');
          expect(skills?.fragment).toBe('skills');
        });

        it('provides contact with email, socials, availability and CV link', () => {
          const contact = provider.getContact(lang);
          expectNonEmpty(contact.email, 'contact.email');
          expect(contact.email).toContain('@');
          expect(contact.socials.length).toBeGreaterThan(0);
          expectNonEmpty(contact.availability[lang], 'contact.availability');
          expectNonEmpty(contact.cvUrl, 'contact.cvUrl');
        });

        it('provides site meta with title, description, image and locale', () => {
          const meta = provider.getSiteMeta(lang);
          expectNonEmpty(meta.title, 'meta.title');
          expect(meta.title.length).toBeLessThanOrEqual(70);
          expectNonEmpty(meta.description, 'meta.description');
          expectNonEmpty(meta.ogImage, 'meta.ogImage');
          expectNonEmpty(meta.locale, 'meta.locale');
        });

        it('provides complete page-chrome copy with no empty strings', () => {
          const copy = provider.getUiCopy(lang);
          expectNonEmpty(copy.home.eyebrow, 'copy.home.eyebrow');
          expectNonEmpty(copy.home.heroLead, 'copy.home.heroLead');
          expectNonEmpty(copy.about.title, 'copy.about.title');
          expectNonEmpty(copy.about.para1, 'copy.about.para1');
          expectNonEmpty(copy.portfolio.title, 'copy.portfolio.title');
          expect(copy.portfolio.results(1).length).toBeGreaterThan(0);
          expect(copy.portfolio.results(5).length).toBeGreaterThan(0);
          expectNonEmpty(copy.project.back, 'copy.project.back');
          expectNonEmpty(copy.project.notFoundTitle, 'copy.project.notFoundTitle');
          expectNonEmpty(copy.contact.title, 'copy.contact.title');
          expectNonEmpty(copy.contact.mailSubject, 'copy.contact.mailSubject');
          expectNonEmpty(copy.notFound.title, 'copy.notFound.title');
          for (const key of Object.keys(copy.home.categoryNames)) {
            expectNonEmpty(copy.home.categoryNames[key], `categoryNames.${key}`);
          }
        });
      });
    }

    it('keeps slugs language-neutral across PL and EN', () => {
      const plSlugs = provider
        .getProjects('pl')
        .map((project) => project.slug)
        .sort();
      const enSlugs = provider
        .getProjects('en')
        .map((project) => project.slug)
        .sort();
      expect(plSlugs).toEqual(enSlugs);
    });

    it('marks exactly 3 projects as featured (Home selection)', () => {
      for (const lang of LANGS) {
        const featured = provider.getProjects(lang).filter((project) => project.featured);
        expect(featured.length).toBe(3);
      }
    });
  });
}

function expectNonEmpty(value: string, field: string): void {
  expect(typeof value).toBe('string');
  expect(value.trim().length).toBeGreaterThan(0, `expected non-empty ${field}`);
}

describeDataProviderContract('StaticDataProvider', () => new StaticDataProvider());

/**
 * Test-only second implementation (plan §25 DoD): proves the Rule-4 seam —
 * a future `ApiProvider` satisfies the same contract without touching the UI.
 * Delegates to static data the way an HTTP-backed provider would delegate to
 * fetched payloads; registered here, never in `app.config.ts`.
 */
class TestApiProvider implements DataProvider {
  private readonly upstream = new StaticDataProvider();

  getProfile(lang: Lang): Profile {
    return structuredClone(this.upstream.getProfile(lang));
  }

  getSkills(lang: Lang): Skill[] {
    return structuredClone(this.upstream.getSkills(lang));
  }

  getProjects(lang: Lang): Project[] {
    return structuredClone(this.upstream.getProjects(lang));
  }

  getProjectBySlug(lang: Lang, slug: string): Project | undefined {
    const found = this.upstream.getProjectBySlug(lang, slug);
    return found === undefined ? undefined : structuredClone(found);
  }

  getNavigation(lang: Lang): Navigation {
    return structuredClone(this.upstream.getNavigation(lang));
  }

  getContact(lang: Lang): Contact {
    return structuredClone(this.upstream.getContact(lang));
  }

  getSiteMeta(lang: Lang): SiteMeta {
    return structuredClone(this.upstream.getSiteMeta(lang));
  }

  getUiCopy(lang: Lang): UiCopy {
    const copy = this.upstream.getUiCopy(lang);
    return { ...copy, portfolio: { ...copy.portfolio } };
  }
}

describeDataProviderContract('TestApiProvider (unregistered stub)', () => new TestApiProvider());

describe('PortfolioService (signals facade)', () => {
  let service: PortfolioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioService);
  });

  it('defaults to the PL language', () => {
    expect(service.currentLang()).toBe('pl');
  });

  it('exposes projects/featured/skillsGrouped as ok AsyncData signals', () => {
    const projects = service.projects();
    expect(projects.status).toBe('ok');
    expect(projects.data?.length).toBe(4);

    const featured = service.featured();
    expect(featured.status).toBe('ok');
    expect(featured.data?.length).toBe(3);

    const grouped = service.skillsGrouped();
    expect(grouped.status).toBe('ok');
    const total = grouped.data?.reduce((sum, group) => sum + group.items.length, 0);
    expect(total).toBe(12);
  });

  it('switches language and returns undefined data for an unknown slug', () => {
    service.setLang('en' as Lang);
    expect(service.currentLang()).toBe('en');
    expect(service.profile().data?.role.en).toContain('Developer');
    expect(service.projectBySlug('no-such-project')().data).toBeUndefined();
    expect(service.projectBySlug('todo-list-app')().data?.slug).toBe('todo-list-app');
  });

  it('derives tech-filter chips from project data', () => {
    const tech = service.allTech();
    expect(tech.status).toBe('ok');
    expect(tech.data).toContain('Angular');
    expect(tech.data).toContain('Vue');
  });
});
