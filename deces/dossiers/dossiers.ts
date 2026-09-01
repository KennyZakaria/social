import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DossierService } from '../../../core/services/dossier.service';
import { Dossier as ApiDossier, DossierStatut } from '../../../core/models/dossier.model';

interface DossierDeces {
  id: number;
  numero: string;
  adherent: string;
  matricule: string;
  dateDeces: string;
  lieuDeces: string;
  natureDeces: string;
  statut: string;
}

const STATUT_LABELS: Record<DossierStatut, string> = {
  A_VALIDER: 'À valider',
  EN_COURS: 'En cours',
  INCOMPLET: 'Incomplet',
  VALIDE: 'Validé',
  CLOTURE: 'Clôturé'
};

@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dossiers.html',
  styleUrl: './dossiers.css'
})
export class Dossiers implements OnInit {

  searchTerm = '';
  selectedStatut = 'Tous';

  dossiers: DossierDeces[] = [];
  loading = false;
  errorMessage = '';

  constructor(private dossierService: DossierService) {}

  ngOnInit(): void {
    this.chargerDossiers();
  }

  chargerDossiers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.dossierService.list('DECES', undefined, undefined, 0, 100).subscribe({

      next: (page) => {
        this.dossiers = page.content.map(this.toViewModel);
        this.loading = false;
      },

      error: () => {
        this.errorMessage = 'Impossible de charger les dossiers. Vérifiez que le serveur est démarré.';
        this.loading = false;
      }

    });

  }

  private toViewModel(d: ApiDossier): DossierDeces {

    return {
      id: d.id,
      numero: d.numero,
      adherent: d.adherentNom,
      matricule: d.matricule,
      dateDeces: d.dateEvenement ?? '',
      lieuDeces: d.lieu ?? '',
      natureDeces: d.nature ?? '',
      statut: STATUT_LABELS[d.statut] ?? d.statut
    };

  }


  get filteredDossiers(): DossierDeces[] {

    return this.dossiers.filter(dossier => {

      const search = this.searchTerm.toLowerCase().trim();

      const matchesSearch =
        dossier.numero.toLowerCase().includes(search) ||
        dossier.adherent.toLowerCase().includes(search) ||
        dossier.matricule.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatut === 'Tous' ||
        dossier.statut === this.selectedStatut;

      return matchesSearch && matchesStatus;

    });

  }


  nouveauDossier(): void {
    console.log('Nouveau dossier');
  }


  voirDossier(dossier: DossierDeces): void {

    console.log('Dossier sélectionné:', dossier);

    alert(
      `Dossier ${dossier.numero}\n\n` +
      `Adhérent : ${dossier.adherent}\n` +
      `Statut : ${dossier.statut}`
    );

  }


  modifierDossier(dossier: DossierDeces): void {

    console.log('Modifier:', dossier);

    alert(`Modification du dossier ${dossier.numero}`);

  }


  getStatusClass(statut: string): string {

    switch (statut) {

      case 'En cours':
        return 'status-progress';

      case 'Incomplet':
        return 'status-danger';

      case 'À valider':
        return 'status-warning';

      case 'Validé':
        return 'status-success';

      case 'Clôturé':
        return 'status-closed';

      default:
        return '';

    }

  }

}
