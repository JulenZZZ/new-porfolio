import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { LanguageSwitcher } from './language-switcher';

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

describe('LanguageSwitcher', () => {
  let fixture: ComponentFixture<LanguageSwitcher>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [
        provideRouter([{ path: '**', component: DummyComponent }]),
        { provide: TranslateService, useClass: TranslateStub },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    await router.navigateByUrl('/pl/o-mnie');
    fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();
  });

  it('marks the current language with aria-current (no link)', () => {
    const current = fixture.nativeElement.querySelector('[aria-current="true"]') as HTMLElement;
    expect(current?.textContent).toContain('Polski');
  });

  it('renders a real <a hreflang> to the same page in English', () => {
    const link = fixture.nativeElement.querySelector('a[hreflang="en"]') as HTMLAnchorElement;
    expect(link?.getAttribute('href')).toBe('/en/about');
  });

  it('navigates to the same page without reload on click', async () => {
    const link = fixture.nativeElement.querySelector('a[hreflang="en"]') as HTMLAnchorElement;
    link.click();
    await fixture.whenStable();
    expect(router.url).toBe('/en/about');
  });
});
