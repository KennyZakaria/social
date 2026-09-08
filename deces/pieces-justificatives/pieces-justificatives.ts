import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface DossierDeces {
  id: number;
  numero: string;
  adherent: string;
  cin: string;
  matricule: string;
  dateDeces: string;
  statut: string;
}

@Component({
  selector: 'app-pieces-justificatives',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './pieces-justificatives.html',
  styleUrl: './pieces-justificatives.css'
})
export class PiecesJustificatives {

  search = '';

  dossiers: DossierDeces[] = [
    {
      id: 1,
      numero: 'DEC-2026-001',
      adherent: 'ALAMI Mohamed',
      cin: 'AB123456',
      matricule: '123456',
      dateDeces: '10/08/2026',
      statut: 'En cours'
    },
    {
      id: 2,
      numero: 'DEC-2026-002',
      adherent: 'BENALI Ahmed',
      cin: 'CD456789',
      matricule: '456789',
      dateDeces: '08/08/2026',
      statut: 'À valider'
    },
    {
      id: 3,
      numero: 'DEC-2026-003',
      adherent: 'EL FASSI Youssef',
      cin: 'EF987654',
      matricule: '987654',
      dateDeces: '05/08/2026',
      statut: 'Validé'
    }
  ];

  constructor(private router: Router) {}

  get dossiersFiltres(): DossierDeces[] {

    const value = this.search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return this.dossiers.filter(dossier =>
      dossier.numero.toLowerCase().includes(value) ||
      dossier.cin.toLowerCase().includes(value) ||
      dossier.matricule.toLowerCase().includes(value) ||
      dossier.adherent.toLowerCase().includes(value)
    );
  }

  ouvrirDossier(id: number): void {
    this.router.navigate([
      '/deces/pieces-justificatives/dossier',
      id
    ]);
  }
}