import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface DossierValidation {
  id: number;
  numero: string;
  adherent: string;
  matricule: string;
  dateDeces: string;
  dateDepot: string;
  piecesTotal: number;
  piecesValides: number;
  statut: string;
  observation: string;
}

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './validation.html',
  styleUrl: './validation.css'
})
export class Validation {

  recherche = '';
  statutFiltre = '';

  dossierSelectionne: DossierValidation | null = null;

  motif = '';


  dossiers: DossierValidation[] = [

    {
      id: 1,
      numero: 'DEC-2026-001',
      adherent: 'ALAMI Mohamed',
      matricule: '123456',
      dateDeces: '2026-07-28',
      dateDepot: '2026-08-01',
      piecesTotal: 5,
      piecesValides: 5,
      statut: 'À valider',
      observation: 'Dossier complet'
    },

    {
      id: 2,
      numero: 'DEC-2026-002',
      adherent: 'EL MANSOURI Ahmed',
      matricule: '234567',
      dateDeces: '2026-07-30',
      dateDepot: '2026-08-03',
      piecesTotal: 5,
      piecesValides: 4,
      statut: 'À valider',
      observation: 'Une pièce reste à vérifier'
    },

    {
      id: 3,
      numero: 'DEC-2026-003',
      adherent: 'BENALI Hassan',
      matricule: '345678',
      dateDeces: '2026-07-31',
      dateDepot: '2026-08-04',
      piecesTotal: 5,
      piecesValides: 3,
      statut: 'Retour pour complément',
      observation: 'Documents manquants'
    },

    {
      id: 4,
      numero: 'DEC-2026-004',
      adherent: 'AMRANI Youssef',
      matricule: '456789',
      dateDeces: '2026-08-02',
      dateDepot: '2026-08-07',
      piecesTotal: 5,
      piecesValides: 5,
      statut: 'À valider',
      observation: 'Dossier complet'
    }

  ];


  // ==============================
  // FILTER
  // ==============================

  get dossiersFiltres(): DossierValidation[] {

    const recherche =
      this.recherche
        .toLowerCase()
        .trim();

    return this.dossiers.filter(dossier => {

      const matchRecherche =
        !recherche ||

        dossier.numero
          .toLowerCase()
          .includes(recherche) ||

        dossier.adherent
          .toLowerCase()
          .includes(recherche) ||

        dossier.matricule
          .toLowerCase()
          .includes(recherche);


      const matchStatut =
        !this.statutFiltre ||
        dossier.statut === this.statutFiltre;


      return (
        matchRecherche &&
        matchStatut
      );

    });

  }


  // ==============================
  // STATISTICS
  // ==============================

  get total(): number {

    return this.dossiers.length;

  }


  get aValider(): number {

    return this.dossiers.filter(
      d => d.statut === 'À valider'
    ).length;

  }


  get complets(): number {

    return this.dossiers.filter(
      d => d.piecesValides === d.piecesTotal
    ).length;

  }


  get complement(): number {

    return this.dossiers.filter(
      d => d.statut === 'Retour pour complément'
    ).length;

  }


  // ==============================
  // OUVRIR DOSSIER
  // ==============================

  ouvrirDossier(
    dossier: DossierValidation
  ): void {

    this.dossierSelectionne = dossier;

    this.motif = '';

  }


  fermerDossier(): void {

    this.dossierSelectionne = null;

    this.motif = '';

  }


  // ==============================
  // VALIDATION
  // ==============================

  validerDossier(): void {

    if (!this.dossierSelectionne) {
      return;
    }

    const confirmation = confirm(
      `Voulez-vous valider le dossier ${this.dossierSelectionne.numero} ?`
    );

    if (!confirmation) {
      return;
    }

    this.dossierSelectionne.statut = 'Validé';

    this.dossierSelectionne.observation =
      'Dossier validé avec succès';

    alert(
      `Le dossier ${this.dossierSelectionne.numero} est validé.`
    );

    this.fermerDossier();

  }


  // ==============================
  // REJET
  // ==============================

  rejeterDossier(): void {

    if (!this.dossierSelectionne) {
      return;
    }

    if (!this.motif.trim()) {

      alert(
        'Veuillez saisir le motif du rejet.'
      );

      return;

    }

    this.dossierSelectionne.statut =
      'Rejeté';

    this.dossierSelectionne.observation =
      this.motif;

    alert(
      `Le dossier ${this.dossierSelectionne.numero} a été rejeté.`
    );

    this.fermerDossier();

  }


  // ==============================
  // RETOUR COMPLEMENT
  // ==============================

  retournerComplement(): void {

    if (!this.dossierSelectionne) {
      return;
    }

    if (!this.motif.trim()) {

      alert(
        'Veuillez indiquer les documents ou informations manquants.'
      );

      return;

    }

    this.dossierSelectionne.statut =
      'Retour pour complément';

    this.dossierSelectionne.observation =
      this.motif;

    alert(
      'Le dossier a été retourné pour complément.'
    );

    this.fermerDossier();

  }


  // ==============================
  // RESET
  // ==============================

  resetFiltres(): void {

    this.recherche = '';

    this.statutFiltre = '';

  }

}