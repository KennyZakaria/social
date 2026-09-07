import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AyantDroitRequest, AyantDroitResponse } from '../../../models';
@Injectable({ providedIn: 'root' })
export class AyantsDroitService {
 constructor(private readonly http: HttpClient) {}
 private url(adherentId:number){return `http://localhost:8080/api/deces/adherents/${adherentId}/ayants-droit`;}
 list(adherentId:number):Observable<AyantDroitResponse[]>{return this.http.get<AyantDroitResponse[]>(this.url(adherentId));}
 create(adherentId:number,payload:AyantDroitRequest):Observable<AyantDroitResponse>{return this.http.post<AyantDroitResponse>(this.url(adherentId),payload);}
 update(adherentId:number,id:number,payload:AyantDroitRequest):Observable<AyantDroitResponse>{return this.http.put<AyantDroitResponse>(`${this.url(adherentId)}/${id}`,payload);}
 delete(adherentId:number,id:number):Observable<void>{return this.http.delete<void>(`${this.url(adherentId)}/${id}`);}
}