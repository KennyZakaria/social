import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdherentPageResponse, AdherentResponse, DossierDecesRequest, DossierDecesResponse } from '../../../models';

@Injectable({ providedIn: 'root' })
export class DecesService {
  private readonly base = 'http://localhost:8080/api/deces/dossiers';

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

  findById(id: number): Observable<DossierDecesResponse> {
    return this.http.get<DossierDecesResponse>(`${this.base}/${id}`);
  }

  create(payload: DossierDecesRequest): Observable<DossierDecesResponse> {
    return this.http.post<DossierDecesResponse>(this.base, payload);
  }

  updateStatut(id: number, statut: string): Observable<DossierDecesResponse> {
    return this.http.patch<DossierDecesResponse>(`${this.base}/${id}/statut`, null, { params: { statut } });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
