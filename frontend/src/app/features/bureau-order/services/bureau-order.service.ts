import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MailRecord } from '../../../models';

@Injectable({ providedIn: 'root' })
export class BureauOrderService {
  private readonly baseUrl = 'http://localhost:8080/api/bureau-order';

  constructor(private readonly http: HttpClient) {}

  getMails(query?: string): Observable<MailRecord[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }
    return this.http.get<MailRecord[]>(this.baseUrl, { params });
  }

  createMail(payload: MailRecord): Observable<MailRecord> {
    return this.http.post<MailRecord>(this.baseUrl, payload);
  }
}
