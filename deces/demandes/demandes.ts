import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Demande {
  id: number;
  numero: string;
  adherent: string;
  matricule: string;
  type: string;
  dateDemande: string;
  demandeur: string;
  statut: string;
  observation: string;
}

@Component({
  selector: 'app-demandes',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './demandes.html',
  styleUrl: './demandes.css'
})
export class Demandes {

  search = '';
  statutFilter = '';
  typeFilter = '';

  demandes: Demande[] = [

    {
      id: 1,
      numero: 'DEC-2026-001',
      adherent: 'ALAMI Mohamed',
      matricule: '123456',
      type: 'Demande de prise en charge',
      dateDemande: '2026-08-05',
      demandeur: 'Fatima Alami',
      statut: 'En cours',
      observation: 'Dossier en cours de traitement'
    },

    {
      id: 2,
      numero: 'DEC-2026-002',
      adherent: 'EL AMRANI Ahmed',
      matricule: '245781',
      type: 'Demande ayant droit',
      dateDemande: '2026-08-06',
      demandeur: 'Amina El Amrani',
      statut: 'À valider',
      observation: 'Documents complémentaires demandés'
    },

    {
      id: 3,
      numero: 'DEC-2026-003',
      adherent: 'BENALI Hassan',
      matricule: '368912',
      type: 'Demande de pension',
      dateDemande: '2026-08-07',
      demandeur: 'Youssef Benali',
      statut: 'Validée',
      observation: 'Demande validée'
    },

    {
      id: 4,
      numero: 'DEC-2026-004',
      adherent: 'TAOUFIK Karim',
      matricule: '451236',
      type: 'Demande ayant droit',
      dateDemande: '2026-08-08',
      demandeur: 'Sara Taoufik',
      statut: 'Incomplète',
      observation: 'Acte de naissance manquant'
    }

  ];


  get demandesFiltrees(): Demande[] {

    return this.demandes.filter(demande => {

      const texte = this.search.toLowerCase().trim();

      const matchSearch =
        !texte ||
        demande.numero.toLowerCase().includes(texte) ||
        demande.adherent.toLowerCase().includes(texte) ||
        demande.matricule.toLowerCase().includes(texte) ||
        demande.demandeur.toLowerCase().includes(texte);

      const matchStatut =
        !this.statutFilter ||
        demande.statut === this.statutFilter;

      const matchType =
        !this.typeFilter ||
        demande.type === this.typeFilter;

      return matchSearch && matchStatut && matchType;

    });

  }


  get total(): number {
    return this.demandes.length;
  }


  get enCours(): number {
    return this.demandes.filter(d => d.statut === 'En cours').length;
  }


  get aValider(): number {
    return this.demandes.filter(d => d.statut === 'À valider').length;
  }


  get validees(): number {
    return this.demandes.filter(d => d.statut === 'Validée').length;
  }


  get incompletes(): number {
    return this.demandes.filter(d => d.statut === 'Incomplète').length;
  }


  nouvelleDemande(): void {

    alert('Ouverture du formulaire de nouvelle demande');

  }


  voirDemande(demande: Demande): void {

    alert(
      `Demande ${demande.numero}\n\n` +
      `Adhérent : ${demande.adherent}\n` +
      `Matricule : ${demande.matricule}\n` +
      `Type : ${demande.type}\n` +
      `Demandeur : ${demande.demandeur}\n` +
      `Statut : ${demande.statut}`
    );

  }


  reinitialiserFiltres(): void {

    this.search = '';
    this.statutFilter = '';
    this.typeFilter = '';

  }

}