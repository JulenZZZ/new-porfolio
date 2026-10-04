import { Routes } from '@angular/router';
import { langGuard } from './core/lang.guard';

/**
 * Language-prefixed routing (plan §5, §11). `:lang` parent validated by
 * langGuard; every page lazy-loads its standalone component. Localized slugs
 * (o-mnie/about, kontakt/contact) map to the same page; project slugs stay
 * language-neutral. Bare / falls back to /pl (static fallback; edge
 * detection rewrites to the preferred language per §14).
 *
 * Frozen page contracts (owned by features/ — do not rename):
 * HomePage, AboutPage, PortfolioPage, ProjectDetailPage, ContactPage,
 * NotFoundView.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pl' },
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
        data: { page: 'home' },
      },
      {
        path: 'o-mnie',
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
        data: { page: 'about' },
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPage),
        data: { page: 'about' },
      },
      {
        path: 'portfolio',
        loadComponent: () =>
          import('./features/portfolio/portfolio-page').then((m) => m.PortfolioPage),
        data: { page: 'portfolio' },
      },
      {
        path: 'portfolio/:slug',
        loadComponent: () =>
          import('./features/project/project-detail-page').then((m) => m.ProjectDetailPage),
        data: { page: 'project' },
      },
      {
        path: 'kontakt',
        loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
        data: { page: 'contact' },
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact-page').then((m) => m.ContactPage),
        data: { page: 'contact' },
      },
      {
        path: '**',
        loadComponent: () =>
          import('./features/not-found/not-found-view').then((m) => m.NotFoundView),
        data: { page: 'not-found' },
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found-view').then((m) => m.NotFoundView),
    data: { page: 'not-found' },
  },
];
