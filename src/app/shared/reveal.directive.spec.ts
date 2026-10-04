import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [RevealDirective],
  template: `<p appReveal [appRevealDelay]="80">Witaj, świecie — ąćęłńśźż</p>`,
})
class HostComponent {}

describe('RevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('applies the stagger delay as --reveal-delay', () => {
    const el = fixture.debugElement.query(By.directive(RevealDirective))
      .nativeElement as HTMLElement;
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('80ms');
  });

  it('adds the reveal base class', () => {
    const el = fixture.debugElement.query(By.directive(RevealDirective))
      .nativeElement as HTMLElement;
    expect(el.classList.contains('reveal')).toBeTrue();
  });
});
