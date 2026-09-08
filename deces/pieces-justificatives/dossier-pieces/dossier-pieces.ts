import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Piece {
  id: number;
  nom: string;
  obligatoire: boolean;
  statut: 'Manquante' | 'Fournie' | 'Validée';
  fichier?: string;
}

@Component({
  selector: 'app-dossier-pieces',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dossier-pieces.html',
  styleUrl: './dossier-pieces.css'
})
export class DossierPieces {

  dossierId = '';

  dossier = {
    numero: 'DEC-2026-001',
    adherent: 'ALAMI Mohamed',
    cin: 'AB123456',
    matricule: '123456',
    dateDeces: '10/08/2026',
    lieuDeces: 'Rabat',
    statut: 'En cours'
  };

  pieces: Piece[] = [
    {
      id: 1,
      nom: 'Certificat de décès',
      obligatoire: true,
      statut: 'Fournie',
      fichier: 'certificat-deces.pdf'
    },
    {
      id: 2,
      nom: 'Copie CIN',
      obligatoire: true,
      statut: 'Fournie',
      fichier: 'cin.pdf'
    },
    {
      id: 3,
      nom: 'Acte de décès',
      obligatoire: true,
      statut: 'Manquante'
    },
    {
      id: 4,
      nom: 'Situation familiale',
      obligatoire: true,
      statut: 'Manquante'
    },
    {
      id: 5,
      nom: 'RIB',
      obligatoire: false,
      statut: 'Manquante'
    }
  ];

  constructor(private route: ActivatedRoute) {

    this.dossierId =
      this.route.snapshot.paramMap.get('id') ?? '';

  }

  get piecesFournies(): number {
    return this.pieces.filter(
      piece =>
        piece.statut === 'Fournie' ||
        piece.statut === 'Validée'
    ).length;
  }

  get piecesManquantes(): number {
    return this.pieces.filter(
      piece => piece.statut === 'Manquante'
    ).length;
  }

  ajouterPiece(): void {
    alert('Fonction d’ajout de pièce à connecter au backend.');
  }

  consulter(piece: Piece): void {
    alert(`Ouverture de : ${piece.fichier}`);
  }

  supprimer(piece: Piece): void {

    if (confirm(`Supprimer la pièce "${piece.nom}" ?`)) {

      piece.statut = 'Manquante';
      piece.fichier = undefined;

    }

  }
}