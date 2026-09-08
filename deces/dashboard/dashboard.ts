import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DossierDeces {
  id: number;
  numero: string;
  adherent: string;
  dateDeces: string;
  statut: string;
}

@Component({
  selector: 'app-deces-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // =========================
  // STATISTIQUES
  // =========================

  stats = {
    total: 125,
    enCours: 18,
    incomplets: 7,
    aValider: 12,
    valides: 65,
    clotures: 23
  };


  // =========================
  // DERNIERS DOSSIERS
  // =========================

  dossiers: DossierDeces[] = [

    {
      id: 1,
      numero: 'DEC-2026-001',
      adherent: 'Ahmed El Amrani',
      dateDeces: '02/08/2026',
      statut: 'À valider'
    },

    {
      id: 2,
      numero: 'DEC-2026-002',
      adherent: 'Mohamed Alaoui',
      dateDeces: '01/08/2026',
      statut: 'En cours'
    },

    {
      id: 3,
      numero: 'DEC-2026-003',
      adherent: 'Youssef Bennani',
      dateDeces: '29/07/2026',
      statut: 'Incomplet'
    },

    {
      id: 4,
      numero: 'DEC-2026-004',
      adherent: 'Omar Idrissi',
      dateDeces: '25/07/2026',
      statut: 'Validé'
    }

  ];


  // =========================
  // VOIR DOSSIER
  // =========================

  voirDossier(dossier: DossierDeces): void {

    console.log('Dossier sélectionné :', dossier);

    alert(
      'N° dossier : ' + dossier.numero +
      '\nAdhérent : ' + dossier.adherent +
      '\nDate décès : ' + dossier.dateDeces +
      '\nStatut : ' + dossier.statut
    );

  }


  // =========================
  // CLASS STATUS
  // =========================

  getStatusClass(statut: string): string {

    switch (statut) {

      case 'À valider':
        return 'status-warning';

      case 'En cours':
        return 'status-progress';

      case 'Incomplet':
        return 'status-danger';

      case 'Validé':
        return 'status-success';

      case 'Clôturé':
        return 'status-closed';

      default:
        return '';

    }

  }

}