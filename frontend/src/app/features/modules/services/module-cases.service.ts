import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaseRecord } from '../../../models';

@Injectable({ providedIn: 'root' })
export class ModuleCasesService {
  private readonly baseUrl = 'http://localhost:8080/api/modules';

  constructor(private readonly http: HttpClient) {}

  getCases(module: string): Observable<CaseRecord[]> {
    return this.http.get<CaseRecord[]>(`${this.baseUrl}/${module}`);
  }

  createCase(module: string, payload: CaseRecord): Observable<CaseRecord> {
    return this.http.post<CaseRecord>(`${this.baseUrl}/${module}`, payload);
  }
}
