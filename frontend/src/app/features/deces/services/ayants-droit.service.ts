import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AyantDroitRequest, AyantDroitResponse } from '../../../models';

@Injectable({ providedIn: 'root' })
export class AyantsDroitService {
  private url(dossierId: number) {
    return `http://localhost:8080/api/deces/dossiers/${dossierId}/ayants-droit`;
  }

  constructor(private readonly http: HttpClient) {}

  list(dossierId: number): Observable<AyantDroitResponse[]> {
    return this.http.get<AyantDroitResponse[]>(this.url(dossierId));
  }

  create(dossierId: number, payload: AyantDroitRequest): Observable<AyantDroitResponse> {
    return this.http.post<AyantDroitResponse>(this.url(dossierId), payload);
  }

  update(dossierId: number, id: number, payload: AyantDroitRequest): Observable<AyantDroitResponse> {
    return this.http.put<AyantDroitResponse>(`${this.url(dossierId)}/${id}`, payload);
  }

  delete(dossierId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.url(dossierId)}/${id}`);
  }
}
