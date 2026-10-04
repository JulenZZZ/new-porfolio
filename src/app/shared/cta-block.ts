import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface CtaLink {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Call-to-action block: title + primary/secondary links (plan §5.1, §6.4).
 * `finale` variant renders the dark contact-finale section — one of the two
 * sanctioned gradient moments (§6.2).
 */
@Component({
  selector: 'app-cta-block',
  template: `
    <div class="cta" [class.cta--finale]="variant() === 'finale'">
      <h2 class="cta__title">
        @if (variant() === 'finale') {
          <span class="gradient-text">{{ title() }}</span>
        } @else {
          {{ title() }}
        }
      </h2>
      @if (text()) {
        <p class="cta__text">{{ text() }}</p>
      }
      <div class="cta__actions">
        <a
          class="btn-primary"
          [href]="primary().href"
          [attr.target]="primary().external ? '_blank' : null"
          [attr.rel]="primary().external ? 'noopener' : null"
        >
          {{ primary().label }}
        </a>
        @if (secondary()) {
          <a
            class="btn-ghost cta__secondary"
            [href]="secondary()?.href"
            [attr.target]="secondary()?.external ? '_blank' : null"
            [attr.rel]="secondary()?.external ? 'noopener' : null"
          >
            {{ secondary()?.label }}
          </a>
        }
      </div>
    </div>
  `,
  styles: `
    .cta {
      text-align: center;
      padding-block: var(--space-16);
    }

    .cta__text {
      margin: var(--space-4) auto 0;
      color: var(--muted);
      font-size: var(--text-lead);
      line-height: var(--leading-lead);
    }

    .cta__actions {
      margin-block-start: var(--space-8);
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
      justify-content: center;
    }

    .cta--finale {
      background: var(--dark-bg);
      color: var(--dark-ink);
      border-radius: var(--radius-card);
      padding: var(--space-16) var(--space-6);

      .cta__text {
        color: var(--dark-muted);
      }

      .cta__secondary {
        border-color: var(--dark-line);
        color: var(--dark-ink);

        &:hover {
          border-color: var(--teal);
          color: #fff;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBlock {
  readonly title = input.required<string>();
  readonly text = input<string>();
  readonly primary = input.required<CtaLink>();
  readonly secondary = input<CtaLink>();
  readonly variant = input<'default' | 'finale'>('default');
}
