import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DemandeDeces { id: number; dossierId: number; typeDemande: string; description: string | null; statut: string; dateDemande: string; dateTraitement: string | null; }
@Injectable({ providedIn: 'root' })
export class DemandesDecesService {
  private readonly base = 'http://localhost:8080/api/deces/dossiers';
  constructor(private readonly http: HttpClient) {}
  list(dossierId: number): Observable<DemandeDeces[]> { return this.http.get<DemandeDeces[]>(`${this.base}/${dossierId}/demandes`); }
  create(dossierId: number, request: { typeDemande: string; description?: string }): Observable<DemandeDeces> { return this.http.post<DemandeDeces>(`${this.base}/${dossierId}/demandes`, request); }
  delete(dossierId: number, id: number): Observable<void> { return this.http.delete<void>(`${this.base}/${dossierId}/demandes/${id}`); }
  updateStatut(dossierId: number, id: number, statut: string): Observable<DemandeDeces> { return this.http.patch<DemandeDeces>(`${this.base}/${dossierId}/demandes/${id}/statut`, null, { params: new HttpParams().set('statut', statut) }); }
}