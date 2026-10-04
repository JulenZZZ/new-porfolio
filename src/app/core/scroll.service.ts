import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Scroll restoration: top on navigation, fragment support (plan §8). */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.zone.runOutsideAngular(() => {
          const fragment = this.router.parseUrl(this.router.url).fragment;
          if (fragment !== null && fragment !== undefined && fragment !== '') {
            this.scrollToFragment(fragment);
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          }
        });
      });
  }

  scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToFragment(fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById(fragment);
    if (target !== null) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }
}
