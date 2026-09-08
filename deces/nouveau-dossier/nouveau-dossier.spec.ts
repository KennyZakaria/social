import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauDossier } from './nouveau-dossier';

describe('NouveauDossier', () => {
  let component: NouveauDossier;
  let fixture: ComponentFixture<NouveauDossier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouveauDossier],
    }).compileComponents();

    fixture = TestBed.createComponent(NouveauDossier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
