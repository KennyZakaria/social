import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdherentResponse, AyantDroitResponse } from '../../../models';
import { DecesService } from '../services/deces.service';
import { AyantsDroitService } from '../services/ayants-droit.service';

@Component({selector:'app-ayants-droit',imports:[CommonModule,FormsModule,ReactiveFormsModule,RouterLink],templateUrl:'./ayants-droit.component.html',styleUrl:'./ayants-droit.component.scss'})
export class AyantsDroitComponent {
 search=''; results:AdherentResponse[]=[]; adherent:AdherentResponse|null=null; ayants:AyantDroitResponse[]=[]; loading=false; formOpen=false; editingId:number|null=null; confirmDeleteId:number|null=null; modeRepartition:'POURCENTAGE'|'CHARIA'='POURCENTAGE'; successMsg=''; errorMsg=''; private timer:any;
 readonly form=this.fb.nonNullable.group({nom:['',Validators.required],prenom:['',Validators.required],cin:['',Validators.required],lienParente:['',Validators.required],dateNaissance:[''],telephone:[''],adresse:[''],pourcentage:[null as number|null]});
 get totalPct(){return this.ayants.reduce((s,a)=>s+(a.pourcentage??0),0);}
 constructor(private fb:FormBuilder,private svc:AyantsDroitService,private deces:DecesService,private route:ActivatedRoute){
  const adherentId = Number(this.route.snapshot.queryParamMap.get('adherentId'));
  if (Number.isInteger(adherentId) && adherentId > 0) {
    this.deces.getAdherent(adherentId).subscribe({ next: a => this.selectAdherent(a), error: () => this.showErr('Adh�rent introuvable.') });
  }
}
 onSearch(){clearTimeout(this.timer);const q=this.search.trim();if(!q){this.results=[];return;}this.timer=setTimeout(()=>this.deces.searchAdherents(q).subscribe({next:r=>this.results=r.content,error:()=>this.results=[]}),250);}
 selectAdherent(a:AdherentResponse){this.adherent=a;this.search=`${a.prenomAr} ${a.nomAr}`;this.results=[];this.formOpen=false;this.loadAyants();}
 openNew(){if(!this.adherent){this.showErr('Sélectionnez d’abord un adhérent.');return;}this.editingId=null;this.form.reset();this.formOpen=true;}
 closeForm(){this.formOpen=false;this.editingId=null;this.form.reset();}
 startEdit(a:AyantDroitResponse){this.editingId=a.id;this.modeRepartition=a.typeRepartition as 'POURCENTAGE'|'CHARIA';this.form.patchValue({nom:a.nom,prenom:a.prenom,cin:a.cin,lienParente:a.lienParente,dateNaissance:a.dateNaissance??'',telephone:a.telephone??'',adresse:a.adresse??'',pourcentage:a.pourcentage??null});this.formOpen=true;}
 saveAyant(){if(!this.adherent||this.form.invalid)return;const r=this.form.getRawValue();const p:any={nom:r.nom,prenom:r.prenom,cin:r.cin,lienParente:r.lienParente,dateNaissance:r.dateNaissance||undefined,telephone:r.telephone||undefined,adresse:r.adresse||undefined,typeRepartition:this.modeRepartition,pourcentage:this.modeRepartition==='POURCENTAGE'?r.pourcentage??undefined:undefined};const call=this.editingId?this.svc.update(this.adherent.id,this.editingId,p):this.svc.create(this.adherent.id,p);call.subscribe({next:item=>{if(this.editingId){this.ayants=this.ayants.map(a=>a.id===item.id?item:a);this.show('Ayant droit mis à jour.');}else{this.ayants=[...this.ayants,item];this.show('Ayant droit ajouté.');}this.closeForm();},error:e=>this.showErr(e?.error?.message||'Erreur lors de l’enregistrement.')});}
 doDelete(id:number){if(!this.adherent)return;this.svc.delete(this.adherent.id,id).subscribe({next:()=>{this.ayants=this.ayants.filter(a=>a.id!==id);this.confirmDeleteId=null;this.show('Ayant droit supprimé.');},error:e=>{this.confirmDeleteId=null;this.showErr(e?.error?.message||'Suppression impossible.')}});}
 private loadAyants(){if(!this.adherent)return;this.loading=true;this.svc.list(this.adherent.id).subscribe({next:d=>{this.ayants=d;this.loading=false;},error:e=>{this.loading=false;this.showErr(e?.error?.message||'Impossible de charger les ayants droit.')}});}
 private show(m:string){this.successMsg=m;setTimeout(()=>this.successMsg='',3500)} private showErr(m:string){this.errorMsg=m;setTimeout(()=>this.errorMsg='',4500)}
}