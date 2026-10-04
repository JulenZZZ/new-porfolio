import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { App } from './app';

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

describe('App shell', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([{ path: '**', component: DummyComponent }]),
        { provide: TranslateService, useClass: TranslateStub },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('creates the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders skip-link, header, main landmark and footer', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-skip-link a[href="#main-content"]')).toBeTruthy();
    expect(el.querySelector('app-site-header .wordmark')).toBeTruthy();
    const main = el.querySelector('main#main-content');
    expect(main).toBeTruthy();
    expect(main?.querySelector('router-outlet')).toBeTruthy();
    expect(el.querySelector('app-site-footer')).toBeTruthy();
  });
});
