import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MobileMenu } from './mobile-menu';

class TranslateStub {
  translate(key: string | string[]) {
    return signal(Array.isArray(key) ? key.join(',') : key);
  }
  addLangs(): void {}
  use(): unknown {
    return of({});
  }
  getBrowserLang(): string {
    return 'en';
  }
}

@Component({ template: '' })
class DummyComponent {}

describe('MobileMenu', () => {
  let fixture: ComponentFixture<MobileMenu>;

  async function setup(open: boolean): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [MobileMenu],
      providers: [
        provideRouter([{ path: '**', component: DummyComponent }]),
        { provide: TranslateService, useClass: TranslateStub },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MobileMenu);
    fixture.componentRef.setInput('open', open);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('renders nothing when closed', async () => {
    await setup(false);
    expect(fixture.nativeElement.querySelector('.menu-overlay')).toBeNull();
  });

  it('renders the overlay with data-driven localized links when open', async () => {
    await setup(true);
    const links = [...fixture.nativeElement.querySelectorAll('.menu-link')] as HTMLAnchorElement[];
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/pl',
      '/pl/o-mnie',
      '/pl',
      '/pl/portfolio',
      '/pl/kontakt',
    ]);
    const texts = links.map((a) => a.textContent.trim());
    expect(texts).toEqual(['Strona główna', 'O mnie', 'Umiejętności', 'Portfolio', 'Kontakt']);
  });

  it('focuses the close button on open (focus trap entry)', async () => {
    await setup(true);
    expect(document.activeElement?.classList.contains('menu-close')).toBeTrue();
  });

  it('emits closed on ESC', async () => {
    await setup(true);
    let emitted = 0;
    fixture.componentInstance.closed.subscribe(() => emitted++);
    const panel = fixture.nativeElement.querySelector('.menu-panel') as HTMLElement;
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(emitted).toBe(1);
  });

  it('emits closed on backdrop click but not on panel click', async () => {
    await setup(true);
    let emitted = 0;
    fixture.componentInstance.closed.subscribe(() => emitted++);
    const overlay = fixture.nativeElement.querySelector('.menu-overlay') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.menu-panel') as HTMLElement;
    panel.click();
    expect(emitted).toBe(0);
    // Backdrop = the overlay element itself as event target.
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toBe(1);
  });
});
