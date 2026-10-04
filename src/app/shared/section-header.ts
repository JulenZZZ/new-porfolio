import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Section heading: mono eyebrow + display title + optional lead (plan §6.1). */
@Component({
  selector: 'app-section-header',
  template: `
    <div class="section-header" [class.section-header--center]="center()">
      @if (eyebrow()) {
        <span class="eyebrow">{{ eyebrow() }}</span>
      }
      <h2 class="section-header__title">{{ title() }}</h2>
      @if (lead()) {
        <p class="section-header__lead">{{ lead() }}</p>
      }
    </div>
  `,
  styles: `
    .section-header {
      max-width: var(--container-narrow);
      margin-block-end: var(--space-10);
    }

    .section-header--center {
      margin-inline: auto;
      text-align: center;

      .section-header__lead {
        margin-inline: auto;
      }
    }

    .eyebrow {
      margin-block-end: var(--space-3);
    }

    .section-header__lead {
      margin-block-start: var(--space-4);
      font-size: var(--text-lead);
      line-height: var(--leading-lead);
      color: var(--muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeader {
  readonly eyebrow = input<string>();
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly center = input(false);
}
