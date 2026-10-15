// src/app/shared/project-grid.ts
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../models/project';
import { textIn, Lang } from '../models/lang';
// 1. Importa el componente PlaceholderArt
import { PlaceholderArt } from './placeholder-art';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  // 2. Añádelo a la lista de imports de este componente
  imports: [RouterLink, PlaceholderArt], 
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="project-grid">
      <!-- src/app/shared/project-grid.ts -->

      @for (project of projects(); track project.slug) {
        <article class="project-card">
          <!-- 1. La imagen DEBE ir primero si quieres que quede arriba -->
          <a [routerLink]="[hrefPrefix(), project.slug]" class="project-card__link">
            <app-placeholder-art
              [src]="project.thumbnail"
              [alt]="textIn(lang(), project.thumbnailAlt)"
              monogram="JZ"
              ratio="16 / 10"
            />
          </a>

          <!-- 2. El texto va después -->
          <div class="project-card__content">
            <h3>{{ project.title }}</h3>
            <p>{{ textIn(lang(), project.tagline) }}</p>
          </div>
        </article>
      }
    </div>
  `,
  styles: [`
    /* En los styles: [...] de project-grid.ts */

      :host {
        display: block;
        width: 100%;
      }

      .project-grid {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr; /* 1 columna en móviles */
        width: 100%;
      }

      /* En tablets y escritorios, forzar 2 o 3 columnas */
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

      .project-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 100%; /* Evita que la tarjeta se desborde */
        overflow: hidden;
      }

      .project-card__link {
        display: block;
        width: 100%;
        max-width: 100%;
        border-radius: var(--radius-card, 10px);
        overflow: hidden;
      }
  `]
})
export class ProjectGrid {
  readonly projects = input.required<Project[]>();
  readonly lang = input.required<Lang>();
  readonly hrefPrefix = input<string>('/portfolio');
  readonly priority = input<boolean>(false);

  protected readonly textIn = textIn;
}