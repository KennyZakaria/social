import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AyantsDroitService } from '../services/ayants-droit.service';
import { DecesService } from '../services/deces.service';
import { AyantDroitResponse, DossierDecesResponse } from '../../../core/models/models';

@Component({
  selector: 'app-ayants-droit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ayants-droit.component.html',
  styleUrl: './ayants-droit.component.scss'
})
export class AyantsDroitComponent implements OnInit {
  dossierId!: number;
  dossier: DossierDecesResponse | null = null;
  ayants: AyantDroitResponse[] = [];
  loading = false;
  formOpen = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;
  modeRepartition: 'POURCENTAGE' | 'CHARIA' = 'POURCENTAGE';
  successMsg = '';
  errorMsg = '';
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    nom:           ['', Validators.required],
    prenom:        ['', Validators.required],
    cin:           ['', Validators.required],
    lienParente:   ['', Validators.required],
    dateNaissance: [''],
    telephone:     [''],
    adresse:       [''],
    pourcentage:   [null as number | null],
  });

  get totalPct(): number {
    return this.ayants.reduce((s, a) => s + (a.pourcentage ?? 0), 0);
  }

  constructor(
    private readonly svc: AyantsDroitService,
    private readonly decesSvc: DecesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dossierId = Number(this.route.snapshot.paramMap.get('id'));
    this.decesSvc.findById(this.dossierId).subscribe({ next: d => this.dossier = d });
    this.loadAyants();
  }

  openNew(): void { this.editingId = null; this.form.reset(); this.formOpen = true; }
  closeForm(): void { this.formOpen = false; this.editingId = null; this.form.reset(); }

  startEdit(a: AyantDroitResponse): void {
    this.editingId = a.id;
    this.form.patchValue({ nom: a.nom, prenom: a.prenom, cin: a.cin, lienParente: a.lienParente, dateNaissance: a.dateNaissance ?? '', telephone: a.telephone ?? '', adresse: a.adresse ?? '', pourcentage: a.pourcentage ?? null });
    this.formOpen = true;
  }

  saveAyant(): void {
    const raw = this.form.getRawValue();
    const payload = {
      nom: raw.nom, prenom: raw.prenom, cin: raw.cin, lienParente: raw.lienParente,
      dateNaissance: raw.dateNaissance || undefined,
      telephone: raw.telephone || undefined,
      adresse: raw.adresse || undefined,
      typeRepartition: this.modeRepartition,
      pourcentage: this.modeRepartition === 'POURCENTAGE' ? raw.pourcentage ?? undefined : undefined,
    } as any;

    const obs = this.editingId
      ? this.svc.update(this.dossierId, this.editingId, payload)
      : this.svc.create(this.dossierId, payload);

    obs.subscribe({
      next: () => { this.closeForm(); this.loadAyants(); this.show(this.editingId ? 'Ayant droit mis à jour.' : 'Ayant droit ajouté.'); },
      error: (e: any) => this.showErr(e?.error?.message || 'Erreur lors de l\'enregistrement.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(this.dossierId, id).subscribe({
      next: () => { this.confirmDeleteId = null; this.loadAyants(); this.show('Ayant droit supprimé.'); },
      error: (e: any) => { this.confirmDeleteId = null; this.showErr(e?.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  private loadAyants(): void {
    this.loading = true;
    this.svc.list(this.dossierId).subscribe({ next: d => { this.ayants = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
  private show(m: string) { this.successMsg = m; setTimeout(() => this.successMsg = '', 4000); }
  private showErr(m: string) { this.errorMsg = m; setTimeout(() => this.errorMsg = '', 5000); }
}
