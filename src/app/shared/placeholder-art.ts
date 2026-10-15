import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

/**
 * Visual element that renders a real image when 'src' is provided,
 * or falls back to the styled monogram gradient if missing or on load error.
 */
@Component({
  selector: 'app-placeholder-art',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="placeholder-art"
      role="img"
      [attr.aria-label]="alt()"
      [style.aspect-ratio]="ratio()"
    >
      @if (src() && !hasError()) {
        <img
          [src]="src()"
          [alt]="alt()"
          [attr.loading]="priority() ? 'eager' : 'lazy'"
          [attr.fetchpriority]="priority() ? 'high' : 'auto'"
          class="placeholder-art__img"
          (error)="hasError.set(true)"
        />
      } @else {
        <span aria-hidden="true" class="monogram">{{ monogram() }}</span>
      }
    </div>
  `,
  styles: [
    `
      /* 1. Obliga al host del Web Component a actuar como bloque fluido */
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
      }

      /* 2. Marco contenedor que fija la proporción (ratio) y recorta el desborde */
      .placeholder-art {
        width: 100%;
        max-width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1d809f 0%, #e16541 70%, #ecb807 130%);
        color: #fff;
        border-radius: var(--radius-card, 10px);
        border: 1px solid var(--line, rgba(22, 26, 29, 0.1));
      }

      .monogram {
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        user-select: none;
      }

      /* 3. Posicionamiento absoluto para forzar a la imagen a adaptarse exactamente al marco */
      .placeholder-art__img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: cover !important; /* Fuerza el encuadre proporcional */
        object-position: center;
        display: block;
      }
    `,
  ],
})
export class PlaceholderArt {
  readonly src = input<string | undefined>(undefined);
  readonly alt = input.required<string>();
  readonly monogram = input<string>('JZ');
  readonly ratio = input<string>('16 / 10');
  readonly priority = input<boolean>(false);

  protected readonly hasError = signal(false);
}