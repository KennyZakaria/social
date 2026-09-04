export interface CaseRecord {
  id?: number;
  referenceCode: string;
  module: string;
  title: string;
  memberName: string;
  priority: string;
  status: string;
  dueDate?: string;
  notes?: string;
  openedAt?: string;
  lastUpdated?: string;
}

export interface MailRecord {
  id?: number;
  mailNumber: string;
  subject: string;
  senderName: string;
  receiverSection: string;
  direction: 'INCOMING' | 'OUTGOING';
  status: 'REGISTERED' | 'ASSIGNED' | 'IN_PROGRESS' | 'CLOSED';
  urgent: boolean;
  registeredAt?: string;
  lastMovementAt?: string;
}

export interface DashboardSummary {
  totalCases: number;
  totalMails: number;
  moduleCases: Record<string, number>;
}

export type AppRole = 'ADMIN' | 'AGENT' | 'MANAGER';

export interface AuthResponse {
  token: string;
  username: string;
  fullName: string;
  role: AppRole;
  allowedModules: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  allowedModules: string[];
}

export interface UserProfileRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  allowedModules: string[];
  active: boolean;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: AppRole;
  allowedModules: string[];
  active: boolean;
}

export interface AdherentRequest {
  prenomAr: string;
  nomAr: string;
  categorie: string;
  grade: string;
  matriculeBR: string;
  matricule: string;
  dateNaissance: string;
  lieuNaissance: string;
  dateRadiation?: string | null;
  motifRadiation?: string | null;
  dateDeces?: string | null;
  causeDeces?: string | null;
  dernierUnite: string;
  formationUnite: string;
  telephone1: string;
  telephone2?: string | null;
  adresse: string;
  email: string;
  situationCategorie: string;
  pension: boolean;
  cin: string;
}

export interface AdherentResponse extends AdherentRequest {
  id: number;
}

export interface AdherentPageResponse {
  content: AdherentResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ── Section Décès ──────────────────────────────────────────────────────────

export interface DecesAdherentResponse {
  id: number;
  matricule: string;
  matriculeBR: string;
  cin: string;
  nomAr: string;
  prenomAr: string;
  categorie: string;
  grade: string;
  situationCategorie: string;
  hasDossierDeces: boolean;
  dossierDecesId?: number | null;
  numeroDossierDeces?: string | null;
  statutDossierDeces?: string | null;
}

export interface DecesAdherentPageResponse {
  content: DecesAdherentResponse[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface DossierDecesRequest {
  adherentId: number;
  dateDeces: string;
  lieuDeces: string;
  natureDeces?: string;
  causeDeces?: string;
  dpr?: string;
  observation?: string;
}

export interface DossierDecesResponse {
  id: number;
  numero: string;
  adherentId: number;
  nomComplet: string;
  matricule?: string;
  matriculeBR?: string;
  cin?: string;
  dateDeces: string;
  lieuDeces: string;
  natureDeces?: string;
  causeDeces?: string;
  dpr?: string;
  observation?: string;
  statut: string; // NOUVEAU | EN_COURS | INCOMPLET | A_VALIDER | VALIDE | REJETE | CLOTURE | ARCHIVE
  dateCreation?: string;
  dateMaj?: string;
  dateValidation?: string;
  dateCloture?: string;
  validePar?: string;
  cloturePar?: string;
  motifDerniereDecision?: string;
}
export interface AyantDroitRequest {
  nom: string;
  prenom: string;
  cin: string;
  lienParente: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  situationFamiliale?: string;
  niveauInstruction?: string;
  activiteEmploi?: string;
  telephone?: string;
  adresse?: string;
  typeRepartition: 'POURCENTAGE' | 'CHARIA';
  pourcentage?: number;
}

export interface AyantDroitResponse {
  id: number;
  adherentId: number;
  nom: string;
  prenom: string;
  cin: string;
  lienParente: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  situationFamiliale?: string;
  niveauInstruction?: string;
  activiteEmploi?: string;
  telephone?: string;
  adresse?: string;
  typeRepartition: string;
  pourcentage?: number;
}

export interface PieceJustificativeRequest {
  libelle: string;
  present: boolean;
}

export interface PieceJustificativeResponse extends PieceJustificativeRequest {
  id: number;
  dossierId: number;
  typePiece: string;
}

export interface ValidationControleResponse {
  code: string;
  libelle: string;
  complet: boolean;
  message: string;
}

export interface ValidationResultResponse {
  valid: boolean;
  progression: number;
  erreurs: string[];
  avertissements: string[];
  controles: Record<string, boolean>;
  details: ValidationControleResponse[];
}

export interface ValidationDecesRequest {
  commentaire?: string;
}

export interface RetourComplementRequest {
  motif: string;
}

export interface RejetDecesRequest {
  motif: string;
}

export interface DossierValidationResponse {
  dossier: DossierDecesResponse;
  controle: ValidationResultResponse;
}

export interface HistoriqueDossierDecesResponse {
  id: number;
  dossierId: number;
  action: string;
  ancienStatut?: string;
  nouveauStatut?: string;
  commentaire?: string;
  username?: string;
  dateAction: string;
}
export interface FicheAyant {
  id: number; nom: string; prenom: string; dateNaissance?: string; lieuNaissance?: string;
  cin?: string; situationFamiliale?: string; niveauInstruction?: string; activiteEmploi?: string;
  adresse?: string; lienParente?: string;
}
export interface FicheLiquidation { id?: number; designation: string; montant: number; beneficiaire?: string; reference?: string; }
export interface FichePension { id?: number; typeBeneficiaire: string; ayantDroitId?: number | null; numero?: string; montant: number; }
export interface FicheAssurance { id?: number; typeBeneficiaire: string; ayantDroitId?: number | null; numeroCheque?: string; montant: number; }
export interface FicheAssistance { id?: number; designation: string; montant: number; date?: string; chequeReference?: string; }
export interface FicheSituationFinanciere {
  pmr: number; pmi: number; salaire: number; autresRessources: number; eauElectricite: number;
  fraisMedicaux: number; fraisScolarite: number; loyer: number; autresCharges: number;
  totalRessources: number; totalCharges: number; balance: number;
}
export interface FicheRenseignementsDeces {
  dossierId: number; numeroDossier: string;
  adherent: { id: number; nom: string; prenom: string; grade?: string; matricule?: string; matriculeBR?: string; cin?: string; dateNaissance?: string; lieuNaissance?: string; derniereUnite?: string; situationCategorie?: string; };
  deces: { dateDeces?: string; lieuDeces?: string; causeDeces?: string; dpr?: string; dateFiche?: string; dateMiseAJour?: string; };
  veufVeuve?: FicheAyant | null; orphelins: FicheAyant[]; ascendants: FicheAyant[]; autresAyantsDroit: FicheAyant[];
  liquidations: FicheLiquidation[]; pensions: FichePension[]; assurances: FicheAssurance[];
  situationFinanciere: FicheSituationFinanciere; assistancesOctroyees: FicheAssistance[]; observation?: string;
}
export interface FicheRenseignementsDecesRequest {
  observation?: string; liquidations: FicheLiquidation[]; pensions: FichePension[]; assurances: FicheAssurance[];
  situationFinanciere?: Omit<FicheSituationFinanciere, 'totalRessources' | 'totalCharges' | 'balance'>;
  assistancesOctroyees: FicheAssistance[];
}