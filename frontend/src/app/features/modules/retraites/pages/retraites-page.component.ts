import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';
import { AdherentsService } from '../../../adherents/services/adherents.service';
import { AdherentResponse } from '../../../../models';

type Tab = 'fiche' | 'famille' | 'dossier' | 'historique';
interface Person { id: number; type: 'Conjoint' | 'Enfant' | 'Membre de famille'; nom: string; prenom: string; naissance: string; cin: string; lien: string; charge: boolean; lieu?: string; fonction?: string; mutuelle?: string; mariage?: string; divorce?: string; niveauInstruction?: string; emploi?: string; }
interface SocialEntry { id: number; identification: string; diagnostic: string; duree: string; confirmed?: boolean; }
interface AssistanceEntry { id: number; nature: string; organisme: string; date: string; observation: string; confirmed?: boolean; }
interface BudgetEntry { designation: string; montant: string; }

@Component({
  selector: 'app-retraites-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './retraites-page.component.html',
  styleUrl: './retraites-page.component.css',
  styles: ['.actions > button:first-child { display: none; }.budget-input{width:100%;border-collapse:collapse}.budget-input th,.budget-input td{padding:.7rem;border-bottom:1px solid var(--border);text-align:left;font-size:.78rem}.budget-input th{background:var(--surface-2);color:var(--text-2);font-weight:700}.budget-input input{width:100%;box-sizing:border-box;border:1px solid var(--border);border-radius:6px;padding:.45rem;background:var(--surface)}']
})
export class RetraitesPageComponent implements OnInit {
  tab: Tab = 'fiche'; message = ''; editing: Person | null = null; memberError = ''; memberSubmitted = false; private editingNewMember = false; isNewDossier = false; readOnly = false; validationMode = false;
  private dossierId?: number;
  selectedAdherent: AdherentResponse | null = null;
  photoUrl = '';
  adherentSearch = '';
  adherentResults: AdherentResponse[] = [];
  searching = false;
  searchError = '';
  private draftSnapshot = '';
  private searchTimer?: ReturnType<typeof setTimeout>;
  profile: any = {dossier:'RET-2026-0142',prenom:'Ahmed',nom:'El Mansouri',prenomAr:'',nomAr:'',naissance:'',lieu:'',cin:'',situation:'Marié(e)',matricule:'MAT-45871',corps:'',grade:'Sous-officier',categorie:'Retraité',entree:'',radiation:'',motif:'Limite d’âge',pension:true,unite:'',formation:'',region:'Rabat-Salé-Kénitra',tel:'',tel2:'',telephoneFixe:'',email:'',adresse:'',dateEnquete:'',habitation:'',proprietaire:false,locataire:false,habitationPrecision:'',observation:''};
  socialData: SocialEntry[] = [];
  assistances: AssistanceEntry[] = [];
  resources: BudgetEntry[] = [{ designation: 'Pension de retraite', montant: '' }, { designation: 'Pension de réforme', montant: '' }, { designation: 'Autres ressources', montant: '' }];
  charges: BudgetEntry[] = [{ designation: 'Crédit logement', montant: '' }, { designation: 'Eau / électricité', montant: '' }, { designation: 'Frais médicaux', montant: '' }, { designation: 'Autres (loyer, crédit, consommation)', montant: '' }];
  familyAction: Person['type'] | '' = '';
  family: Person[] = [];
  membership = { carteFraternelle:'', numeroDossier:'', cartePrelevementCmr:'', situationFraternelle:'', anneeAdhesion:'', modeReglement:'', numeroRecu:'', datePaiement:'', avecPhoto:false, observation:'', carteSpeciale:false, carteSpecialeNumero:'', carteSpecialeObservation:'', carteFraternelleAdherent:false, carteFraternelleObservation:'', amc:false, amcNumero:'', amcObservation:'' };
  benefits = [{name:'Carte Fondation',detail:'Avantages Fondation Hassan II',icon:'◈',active:true},{name:'Carte Fraternelle',detail:'Adhésion et cotisation active',icon:'♥',active:true},{name:'Carte Prière C.V.R.',detail:'Service d’accompagnement',icon:'✦',active:false},{name:'Colis Ramadan',detail:'Éligibilité annuelle',icon:'□',active:true}];
  requests = [{title:'Mise à jour de la fiche administrative',date:'28/08/2026',pieces:4,status:'À valider'},{title:'Demande de carte fraternelle',date:'11/07/2026',pieces:3,status:'Validée'}];
  history = [{title:'Fiche créée',detail:'Création du dossier RET-2026-0142',date:'28/08/2026'},{title:'Pièces vérifiées',detail:'Documents administratifs contrôlés.',date:'29/08/2026'}];
  constructor(private route: ActivatedRoute, private readonly store: RetraitesStoreService, private readonly adherentsService: AdherentsService, private readonly router: Router) {}
  ngOnInit(){
    this.isNewDossier = !!this.route.snapshot.data['newDossier'];
    this.readOnly = this.route.snapshot.queryParamMap.get('consultation') === 'true';
    this.validationMode = this.route.snapshot.queryParamMap.get('validation') === 'true';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.dossierId = id;
      this.store.get(id).subscribe({ next: dossier => {
        this.readOnly = this.readOnly || dossier.traite || this.store.isClosed(dossier);
        const names = dossier.nom.trim().split(/\s+/);
        this.profile = { ...this.profile, dossier: dossier.reference, prenom: names.shift() || '', nom: names.join(' '), matricule: dossier.matricule, situation: dossier.situation };
        if (dossier.details) {
          this.profile = { ...this.profile, ...dossier.details.profile, dossier: dossier.reference } as typeof this.profile;
          this.family = dossier.details.family as Person[];
          this.benefits = dossier.details.benefits as typeof this.benefits;
          this.requests = dossier.details.requests as typeof this.requests;
          this.history = dossier.details.history as typeof this.history;
          this.membership = { ...this.membership, ...dossier.details.membership } as typeof this.membership;
          const extra = dossier.details as typeof dossier.details & { socialData?: SocialEntry[]; assistances?: AssistanceEntry[]; resources?: BudgetEntry[]; charges?: BudgetEntry[] };
          this.socialData = extra.socialData || [];
          this.assistances = extra.assistances || [];
          this.resources = extra.resources || this.resources;
          this.charges = extra.charges || this.charges;
        }
        this.loadPhoto();
      }, error: () => this.note('Impossible de charger ce dossier depuis le serveur.') });
    } else {
      this.store.list().subscribe();
    }
    this.route.paramMap.subscribe(p=>{const f=p.get('feature');this.tab=({demandes:'dossier',pieces:'dossier',historique:'historique',dossiers:'fiche'} as Record<string,Tab>)[f||'']||'fiche';});
  }
  get completion(){return Math.round([this.profile.prenom,this.profile.nom,this.profile.cin,this.profile.matricule,this.profile.tel,this.profile.adresse].filter(Boolean).length/6*100);}
  get isSingle(){return String(this.profile.situation).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() === 'celibataire';}
  onSituationChange(){if(this.isSingle) this.familyAction='';}
  setHabitation(choice: 'proprietaire' | 'locataire', checked: boolean) {
    this.profile[choice] = checked;
    if (checked) this.profile[choice === 'proprietaire' ? 'locataire' : 'proprietaire'] = false;
  }
  toggleAffiliation(card: 'carteSpeciale' | 'carteFraternelleAdherent' | 'amc', checked: boolean) {
    this.membership[card] = checked;
    if (checked) return;
    if (card === 'carteSpeciale') { this.membership.carteSpecialeNumero = ''; this.membership.carteSpecialeObservation = ''; }
    if (card === 'carteFraternelleAdherent') { this.membership.carteFraternelle = ''; this.membership.carteFraternelleObservation = ''; }
    if (card === 'amc') { this.membership.amcNumero = ''; this.membership.amcObservation = ''; }
  }
  openFamilyForm(){if(this.familyAction){this.addPerson(this.familyAction);this.familyAction='';}}
  addPerson(type:Person['type']){if(this.isSingle && type !== 'Membre de famille'){this.note('Pour une situation célibataire, l’ajout d’un conjoint ou d’un enfant est indisponible.');return;}this.editing={id:Date.now(),type,nom:'',prenom:'',naissance:'',cin:'',lien:type==='Conjoint'?'Conjoint':type==='Enfant'?'Enfant':'',charge:false};this.editingNewMember=true;this.memberError='';this.memberSubmitted=false;}
  editPerson(person:Person){this.editing={...person};this.editingNewMember=false;this.memberError='';this.memberSubmitted=false;}
  remove(id:number){this.family=this.family.filter(p=>p.id!==id);this.addHistory('Membre de famille supprimé');}
  cancelMember(){this.editing=null;this.memberError='';this.memberSubmitted=false;}
  saveMember(){
    if(!this.editing) return;
    this.memberSubmitted=true;
    if(!this.editing.nom.trim() || !this.editing.prenom.trim() || !this.editing.naissance || !this.editing.lien.trim()) { this.memberError='Veuillez compléter tous les champs obligatoires.'; return; }
    if(this.editingNewMember) this.family.push(this.editing);
    else this.family=this.family.map(person=>person.id===this.editing!.id ? this.editing! : person);
    this.cancelMember();this.addHistory('Informations familiales mises à jour');this.note('Informations familiales enregistrées');
  }
  save(){
    if (this.readOnly) return;
    const missing = [this.profile.prenom, this.profile.nom, this.profile.cin, this.profile.matricule, this.profile.tel].some(value => !String(value).trim());
    if (missing) { this.note('Veuillez renseigner tous les champs obligatoires marqués d’un astérisque.'); return; }
    if (this.isNewDossier && !this.dossierId) {
      this.store.create(this.dossierDetails()).subscribe({ next: dossier => {
        this.dossierId = dossier.id; this.profile.dossier = dossier.reference; this.isNewDossier = false;
        this.note('Dossier enregistré dans la base de données'); this.router.navigate(['/retraites/dashboard']);
      }, error: () => this.note('Impossible d’enregistrer le dossier. Vérifiez le backend.') });
      return;
    }
    this.addHistory('Fiche administrative mise à jour');
    if (this.dossierId) this.store.saveDetails(this.dossierId, this.dossierDetails()).subscribe({ next: () => this.note('Modifications enregistrées dans la base de données'), error: () => this.note('Impossible d’enregistrer les modifications.') });
  }
  validateAndClose(){
    if (this.readOnly) return;
    if (!this.dossierId) {
      this.store.create(this.dossierDetails()).subscribe({
        next: dossier => { this.dossierId = dossier.id; this.profile.dossier = dossier.reference; this.closeDossier(dossier.id); },
        error: () => this.note('Impossible de créer le dossier. Vérifiez le backend.')
      });
      return;
    }
    this.store.saveDetails(this.dossierId, this.dossierDetails()).subscribe({ next: () => this.closeDossier(this.dossierId!), error: () => this.note('Impossible d’enregistrer avant la clôture.') });
  }
  private closeDossier(id: number) { this.store.close(id).subscribe({ next: () => this.router.navigate(['/retraites/validation']), error: () => this.note('Impossible de clôturer le dossier.') }); }
  cancelValidation(){ this.router.navigate(['/retraites/validation']); }
  closeConsultation(){ this.router.navigate(['/retraites/dashboard']); }
  cancelNewDossier(){
    if (this.hasDraftChanges() && !window.confirm('Abandonner les modifications non enregistrées ?')) return;
    this.selectedAdherent=null;
    this.adherentResults=[];
    this.adherentSearch='';
    this.draftSnapshot='';
  }
  searchAdherents(){
    clearTimeout(this.searchTimer);
    const search = this.adherentSearch.trim();
    if (!search) { this.adherentResults=[]; this.searching=false; this.searchError=''; return; }
    this.searching=true;
    this.searchError='';
    this.searchTimer=setTimeout(()=>this.adherentsService.list(search,0,10).subscribe({next:page=>{this.adherentResults=page.content;this.searching=false;},error:()=>{this.adherentResults=[];this.searching=false;this.searchError='Impossible de charger les adhérents. Vérifiez que le backend est démarré et reconnectez-vous.';}}),300);
  }
  selectAdherent(adherent: AdherentResponse){
    const dossier = this.existingDossier(adherent);
    if (dossier) {
      if (this.store.isClosed(dossier)) { this.note('Ce dossier est validé et clôturé : il n’est plus accessible.'); return; }
      this.router.navigate(['/module/retraites/dossier', dossier.id]);
      return;
    }
    this.selectedAdherent=adherent;
    this.profile={...this.profile,dossier:`RET-${new Date().getFullYear()}-NOUVEAU`,adherentId:adherent.id,prenom:adherent.prenomAr,nom:adherent.nomAr,prenomAr:adherent.prenomAr,nomAr:adherent.nomAr,naissance:adherent.dateNaissance || '',lieu:adherent.lieuNaissance || '',cin:adherent.cin || '',situation:adherent.situationCategorie || '',matricule:adherent.matriculeBR || '',corps:adherent.matricule || '',grade:adherent.grade || '',categorie:adherent.categorie || '',radiation:adherent.dateRadiation || '',motif:adherent.motifRadiation || '',pension:adherent.pension,unite:adherent.dernierUnite || '',formation:adherent.formationUnite || '',tel:adherent.telephone1 || '',tel2:adherent.telephone2 || '',email:adherent.email || '',adresse:adherent.adresse || '',observation:''};
    this.adherentResults=[];
    this.loadPhoto();
    this.draftSnapshot = this.currentDraftSnapshot();
    this.note('Données de l’adhérent chargées. Complétez uniquement les champs manquants.');
  }
  private currentDraftSnapshot(): string { return JSON.stringify({ profile: this.profile, family: this.family, benefits: this.benefits, requests: this.requests }); }
  private hasDraftChanges(): boolean { return this.draftSnapshot !== this.currentDraftSnapshot(); }
  existingDossier(adherent: AdherentResponse): RetraiteDossier | undefined {
    const matricule = adherent.matriculeBR || adherent.matricule;
    if (!matricule) return undefined;
    return this.store.all().find(dossier => dossier.matricule === matricule);
  }
  isClosedDossier(dossier?: RetraiteDossier): boolean { return !!dossier && this.store.isClosed(dossier); }
  onPhotoSelected(event: Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { this.note('Veuillez sélectionner une image.'); return; }
    if (file.size > 2 * 1024 * 1024) { this.note('La photo ne doit pas dépasser 2 Mo.'); return; }
    const reader = new FileReader();
    reader.onload = () => { this.photoUrl = String(reader.result); try { localStorage.setItem(this.photoStorageKey(), this.photoUrl); this.note('Photo de l’adhérent enregistrée.'); } catch { this.note('Impossible d’enregistrer la photo sur cet appareil.'); } };
    reader.readAsDataURL(file);
  }
  private loadPhoto(){ this.photoUrl = localStorage.getItem(this.photoStorageKey()) || ''; }
  private photoStorageKey(){ return `service-social-adherent-photo-${this.profile.matricule || this.dossierId || 'nouveau'}`; }
  private dossierDetails(){ return { profile: { ...this.profile }, family: this.family, benefits: this.benefits, requests: this.requests, history: this.history, membership: this.membership, socialData: this.socialData, assistances: this.assistances, resources: this.resources, charges: this.charges }; }
  newProfile(reference = `RET-${new Date().getFullYear()}-NOUVEAU`){this.isNewDossier=true;this.profile={...this.profile,dossier:reference,prenom:'',nom:'',cin:'',matricule:'',tel:'',adresse:''};this.tab='fiche';this.note('Nouvelle fiche prête à être renseignée');}
  addRequest(){this.requests.unshift({title:'Nouvelle demande administrative',date:new Date().toLocaleDateString('fr-FR'),pieces:0,status:'En cours'});this.addHistory('Nouvelle demande créée');}
  validate(r:{title:string;status:string}){r.status='Validée';this.addHistory('Demande validée : '+r.title);}
  addHistory(title:string){this.history.unshift({title,detail:`Dossier ${this.profile.dossier}`,date:new Date().toLocaleDateString('fr-FR')});}
  addSocialData(){ if (this.socialData.some(item => !item.confirmed)) { this.note('Validez ou supprimez la donnée médico-sociale en cours avant d’en ajouter une autre.'); return; } this.socialData.push({ id: Date.now(), identification: '', diagnostic: '', duree: '', confirmed: false }); }
  removeSocialData(id:number){ this.socialData=this.socialData.filter(item=>item.id!==id); }
  validateSocialData(item: SocialEntry){ if (!item.identification.trim() || !item.diagnostic.trim()) { this.note('Complétez l’identification et le diagnostic avant de valider.'); return; } item.confirmed = true; }
  editSocialData(item: SocialEntry){ item.confirmed = false; }
  addAssistance(){ if (this.assistances.some(item => !item.confirmed)) { this.note('Validez ou supprimez l’assistance en cours avant d’en ajouter une autre.'); return; } this.assistances.push({ id: Date.now(), nature: '', organisme: '', date: '', observation: '', confirmed: false }); }
  removeAssistance(id:number){ this.assistances=this.assistances.filter(item=>item.id!==id); }
  validateAssistance(item: AssistanceEntry){ if (!item.nature.trim() || !item.organisme.trim() || !item.date) { this.note('Complétez la nature, l’organisme et la date avant de valider.'); return; } item.confirmed = true; }
  editAssistance(item: AssistanceEntry){ item.confirmed = false; }
  total(rows: BudgetEntry[]){ return rows.reduce((sum,row)=>sum+(Number(String(row.montant).replace(',','.'))||0),0); }
  exportForm(){
    const printable = document.getElementById('social-survey-form')?.cloneNode(true) as HTMLElement | undefined;
    if (!printable) return;
    const popup=window.open('','_blank','width=1050,height=800');
    if (!popup) { this.note('Autorisez les fenêtres contextuelles pour exporter la fiche.'); return; }
    printable.querySelectorAll('button').forEach(button=>button.remove());
    printable.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach(field=>{
      const value=field instanceof HTMLInputElement && field.type==='checkbox' ? (field.checked ? 'Oui' : 'Non') : field.value;
      const text=document.createElement('span'); text.className='print-value'; text.textContent=value || '—'; field.replaceWith(text);
    });
    popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Fiche d’enquête sociale</title><style>body{font:12px Arial;margin:15mm;color:#111}.print-header{display:block!important}.print-header h1,.print-header h2{text-align:center;margin:3px}.print-header h1{font-size:20px}.print-header h2{font-size:14px}.survey-section{page-break-inside:avoid}table{width:100%;border-collapse:collapse;margin:6px 0 12px}th,td{border:1px solid #222;padding:5px}.print-value{display:block;min-height:16px;padding:2px 0;border-bottom:1px dotted #777}.btn{display:none}@media print{body{margin:8mm}}</style></head><body>${printable.outerHTML}</body></html>`);
    popup.document.close(); popup.focus(); setTimeout(()=>popup.print(),250);
  }
  private note(text:string){this.message=text;setTimeout(()=>this.message='',3000);}
}
