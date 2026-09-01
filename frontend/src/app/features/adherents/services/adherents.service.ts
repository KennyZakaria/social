import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdherentRequest, AdherentResponse, AdherentPageResponse } from '../../../models';

@Injectable({ providedIn: 'root' })
export class AdherentsService {
  private readonly baseUrl = 'http://localhost:8080/api/adherents';

  constructor(private readonly http: HttpClient) {}

  list(search?: string, page = 0, size = 20): Observable<AdherentPageResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search) params = params.set('search', search);
    return this.http.get<AdherentPageResponse>(this.baseUrl, { params });
  }

  get(id: number): Observable<AdherentResponse> {
    return this.http.get<AdherentResponse>(`${this.baseUrl}/${id}`);
  }

  create(payload: AdherentRequest): Observable<AdherentResponse> {
    return this.http.post<AdherentResponse>(this.baseUrl, payload);
  }

  update(id: number, payload: AdherentRequest): Observable<AdherentResponse> {
    return this.http.put<AdherentResponse>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
