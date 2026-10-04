import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Lang } from '../models/lang';
import type { Project } from '../models/project';
import { ProjectCard } from './project-card';

/** Responsive grid of project cards: 1 col → 2 col ≥640px → 3 col ≥1024px
 *  when `cols3` is set (plan §6.3). */
@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [ProjectCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-grid">
      @for (project of projects(); track project.slug; let i = $index) {
        <app-project-card
          [project]="project"
          [lang]="lang()"
          [href]="hrefFor(project.slug)"
          [delay]="delayFor(i)"
        />
      }
    </div>
  `,
  styles: [
    `
      .project-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
      }
      @media (min-width: 640px) {
        .project-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 1024px) {
        .project-grid.cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    `,
  ],
  host: { '[class.cols-3]': 'cols3()' },
})
export class ProjectGrid {
  readonly projects = input.required<Project[]>();
  readonly lang = input<Lang>('en');
  readonly hrefPrefix = input<string>('');
  readonly cols3 = input<boolean>(false);
  protected hrefFor(slug: string): string {
    return `${this.hrefPrefix()}/${slug}`;
  }
  /** Stagger capped at 3 steps (plan §15: stagger ≤ 3 outside home). */
  protected delayFor(i: number): number {
    return Math.min(i, 2) * 80;
  }
}
