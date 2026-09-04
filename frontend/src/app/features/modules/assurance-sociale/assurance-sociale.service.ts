import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdherentPageResponse, AdherentResponse, AssuranceRecordRequest, AssuranceRecordResponse, AssuranceRecordType } from '../../../models';

@Injectable({ providedIn: 'root' })
export class AssuranceSocialeService {
  private readonly baseUrl = 'http://localhost:8080/api/assurance';

  constructor(private readonly http: HttpClient) {}

  searchAdherents(search = '', page = 0, size = 20): Observable<AdherentPageResponse> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<AdherentPageResponse>(`${this.baseUrl}/adherents`, { params });
  }

  getAdherent(id: number): Observable<AdherentResponse> {
    return this.http.get<AdherentResponse>(`${this.baseUrl}/adherents/${id}`);
  }

  listRecords(type?: AssuranceRecordType | null, search = '', imputable?: boolean | null, referenceEnvoi?: string): Observable<AssuranceRecordResponse[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (search.trim()) params = params.set('search', search.trim());
    if (imputable !== null && imputable !== undefined) params = params.set('imputable', String(imputable));
    if (referenceEnvoi?.trim()) params = params.set('referenceEnvoi', referenceEnvoi.trim());
    return this.http.get<AssuranceRecordResponse[]>(`${this.baseUrl}/records`, { params });
  }

  getRecord(id: number): Observable<AssuranceRecordResponse> {
    return this.http.get<AssuranceRecordResponse>(`${this.baseUrl}/records/${id}`);
  }

  createRecord(payload: AssuranceRecordRequest): Observable<AssuranceRecordResponse> {
    return this.http.post<AssuranceRecordResponse>(`${this.baseUrl}/records`, payload);
  }

  updateRecord(id: number, payload: AssuranceRecordRequest): Observable<AssuranceRecordResponse> {
    return this.http.put<AssuranceRecordResponse>(`${this.baseUrl}/records/${id}`, payload);
  }

  exportRecords(type?: AssuranceRecordType | null, search = '', imputable?: boolean | null, referenceEnvoi?: string): Observable<Blob> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (search.trim()) params = params.set('search', search.trim());
    if (imputable !== null && imputable !== undefined) params = params.set('imputable', String(imputable));
    if (referenceEnvoi?.trim()) params = params.set('referenceEnvoi', referenceEnvoi.trim());
    return this.http.get(`${this.baseUrl}/records/export`, { params, responseType: 'blob' });
  }
}