import { Injectable } from '@angular/core';
import type { DataProvider } from './data-provider';
import type { Lang } from '../models/lang';
import type { Profile } from '../models/profile';
import type { Skill } from '../models/skill';
import type { Project } from '../models/project';
import type { Navigation } from '../models/navigation';
import type { Contact } from '../models/contact';
import type { SiteMeta } from '../models/seo';
import { profilePl } from '../data/profile.pl';
import { profileEn } from '../data/profile.en';
import { skillsPl } from '../data/skills.pl';
import { skillsEn } from '../data/skills.en';
import { projectsPl } from '../data/projects.pl';
import { projectsEn } from '../data/projects.en';
import { navigationPl } from '../data/navigation.pl';
import { navigationEn } from '../data/navigation.en';
import { contactPl } from '../data/contact.pl';
import { contactEn } from '../data/contact.en';
import { metaPl } from '../data/meta.pl';
import { metaEn } from '../data/meta.en';
import type { UiCopy } from '../models/ui-copy';
import { uiCopyPl } from '../data/ui-copy.pl';
import { uiCopyEn } from '../data/ui-copy.en';

/**
 * v1 `DataProvider`: serves the typed static data sets in `src/app/data/`.
 * This is the ONLY module allowed to import from `data/`.
 * Uses no `HttpClient` and performs no I/O.
 */
@Injectable({ providedIn: 'root' })
export class StaticDataProvider implements DataProvider {
  getProfile(lang: Lang): Profile {
    return lang === 'pl' ? profilePl : profileEn;
  }

  getSkills(lang: Lang): Skill[] {
    return lang === 'pl' ? skillsPl : skillsEn;
  }

  getProjects(lang: Lang): Project[] {
    return lang === 'pl' ? projectsPl : projectsEn;
  }

  getProjectBySlug(lang: Lang, slug: string): Project | undefined {
    return this.getProjects(lang).find((project) => project.slug === slug);
  }

  getNavigation(lang: Lang): Navigation {
    return lang === 'pl' ? navigationPl : navigationEn;
  }

  getContact(lang: Lang): Contact {
    return lang === 'pl' ? contactPl : contactEn;
  }

  getSiteMeta(lang: Lang): SiteMeta {
    return lang === 'pl' ? metaPl : metaEn;
  }

  getUiCopy(lang: Lang): UiCopy {
    return lang === 'pl' ? uiCopyPl : uiCopyEn;
  }
}
