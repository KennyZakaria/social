import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiecesJustificatives } from './pieces-justificatives';

describe('PiecesJustificatives', () => {
  let component: PiecesJustificatives;
  let fixture: ComponentFixture<PiecesJustificatives>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiecesJustificatives],
    }).compileComponents();

    fixture = TestBed.createComponent(PiecesJustificatives);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
