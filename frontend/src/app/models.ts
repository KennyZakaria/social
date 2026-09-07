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
  dateDeces: string;
  lieuDeces: string;
  natureDeces?: string;
  causeDeces?: string;
  dpr?: string;
  observation?: string;
  statut: string; // EN_COURS | INCOMPLET | A_VALIDER | VALIDE | CLOTURE
}

export interface AyantDroitRequest {
  nom: string;
  prenom: string;
  cin: string;
  lienParente: string;
  dateNaissance?: string;
  telephone?: string;
  adresse?: string;
  typeRepartition: 'POURCENTAGE' | 'CHARIA';
  pourcentage?: number;
}

export interface AyantDroitResponse {
  id: number;
  dossierId: number;
  nom: string;
  prenom: string;
  cin: string;
  lienParente: string;
  dateNaissance?: string;
  telephone?: string;
  adresse?: string;
  typeRepartition: string;
  pourcentage?: number;
}
