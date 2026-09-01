import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Dossier {
  id: number;
  numero: string;
  adherent: string;
  cin: string;
  matricule: string;
  dateDeces: string;
  lieuDeces: string;
}

interface AyantDroit {
  id: number;
  nom: string;
  prenom: string;
  cin: string;
  lienParente: string;
  dateNaissance: string;
  telephone: string;
  adresse: string;
  pourcentage: number;
}

@Component({
  selector: 'app-ayants-droit',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './ayants-droit.html',
  styleUrl: './ayants-droit.css'
})
export class AyantsDroit {

  // =====================================================
  // RECHERCHE
  // =====================================================

  search = '';


  // =====================================================
  // MODE DE REPARTITION
  // =====================================================

  modeRepartition: 'pourcentage' | 'charia' = 'pourcentage';


  // =====================================================
  // DOSSIER SELECTIONNE
  // =====================================================

  dossierSelectionne: Dossier | null = null;


  // =====================================================
  // LISTE DES DOSSIERS
  // STATIC POUR LE MOMENT
  // =====================================================

  dossiers: Dossier[] = [

    {
      id: 1,
      numero: 'DEC-2026-0001',
      adherent: 'ALAMI Mohamed',
      cin: 'AB123456',
      matricule: '123456',
      dateDeces: '2026-07-10',
      lieuDeces: 'Rabat'
    },

    {
      id: 2,
      numero: 'DEC-2026-0002',
      adherent: 'BENALI Ahmed',
      cin: 'CD456789',
      matricule: '456789',
      dateDeces: '2026-07-15',
      lieuDeces: 'Fès'
    },

    {
      id: 3,
      numero: 'DEC-2026-0003',
      adherent: 'EL AMRANI Youssef',
      cin: 'EF789123',
      matricule: '789123',
      dateDeces: '2026-07-20',
      lieuDeces: 'Casablanca'
    }

  ];


  // =====================================================
  // AYANTS DROIT
  // =====================================================

  ayantsDroit: AyantDroit[] = [];


  // =====================================================
  // FORMULAIRE
  // =====================================================

  showForm = false;

  editMode = false;


  // =====================================================
  // OBJET AYANT DROIT
  // =====================================================

  ayant: AyantDroit = this.nouvelAyant();


  // =====================================================
  // CREER UN NOUVEL AYANT DROIT
  // =====================================================

  nouvelAyant(): AyantDroit {

    return {

      id: 0,

      nom: '',

      prenom: '',

      cin: '',

      lienParente: '',

      dateNaissance: '',

      telephone: '',

      adresse: '',

      pourcentage: 0

    };

  }


  // =====================================================
  // RESULTATS DE RECHERCHE
  // =====================================================

  get resultatsRecherche(): Dossier[] {

    const valeur =
      this.search
        .trim()
        .toLowerCase();


    if (!valeur) {

      return [];

    }


    return this.dossiers.filter(dossier =>

      dossier.adherent
        .toLowerCase()
        .includes(valeur)

      ||

      dossier.cin
        .toLowerCase()
        .includes(valeur)

      ||

      dossier.matricule
        .toLowerCase()
        .includes(valeur)

    );

  }


  // =====================================================
  // SELECTIONNER DOSSIER
  // =====================================================

  selectionnerDossier(
    dossier: Dossier
  ): void {

    this.dossierSelectionne = dossier;


    // =================================================
    // STATIC DATA
    // =================================================

    if (dossier.id === 1) {

      this.ayantsDroit = [

        {
          id: 1,

          nom: 'ALAMI',

          prenom: 'Fatima',

          cin: 'AA112233',

          lienParente: 'Épouse',

          dateNaissance: '1985-04-12',

          telephone: '0612345678',

          adresse: 'Rabat',

          pourcentage: 50

        },

        {
          id: 2,

          nom: 'ALAMI',

          prenom: 'Yassine',

          cin: 'BB445566',

          lienParente: 'Fils',

          dateNaissance: '2010-08-20',

          telephone: '0623456789',

          adresse: 'Rabat',

          pourcentage: 50

        }

      ];

    }

    else {

      this.ayantsDroit = [];

    }

  }


  // =====================================================
  // TOTAL POURCENTAGE
  // =====================================================

  get totalPourcentage(): number {

    return this.ayantsDroit.reduce(

      (
        total,
        ayant
      ) =>

        total +
        Number(
          ayant.pourcentage || 0
        ),

      0

    );

  }


  // =====================================================
  // POURCENTAGE VALIDE
  // =====================================================

  get pourcentageValide(): boolean {

    return (
      Math.abs(
        this.totalPourcentage - 100
      ) < 0.01
    );

  }


  // =====================================================
  // POURCENTAGE DEPASSE
  // =====================================================

  get pourcentageDepasse(): boolean {

    return this.totalPourcentage > 100;

  }


  // =====================================================
  // POURCENTAGE RESTANT
  // =====================================================

  get pourcentageRestant(): number {

    return Math.max(

      0,

      100 - this.totalPourcentage

    );

  }


  // =====================================================
  // POURCENTAGE PROGRESS BAR
  // =====================================================

  get pourcentageProgress(): number {

    return Math.min(

      Math.max(
        this.totalPourcentage,
        0
      ),

      100

    );

  }


  // =====================================================
  // CHANGER MODE
  // =====================================================

  changerMode(
    mode: 'pourcentage' | 'charia'
  ): void {

    this.modeRepartition = mode;

  }


  // =====================================================
  // AJOUTER UN AYANT DROIT
  // =====================================================

  nouveau(): void {

    if (!this.dossierSelectionne) {

      alert(
        'Veuillez sélectionner un dossier.'
      );

      return;

    }


    this.editMode = false;


    this.ayant =
      this.nouvelAyant();


    // =================================================
    // Pourcentage restant automatiquement proposé
    // =================================================

    if (
      this.modeRepartition ===
      'pourcentage'
    ) {

      this.ayant.pourcentage =
        this.pourcentageRestant;

    }


    this.showForm = true;

  }


  // =====================================================
  // MODIFIER
  // =====================================================

  modifier(
    ayant: AyantDroit
  ): void {

    this.editMode = true;


    this.ayant = {

      ...ayant

    };


    this.showForm = true;

  }


  // =====================================================
  // FERMER FORMULAIRE
  // =====================================================

  fermerForm(): void {

    this.showForm = false;

    this.editMode = false;

    this.ayant =
      this.nouvelAyant();

  }


  // =====================================================
  // ENREGISTRER AYANT DROIT
  // =====================================================

  enregistrer(): void {


    // =================================================
    // VALIDATION POURCENTAGE
    // =================================================

    if (
      this.modeRepartition ===
      'pourcentage'
    ) {

      const nouveauPourcentage =
        Number(
          this.ayant.pourcentage || 0
        );


      if (
        nouveauPourcentage <= 0
      ) {

        alert(
          'Veuillez saisir un pourcentage supérieur à 0%.'
        );

        return;

      }


      if (
        nouveauPourcentage > 100
      ) {

        alert(
          'Le pourcentage ne peut pas dépasser 100%.'
        );

        return;

      }


      // =============================================
      // Ancienne valeur en cas de modification
      // =============================================

      let ancienPourcentage = 0;


      if (this.editMode) {

        const ancien =
          this.ayantsDroit.find(
            a =>
              a.id ===
              this.ayant.id
          );


        if (ancien) {

          ancienPourcentage =
            Number(
              ancien.pourcentage || 0
            );

        }

      }


      const nouveauTotal =

        this.totalPourcentage

        -

        ancienPourcentage

        +

        nouveauPourcentage;


      if (
        nouveauTotal > 100
      ) {

        alert(

          'Le total ne peut pas dépasser 100%.\n\n' +

          'Pourcentage disponible : ' +

          (
            100
            -
            (
              this.totalPourcentage
              -
              ancienPourcentage
            )
          ) +

          '%'

        );

        return;

      }

    }


    // =================================================
    // MODIFICATION
    // =================================================

    if (this.editMode) {

      const index =
        this.ayantsDroit.findIndex(

          a =>
            a.id ===
            this.ayant.id

        );


      if (index !== -1) {

        this.ayantsDroit[index] = {

          ...this.ayant

        };

      }

    }


    // =================================================
    // AJOUT
    // =================================================

    else {

      const nouveauId =

        this.ayantsDroit.length > 0

          ?

          Math.max(
            ...this.ayantsDroit.map(
              a => a.id
            )
          ) + 1

          :

          1;


      this.ayant.id =
        nouveauId;


      this.ayantsDroit.push({

        ...this.ayant

      });

    }


    this.fermerForm();

  }


  // =====================================================
  // SUPPRIMER
  // =====================================================

  supprimer(
    id: number
  ): void {

    const confirmation =
      confirm(
        'Voulez-vous supprimer cet ayant droit ?'
      );


    if (!confirmation) {

      return;

    }


    this.ayantsDroit =

      this.ayantsDroit.filter(

        ayant =>
          ayant.id !== id

      );

  }


  // =====================================================
  // SAUVEGARDER LA REPARTITION
  // =====================================================

  sauvegarderRepartition(): void {


    // =================================================
    // MODE POURCENTAGE
    // =================================================

    if (
      this.modeRepartition ===
      'pourcentage'
    ) {


      if (
        this.ayantsDroit.length === 0
      ) {

        alert(
          'Veuillez ajouter au moins un ayant droit.'
        );

        return;

      }


      if (
        !this.pourcentageValide
      ) {

        alert(

          'La répartition doit être exactement de 100%.\n\n' +

          'Total actuel : ' +

          this.totalPourcentage +

          '%\n\n' +

          'Reste : ' +

          this.pourcentageRestant +

          '%'

        );

        return;

      }


      console.log(
        'Répartition en pourcentage:',
        this.ayantsDroit
      );


      alert(
        'Répartition à 100% enregistrée avec succès.'
      );


      return;

    }


    // =================================================
    // MODE CHARIA
    // =================================================

    if (
      this.modeRepartition ===
      'charia'
    ) {


      if (
        this.ayantsDroit.length === 0
      ) {

        alert(
          'Veuillez ajouter au moins un ayant droit.'
        );

        return;

      }


      console.log(
        'Répartition Charia:',
        this.ayantsDroit
      );


      alert(
        'Répartition selon la Charia enregistrée avec succès.'
      );

    }

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackById(
    index: number,
    ayant: AyantDroit
  ): number {

    return ayant.id;

  }

}