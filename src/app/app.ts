import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollService } from './core/scroll.service';
import { SiteFooter } from './shared/site-footer';
import { SiteHeader } from './shared/site-header';
import { SkipLink } from './shared/skip-link';

/** Application shell: skip-link + header + routed main + footer. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter, SkipLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly scroll = inject(ScrollService);

  ngOnInit(): void {
    this.scroll.init();
  }
}
