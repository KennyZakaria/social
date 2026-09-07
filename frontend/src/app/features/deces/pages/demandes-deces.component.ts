import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';
import { DemandeDeces, DemandesDecesService } from '../services/demandes-deces.service';

@Component({
  selector: 'app-demandes-deces',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './demandes-deces.component.html',
  styleUrl: './demandes-deces.component.scss'
})
export class DemandesDecesComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  filteredDossiers: DossierDecesResponse[] = [];
  selectedDossier: DossierDecesResponse | null = null;
  dossierSearch = '';

  demandes: DemandeDeces[] = [];
  dossierId: number | null = null;
  typeDemande = '';
  description = '';
  loading = false;
  error = '';

  constructor(private deces: DecesService, private demandesSvc: DemandesDecesService) {}

  ngOnInit() {
    this.deces.findAll().subscribe({
      next: d => this.dossiers = d,
      error: () => this.error = 'Impossible de charger les dossiers.'
    });
  }

  onSearchDossier() {
    const term = this.dossierSearch.trim().toLowerCase();
    if (!term) { this.filteredDossiers = []; return; }
    this.filteredDossiers = this.dossiers.filter(d =>
      d.numero?.toLowerCase().includes(term) ||
      d.nomComplet?.toLowerCase().includes(term) ||
      d.matricule?.toLowerCase().includes(term)
    );
  }

  selectDossier(d: DossierDecesResponse) {
    this.selectedDossier = d;
    this.dossierId = d.id;
    this.dossierSearch = '';
    this.filteredDossiers = [];
    this.load();
  }

  clearDossier() {
    this.selectedDossier = null;
    this.dossierId = null;
    this.demandes = [];
    this.dossierSearch = '';
    this.filteredDossiers = [];
  }

  load() {
    if (!this.dossierId) { this.demandes = []; return; }
    this.loading = true;
    this.demandesSvc.list(this.dossierId).subscribe({
      next: d => { this.demandes = d; this.loading = false; },
      error: () => { this.error = 'Impossible de charger les demandes.'; this.loading = false; }
    });
  }

  create() {
    if (!this.dossierId) return;
    this.demandesSvc.create(this.dossierId, { typeDemande: this.typeDemande, description: this.description || undefined }).subscribe({
      next: () => { this.typeDemande = ''; this.description = ''; this.load(); },
      error: e => this.error = e?.error?.message || 'Création impossible.'
    });
  }

  remove(id: number) {
    if (!this.dossierId || !confirm("Supprimer cette demande ?")) return;
    this.demandesSvc.delete(this.dossierId, id).subscribe({
      next: () => this.load(),
      error: () => this.error = "Suppression impossible."
    });
  }

  setStatut(item: DemandeDeces, statut: string) {
    if (!this.dossierId) return;
    this.demandesSvc.updateStatut(this.dossierId, item.id, statut).subscribe({
      next: updated => item.statut = updated.statut,
      error: () => this.error = 'Mise à jour impossible.'
    });
  }
}