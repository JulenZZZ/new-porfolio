import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Lang } from '../models/lang';
import { textIn } from '../models/lang';
import type { Project } from '../models/project';
import { PlaceholderArt } from './placeholder-art';
import { RevealDirective } from './reveal.directive';

/** Portfolio project card: thumbnail, title, one-liner, tech tags (plan §6.4). */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RevealDirective, PlaceholderArt],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="project-card" appReveal [appRevealDelay]="delay()">
      <a class="card-link" [href]="href()" [attr.aria-label]="project().title">
        <app-placeholder-art [alt]="alt()" monogram="JZ" ratio="16 / 10" />
        <h3>{{ project().title }}</h3>
        <p class="tagline">{{ tagline() }}</p>
        <ul class="tech-tags" aria-label="Technologies">
          @for (tech of project().tech; track tech) {
            <li>{{ tech }}</li>
          }
        </ul>
      </a>
    </article>
  `,
  styles: [
    `
      .project-card {
        border-top: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        padding-top: 1rem;
      }
      .card-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }
      .card-link h3 {
        margin: 1rem 0 0.25rem;
        font-size: 1.25rem;
        transition: color 240ms var(--ease-out, ease-out);
      }
      .card-link:hover h3,
      .card-link:focus-visible h3 {
        color: var(--teal, #1d809f);
      }
      .card-link:focus-visible {
        outline: 2px solid var(--teal, #1d809f);
        outline-offset: 4px;
      }
      .tagline {
        margin: 0 0 0.75rem;
        color: var(--muted, #5c6570);
      }
      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tech-tags li {
        font-size: 0.75rem;
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
        border-radius: 999px;
        padding: 0.25rem 0.625rem;
      }
    `,
  ],
})
export class ProjectCard {
  readonly project = input.required<Project>();
  readonly lang = input<Lang>('en');
  readonly href = input.required<string>();
  readonly delay = input<number>(0);
  protected tagline(): string {
    return textIn(this.lang(), this.project().tagline);
  }
  protected alt(): string {
    return textIn(this.lang(), this.project().thumbnailAlt);
  }
}
