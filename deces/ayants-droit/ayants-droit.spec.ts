import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyantsDroit } from './ayants-droit';

describe('AyantsDroit', () => {
  let component: AyantsDroit;
  let fixture: ComponentFixture<AyantsDroit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyantsDroit],
    }).compileComponents();

    fixture = TestBed.createComponent(AyantsDroit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
