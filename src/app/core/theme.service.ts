// src/app/core/theme.service.ts
import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  readonly currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Sincronizar el atributo 'data-theme' en el documento cada vez que cambie el Signal
    effect(() => {
      const theme = this.currentTheme();
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('user-theme', theme);
      }
    });
  }

  toggleTheme(): void {
    this.currentTheme.update((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';

    const saved = localStorage.getItem('user-theme') as Theme;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    // Preferencia del sistema operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}