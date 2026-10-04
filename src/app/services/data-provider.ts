import { InjectionToken } from '@angular/core';
import { Lang } from '../models/lang';
import { Profile } from '../models/profile';
import { Skill } from '../models/skill';
import { Project } from '../models/project';
import { Navigation } from '../models/navigation';
import { Contact } from '../models/contact';
import { SiteMeta } from '../models/seo';
import { UiCopy } from '../models/ui-copy';
import { StaticDataProvider } from './static-data-provider';

/**
 * The seam of the data layer (plan §13, Rule 4): components depend only on
 * the `PortfolioService` facade, the facade only on this interface.
 *
 * Getters are synchronous in v1 (static data). A future `ApiProvider`
 * resolves remotely-fetched data before returning (e.g. behind a route
 * resolver or a cached preload) so the sync contract — and every consumer —
 * stays untouched. Backend swap = `ApiProvider implements DataProvider` +
 * one `useClass` line in `app.config.ts`.
 *
 * Rules: no `fetch`/`HttpClient` outside providers; no `data/` imports
 * outside providers.
 */
export interface DataProvider {
  getProfile(lang: Lang): Profile;
  getSkills(lang: Lang): Skill[];
  getProjects(lang: Lang): Project[];
  /** Returns `undefined` for an unknown slug (localized 404 path). */
  getProjectBySlug(lang: Lang, slug: string): Project | undefined;
  getNavigation(lang: Lang): Navigation;
  getContact(lang: Lang): Contact;
  getSiteMeta(lang: Lang): SiteMeta;
  getUiCopy(lang: Lang): UiCopy;
}

/**
 * DI token for the active `DataProvider`. Defaults to the static provider
 * so the app runs with zero backend; override with `useClass`/`useFactory`
 * in `app.config.ts` when the API arrives.
 *
 * NOTE: `StaticDataProvider` is imported here (type + factory) while it
 * imports only the *type* from this module, so there is no runtime cycle.
 */
export const DATA_PROVIDER = new InjectionToken<DataProvider>('DATA_PROVIDER', {
  providedIn: 'root',
  factory: () => new StaticDataProvider(),
});
