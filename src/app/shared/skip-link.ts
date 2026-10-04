import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Skip-link — first focusable element, jumps to main content (plan §16, §18). */
@Component({
  selector: 'app-skip-link',
  imports: [TranslatePipe],
  template: `<a class="skip-link" href="#main-content">{{ 'skipLink' | translate }}</a>`,
  styles: `
    .skip-link {
      position: absolute;
      top: var(--space-2);
      left: var(--space-2);
      z-index: calc(var(--z-menu) + 10);
      padding: var(--space-3) var(--space-4);
      background: var(--ink);
      color: #fff;
      border-radius: var(--radius-card);
      font-weight: 600;
      text-decoration: none;
      transform: translateY(-300%);
      transition: transform var(--dur-fast) var(--ease-out);
    }

    .skip-link:focus-visible {
      transform: none;
      outline: var(--focus-ring);
      outline-offset: var(--focus-offset);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLink {}
