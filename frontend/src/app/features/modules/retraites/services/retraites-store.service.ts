import { Injectable } from '@angular/core';

export interface RetraiteDossier {
  id: number;
  reference: string;
  nom: string;
  matricule: string;
  situation: string;
  traite: boolean;
  statut: 'En cours' | 'Validé';
  miseAJour: string;
  cloture?: boolean;
  details?: {
    profile: Record<string, unknown>;
    family: unknown[];
    benefits: unknown[];
    requests: unknown[];
    history: unknown[];
    membership?: Record<string, unknown>;
  };
}

export interface RetraitesActivity { reference: string; nom: string; action: string; date: string; }

@Injectable({ providedIn: 'root' })
export class RetraitesStoreService {
  private readonly key = 'service-social-retraites-dossiers';
  private readonly historyKey = 'service-social-retraites-history';
  private readonly resetKey = 'service-social-retraites-reset-20260902';
  private readonly defaults: RetraiteDossier[] = [];

  constructor() {
    if (!localStorage.getItem(this.resetKey)) {
      localStorage.removeItem(this.key);
      localStorage.removeItem(this.historyKey);
      localStorage.setItem(this.resetKey, 'done');
    }
  }

  all(): RetraiteDossier[] { return this.read(); }
  get(id: number): RetraiteDossier | undefined { return this.read().find(dossier => dossier.id === id); }
  isClosed(dossier: RetraiteDossier): boolean { return dossier.cloture === true || dossier.statut === 'Validé'; }
  create(initial: Partial<Pick<RetraiteDossier, 'nom' | 'matricule' | 'situation'>> = {}): RetraiteDossier {
    const id = Date.now();
    const dossier: RetraiteDossier = { id, reference: `RET-${new Date().getFullYear()}-${String(id).slice(-4)}`, nom: initial.nom || 'Nouveau retraité', matricule: initial.matricule || '—', situation: initial.situation || 'À renseigner', traite: false, statut: 'En cours', miseAJour: new Date().toLocaleDateString('fr-FR') };
    this.write([dossier, ...this.read()]);
    this.record(dossier, 'Dossier créé');
    return dossier;
  }
  saveDetails(id: number, details: NonNullable<RetraiteDossier['details']>): void {
    const dossier = this.get(id);
    if (!dossier || dossier.traite || this.isClosed(dossier)) return;
    const profile = details.profile;
    const updated: RetraiteDossier = {
      ...dossier,
      nom: `${String(profile['prenom'] || '')} ${String(profile['nom'] || '')}`.trim() || dossier.nom,
      matricule: String(profile['matricule'] || dossier.matricule),
      situation: String(profile['situation'] || dossier.situation),
      details,
      miseAJour: new Date().toLocaleDateString('fr-FR')
    };
    this.write(this.read().map(item => item.id === id ? updated : item));
  }
  activities(): RetraitesActivity[] { const saved = localStorage.getItem(this.historyKey); return saved ? JSON.parse(saved) : []; }
  close(id: number): void {
    const dossier = this.get(id);
    if (!dossier || this.isClosed(dossier)) return;
    const updated = { ...dossier, traite: true, statut: 'Validé' as const, cloture: true, miseAJour: new Date().toLocaleDateString('fr-FR') };
    this.write(this.read().map(d => d.id === id ? updated : d));
    this.record(updated, 'Dossier clôturé');
  }
  private read(): RetraiteDossier[] {
    const saved = localStorage.getItem(this.key);
    const dossiers: Array<RetraiteDossier | (Omit<RetraiteDossier, 'statut'> & { statut: 'À traiter' })> = saved ? JSON.parse(saved) : this.defaults;
    return dossiers.map(dossier => ({
      ...dossier,
      statut: dossier.cloture ? 'Validé' : (dossier.statut === 'À traiter' ? 'En cours' : dossier.statut)
    }));
  }
  private write(rows: RetraiteDossier[]): void { localStorage.setItem(this.key, JSON.stringify(rows)); }
  private record(dossier: RetraiteDossier, action: string): void { const item: RetraitesActivity = { reference: dossier.reference, nom: dossier.nom, action, date: new Date().toLocaleString('fr-FR') }; localStorage.setItem(this.historyKey, JSON.stringify([item, ...this.activities()])); }
}
