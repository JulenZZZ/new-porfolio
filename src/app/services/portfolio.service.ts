import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { DATA_PROVIDER } from './data-provider';
import { Lang } from '../models/lang';
import { AsyncData, okData } from '../models/api';
import { Profile } from '../models/profile';
import { Skill, SkillGroup, SKILL_CATEGORY_ORDER } from '../models/skill';
import { Project } from '../models/project';
import { Navigation } from '../models/navigation';
import { Contact } from '../models/contact';
import { SiteMeta } from '../models/seo';
import { UiCopy } from '../models/ui-copy';
import { environment } from '../../environments/environment';

/**
 * Sole entry point for components to reach content (plan §9, §13).
 * Signal-based facade over the active `DataProvider`: every view is a
 * `Signal<AsyncData<T>>` so templates keep working unchanged when the
 * future `ApiProvider` introduces real loading/error states.
 *
 * Language lives here as a signal; the `:lang` route guard drives it via
 * `setLang`. No `HttpClient`, no `data/` imports.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly provider = inject(DATA_PROVIDER);
  private readonly lang = signal<Lang>(environment.defaultLang);

  /** Active language (driven by the `:lang` route). */
  readonly currentLang: Signal<Lang> = this.lang.asReadonly();

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  readonly profile: Signal<AsyncData<Profile>> = computed(() =>
    okData(this.provider.getProfile(this.lang())),
  );

  readonly skills: Signal<AsyncData<Skill[]>> = computed(() =>
    okData(this.provider.getSkills(this.lang())),
  );

  readonly projects: Signal<AsyncData<Project[]>> = computed(() =>
    okData(this.provider.getProjects(this.lang())),
  );

  /** Home "featured" selection (exactly the 3 `featured` projects in v1). */
  readonly featured: Signal<AsyncData<Project[]>> = computed(() => {
    const all = this.projects();
    if (all.status !== 'ok' || !all.data) return all;
    return okData(all.data.filter((project) => project.featured));
  });

  /** All skills grouped by category, in stable display order. */
  readonly skillsGrouped: Signal<AsyncData<SkillGroup[]>> = computed(() => {
    const all = this.skills();
    if (all.status !== 'ok' || !all.data) return { status: all.status, error: all.error };
    return okData(
      SKILL_CATEGORY_ORDER.map((category) => ({
        category,
        items: (all.data as Skill[]).filter((skill) => skill.category === category),
      })).filter((group) => group.items.length > 0),
    );
  });

  readonly navigation: Signal<AsyncData<Navigation>> = computed(() =>
    okData(this.provider.getNavigation(this.lang())),
  );

  readonly contact: Signal<AsyncData<Contact>> = computed(() =>
    okData(this.provider.getContact(this.lang())),
  );

  readonly siteMeta: Signal<AsyncData<SiteMeta>> = computed(() =>
    okData(this.provider.getSiteMeta(this.lang())),
  );

  /** Detail-page lookup; `data` is `undefined` for an unknown slug. */
  projectBySlug(slug: string): Signal<AsyncData<Project | undefined>> {
    return computed(() => okData(this.provider.getProjectBySlug(this.lang(), slug)));
  }

  /** Prev/next neighbours of a project in list order (detail nav). */
  neighborsOf(slug: string): { prev?: Project; next?: Project } {
    const list = this.provider.getProjects(this.lang());
    const i = list.findIndex((project) => project.slug === slug);
    if (i < 0) return {};
    return { prev: list[i - 1], next: list[i + 1] };
  }

  /** Page-chrome copy for the active language (no literals in components). */
  readonly uiCopy: Signal<AsyncData<UiCopy>> = computed(() =>
    okData(this.provider.getUiCopy(this.lang())),
  );

  /** Tech-filter chips derived from data (new entries appear automatically). */
  readonly allTech: Signal<AsyncData<string[]>> = computed(() => {
    const all = this.projects();
    if (all.status !== 'ok' || !all.data) return { status: all.status, error: all.error };
    const seen = new Set<string>();
    for (const project of all.data) for (const tech of project.tech) seen.add(tech);
    return okData([...seen].sort((a, b) => a.localeCompare(b)));
  });
}
