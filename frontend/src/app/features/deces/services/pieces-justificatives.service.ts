import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PieceJustificativeRequest, PieceJustificativeResponse } from '../../../models';
@Injectable({providedIn:'root'})
export class PiecesJustificativesService {
 constructor(private readonly http:HttpClient){}
 private base(id:number){return 'http://localhost:8080/api/deces/dossiers/'+id+'/pieces-justificatives';}
 list(id:number):Observable<PieceJustificativeResponse[]>{return this.http.get<PieceJustificativeResponse[]>(this.base(id));}
 save(id:number,type:string,payload:PieceJustificativeRequest):Observable<PieceJustificativeResponse>{return this.http.post<PieceJustificativeResponse>(this.base(id)+'/'+type,payload);}
}
