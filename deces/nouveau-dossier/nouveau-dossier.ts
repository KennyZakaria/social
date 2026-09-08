import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  Adherent,
  AdherentService
} from '../../../core/services/adherent.service';

import {
  DecesService,
  DossierDecesCreate
} from '../../../core/services/deces.service';


@Component({
  selector: 'app-nouveau-dossier',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './nouveau-dossier.html',
  styleUrl: './nouveau-dossier.css'
})
export class NouveauDossier {

  // =====================================================
  // RECHERCHE ADHERENT
  // =====================================================

  rechercheAdherent = '';

  resultatsRecherche: Adherent[] = [];

  adherentSelectionne: Adherent | null = null;

  rechercheEnCours = false;

  loadingAdherents = false;


  // =====================================================
  // ETAT
  // =====================================================

  loading = false;

  erreur = '';

  succes = '';


  // =====================================================
  // DOSSIER
  // =====================================================

  dossier = {

    adherentId: null as number | null,

    nomComplet: '',

    dateDeces: '',

    lieuDeces: '',

    natureDeces: '',

    causeDeces: '',

    dpr: '',

    observation: ''
  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private readonly adherentService: AdherentService,
    private readonly decesService: DecesService,
    private readonly router: Router
  ) {}


  // =====================================================
  // RECHERCHE ADHERENT
  // =====================================================

  rechercherAdherent(): void {

    const value =
      this.rechercheAdherent.trim();


    if (!value) {

      this.resultatsRecherche = [];

      this.rechercheEnCours = false;

      this.loadingAdherents = false;

      return;
    }


    this.rechercheEnCours = true;

    this.loadingAdherents = true;

    this.erreur = '';


this.adherentService.getAll(
  '',
  '',
  '',
  0,
  10
)
      .subscribe({

        next: (response) => {

          this.resultatsRecherche =
            response.content;

          this.rechercheEnCours = false;

          this.loadingAdherents = false;
        },


        error: (error) => {

          console.error(
            'Erreur recherche adhérent :',
            error
          );

          this.resultatsRecherche = [];

          this.rechercheEnCours = false;

          this.loadingAdherents = false;

          this.erreur =
            'Impossible de rechercher les adhérents.';
        }

      });
  }


  // =====================================================
  // SELECTION ADHERENT
  // =====================================================

  selectionnerAdherent(
    adherent: Adherent
  ): void {

    this.adherentSelectionne =
      adherent;


    this.dossier.adherentId =
      adherent.id;


    // IMPORTANT :
    // Adherent possède nomAr et prenomAr
    // et non nom / prenom

    this.dossier.nomComplet =
      `${adherent.nomAr} ${adherent.prenomAr}`;


    this.rechercheAdherent =
      `${adherent.nomAr} ${adherent.prenomAr}`;


    this.resultatsRecherche = [];

    this.erreur = '';
  }


  // =====================================================
  // CHANGER ADHERENT
  // =====================================================

  changerAdherent(): void {

    this.adherentSelectionne = null;

    this.dossier.adherentId = null;

    this.dossier.nomComplet = '';

    this.rechercheAdherent = '';

    this.resultatsRecherche = [];

    this.erreur = '';

    this.succes = '';
  }


  // =====================================================
  // ENREGISTRER
  // =====================================================

  enregistrer(): void {

    // -----------------------------------------------
    // Reset messages
    // -----------------------------------------------

    this.erreur = '';

    this.succes = '';


    // -----------------------------------------------
    // Vérification adhérent
    // -----------------------------------------------

    if (!this.adherentSelectionne) {

      this.erreur =
        'Veuillez sélectionner un adhérent.';

      return;
    }


    // -----------------------------------------------
    // Vérification date
    // -----------------------------------------------

    if (!this.dossier.dateDeces) {

      this.erreur =
        'Veuillez renseigner la date du décès.';

      return;
    }


    // -----------------------------------------------
    // Vérification lieu
    // -----------------------------------------------

    if (!this.dossier.lieuDeces.trim()) {

      this.erreur =
        'Veuillez renseigner le lieu du décès.';

      return;
    }


    // -----------------------------------------------
    // Préparation données
    // -----------------------------------------------

    const data: DossierDecesCreate = {

      adherentId:
        this.dossier.adherentId!,

      dateDeces:
        this.dossier.dateDeces,

      lieuDeces:
        this.dossier.lieuDeces.trim(),

      natureDeces:
        this.dossier.natureDeces.trim()
          || null,

      causeDeces:
        this.dossier.causeDeces.trim()
          || null,

      dpr:
        this.dossier.dpr.trim()
          || null,

      observation:
        this.dossier.observation.trim()
          || null
    };


    // -----------------------------------------------
    // Loading
    // -----------------------------------------------

    this.loading = true;


    // -----------------------------------------------
    // Appel API
    // -----------------------------------------------

    this.decesService
      .create(data)
      .subscribe({

        // ===========================================
        // SUCCESS
        // ===========================================

        next: (response) => {

          console.log(
            'Dossier décès créé avec succès :',
            response
          );


          this.loading = false;


          this.succes =
            `Dossier ${response.numero} créé avec succès.`;


          // -----------------------------------------
          // Navigation
          // -----------------------------------------

          setTimeout(() => {

            this.router.navigate([
              '/deces/dossiers'
            ]);

          }, 1000);
        },


        // ===========================================
        // ERROR
        // ===========================================

        error: (error) => {

          console.error(
            'Erreur création dossier décès :',
            error
          );


          this.loading = false;


          // -----------------------------------------
          // Backend message
          // -----------------------------------------

          if (
            error?.error?.message
          ) {

            this.erreur =
              error.error.message;

          }


          else if (
            typeof error?.error === 'string'
          ) {

            this.erreur =
              error.error;

          }


          else if (
            error?.status === 0
          ) {

            this.erreur =
              'Impossible de contacter le serveur backend. Vérifiez que Spring Boot est démarré.';

          }


          else if (
            error?.status === 400
          ) {

            this.erreur =
              'Les données envoyées sont invalides.';

          }


          else if (
            error?.status === 404
          ) {

            this.erreur =
              'Adhérent introuvable.';

          }


          else if (
            error?.status === 409
          ) {

            this.erreur =
              'Un dossier de décès existe déjà pour cet adhérent.';

          }


          else {

            this.erreur =
              'Une erreur est survenue lors de la création du dossier.';
          }

        }

      });
  }


  // =====================================================
  // ANNULER
  // =====================================================

  annuler(): void {

    this.dossier = {

      adherentId: null,

      nomComplet: '',

      dateDeces: '',

      lieuDeces: '',

      natureDeces: '',

      causeDeces: '',

      dpr: '',

      observation: ''
    };


    this.adherentSelectionne = null;

    this.rechercheAdherent = '';

    this.resultatsRecherche = [];

    this.erreur = '';

    this.succes = '';

    this.loading = false;


    this.router.navigate([
      '/deces/dossiers'
    ]);
  }

}