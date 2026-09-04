import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdherentPageResponse,
  DecesAdherentPageResponse,
  AdherentResponse,
  DossierDecesRequest,
  DossierDecesResponse,
  DossierValidationResponse,
  HistoriqueDossierDecesResponse,
  RejetDecesRequest,
  RetourComplementRequest,
  ValidationDecesRequest,
  ValidationResultResponse,
  FicheRenseignementsDeces,
  FicheRenseignementsDecesRequest
} from '../../../models';

@Injectable({ providedIn: 'root' })
export class DecesService {
  private readonly base = 'http://localhost:8080/api/deces/dossiers';
  private readonly validationBase = 'http://localhost:8080/api/sections/DECES';

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<DossierDecesResponse[]> {
    return this.http.get<DossierDecesResponse[]>(this.base);
  }

  searchAdherents(search: string): Observable<AdherentPageResponse> {
    const params = new HttpParams().set('search', search).set('page', 0).set('size', 10);
    return this.http.get<AdherentPageResponse>('http://localhost:8080/api/deces/adherents', { params });
  }

  getAdherent(id: number): Observable<AdherentResponse> {
    return this.http.get<AdherentResponse>('http://localhost:8080/api/deces/adherents/' + id);
  }

  getAdherentsAvecDossier(search = '', page = 0, size = 15, hasDossierDeces: boolean | null = null): Observable<DecesAdherentPageResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) params = params.set('search', search.trim());
    if (hasDossierDeces !== null) params = params.set('hasDossierDeces', String(hasDossierDeces));
    return this.http.get<DecesAdherentPageResponse>('http://localhost:8080/api/deces/adherents/dossiers-status', { params });
  }
  findById(id: number): Observable<DossierDecesResponse> {
    return this.http.get<DossierDecesResponse>(`${this.base}/${id}`);
  }

  create(payload: DossierDecesRequest): Observable<DossierDecesResponse> {
    return this.http.post<DossierDecesResponse>(this.base, payload);
  }


  updateDossier(id: number, payload: DossierDecesRequest): Observable<DossierDecesResponse> {
    return this.http.put<DossierDecesResponse>(`${this.base}/${id}`, payload);
  }  updateStatut(id: number, statut: string): Observable<DossierDecesResponse> {
    return this.http.patch<DossierDecesResponse>(`${this.base}/${id}/statut`, null, { params: { statut } });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getDossiersAValider(search = '', statut = ''): Observable<DossierDecesResponse[]> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    if (statut.trim()) params = params.set('statut', statut.trim());
    return this.http.get<DossierDecesResponse[]>(`${this.validationBase}/validation`, { params });
  }

  getControleValidation(id: number): Observable<ValidationResultResponse> {
    return this.http.get<ValidationResultResponse>(`${this.validationBase}/dossiers/${id}/controle-validation`);
  }

  soumettreValidation(id: number): Observable<DossierValidationResponse> {
    return this.http.post<DossierValidationResponse>(`${this.validationBase}/dossiers/${id}/soumettre-validation`, {});
  }

  validerDossier(id: number, request: ValidationDecesRequest): Observable<DossierValidationResponse> {
    return this.http.post<DossierValidationResponse>(`${this.validationBase}/dossiers/${id}/valider`, request);
  }

  retournerPourComplement(id: number, motif: string): Observable<DossierDecesResponse> {
    const request: RetourComplementRequest = { motif };
    return this.http.post<DossierDecesResponse>(`${this.validationBase}/dossiers/${id}/retour-complement`, request);
  }

  rejeterDossier(id: number, motif: string): Observable<DossierDecesResponse> {
    const request: RejetDecesRequest = { motif };
    return this.http.post<DossierDecesResponse>(`${this.validationBase}/dossiers/${id}/rejeter`, request);
  }

  cloturerDossier(id: number): Observable<DossierDecesResponse> {
    return this.http.post<DossierDecesResponse>(`${this.validationBase}/dossiers/${id}/cloturer`, {});
  }

  getHistorique(id: number): Observable<HistoriqueDossierDecesResponse[]> {
    return this.http.get<HistoriqueDossierDecesResponse[]>(`${this.validationBase}/dossiers/${id}/historique`);
  }
  getFiche(id: number): Observable<FicheRenseignementsDeces> {
    return this.http.get<FicheRenseignementsDeces>(`${this.validationBase}/dossiers/${id}/fiche`);
  }

  updateFiche(id: number, payload: FicheRenseignementsDecesRequest): Observable<FicheRenseignementsDeces> {
    return this.http.put<FicheRenseignementsDeces>(`${this.validationBase}/dossiers/${id}/fiche`, payload);
  }

  exportFichePdf(id: number): Observable<Blob> {
    return this.http.get(`${this.validationBase}/dossiers/${id}/fiche/pdf`, { responseType: 'blob' });
  }
}