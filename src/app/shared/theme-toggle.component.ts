// src/app/shared/theme-toggle.component.ts
import { Component, inject } from '@angular/core';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="theme-btn"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (themeService.currentTheme() === 'dark') {
        <span>☀️ Light</span>
      } @else {
        <span>🌙 Dark</span>
      }
    </button>
  `,
  styles: [
    `
        /* Ejemplo en un componente */
        .card {
        background-color: var(--bg-surface);
        border: 1px solid var(--border-color);
        color: var(--text-main);
        }

        .card-subtitle {
        color: var(--text-muted);
        }
      .theme-btn {
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-main);
        padding: 0.5rem 1rem;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 600;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .theme-btn:focus-visible {
        outline: 2px solid var(--accent-teal);
        outline-offset: 2px;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  protected readonly themeService = inject(ThemeService);
}