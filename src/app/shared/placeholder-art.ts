import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Styled monogram placeholder used wherever a photo/thumbnail binary is
 *  missing (asset GAP — portrait + project thumbnails need owner originals).
 *  Correct aspect ratio, translated alt via role="img". */
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
      <span aria-hidden="true">{{ monogram() }}</span>
    </div>
  `,
  styles: [
    `
      .placeholder-art {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1d809f 0%, #e16541 70%, #ecb807 130%);
        color: #fff;
        border-radius: 10px;
        font-size: clamp(2rem, 6vw, 3.5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
      }
    `,
  ],
})
export class PlaceholderArt {
  readonly alt = input.required<string>();
  readonly monogram = input<string>('JZ');
  readonly ratio = input<string>('16 / 10');
}
