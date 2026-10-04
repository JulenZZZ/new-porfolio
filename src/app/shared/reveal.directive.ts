import { Directive, ElementRef, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * The only animation primitive (plan §10, §15): IntersectionObserver reveal,
 * once, 12% visible, fade + 16px rise over --dur-slow. Stagger via
 * --reveal-delay (input milliseconds, ≤6 items desktop / ≤3 mobile).
 * prefers-reduced-motion → visible instantly (no observer).
 */
@Directive({
  selector: '[appReveal]',
})
export class RevealDirective {
  /** Stagger delay in milliseconds, applied as --reveal-delay. */
  readonly appRevealDelay = input(0);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    afterNextRender(() => this.setup());
  }

  private setup(): void {
    const el = this.host.nativeElement;
    const delay = this.appRevealDelay();
    if (delay > 0) {
      el.style.setProperty('--reveal-delay', `${delay}ms`);
    }
    if (!isPlatformBrowser(this.platformId)) {
      el.classList.add('is-revealed');
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.classList.add('reveal');
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
  }
}
