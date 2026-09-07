import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdherentPageResponse,
  AdherentResponse,
  MutuelleCourrierType,
  MutuelleDossierRequest,
  MutuelleDossierResponse,
  MutuelleDossierType,
} from '../../../models';

@Injectable({ providedIn: 'root' })
export class MutuelleService {
  private readonly baseUrl = 'http://localhost:8080/api/mutuelle';

  constructor(private readonly http: HttpClient) {}

  searchAdherents(search = '', page = 0, size = 20): Observable<AdherentPageResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<AdherentPageResponse>(`${this.baseUrl}/adherents`, { params });
  }

  getAdherent(id: number): Observable<AdherentResponse> {
    return this.http.get<AdherentResponse>(`${this.baseUrl}/adherents/${id}`);
  }

  listDossiers(
    search = '',
    typeCourrier?: MutuelleCourrierType | null,
    typeDossier?: MutuelleDossierType | null,
    dateFrom?: string,
    dateTo?: string,
  ): Observable<MutuelleDossierResponse[]> {
    let params = new HttpParams();
    if (search.trim()) params = params.set('search', search.trim());
    if (typeCourrier) params = params.set('typeCourrier', typeCourrier);
    if (typeDossier) params = params.set('typeDossier', typeDossier);
    if (dateFrom) params = params.set('dateFrom', dateFrom);
    if (dateTo) params = params.set('dateTo', dateTo);
    return this.http.get<MutuelleDossierResponse[]>(`${this.baseUrl}/dossiers`, { params });
  }

  getDossier(id: number): Observable<MutuelleDossierResponse> {
    return this.http.get<MutuelleDossierResponse>(`${this.baseUrl}/dossiers/${id}`);
  }

  createDossier(payload: MutuelleDossierRequest): Observable<MutuelleDossierResponse> {
    return this.http.post<MutuelleDossierResponse>(`${this.baseUrl}/dossiers`, payload);
  }

  updateDossier(id: number, payload: MutuelleDossierRequest): Observable<MutuelleDossierResponse> {
    return this.http.put<MutuelleDossierResponse>(`${this.baseUrl}/dossiers/${id}`, payload);
  }
}
