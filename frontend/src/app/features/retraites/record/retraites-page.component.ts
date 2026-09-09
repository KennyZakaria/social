import { SimpleDatePipe } from './simple-date.pipe';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RetraitePiece, RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';
import { AdherentsService } from '../../adherents/services/adherents.service';
import { AdherentResponse } from '../../../core/models/models';

type Tab = 'fiche' | 'famille' | 'dossier' | 'historique';
interface Person { lieuTravail?: string; situationFamiliale?: string; id: number; type: 'Conjoint' | 'Enfant' | 'Membre de famille'; nom: string; prenom: string; naissance: string; cin: string; lien: string; charge: boolean; lieu?: string; fonction?: string; mutuelle?: string; mariage?: string; divorce?: string; niveauInstruction?: string; emploi?: string; }
interface SocialEntry { id: number; identification: string; diagnostic: string; duree: string; confirmed: boolean; }
interface AssistanceEntry { id: number; nature: string; organisme: string; date: string; observation: string; confirmed: boolean; }
interface BudgetEntry { designation: string; montant: string; }

@Component({
  selector: 'app-retraites-page',
  imports: [SimpleDatePipe, CommonModule, FormsModule],
  templateUrl: './retraites-page.component.html',
  styleUrl: './retraites-page.component.css',
  styles: ['.actions > button:first-child { display: none; }.budget-input{width:100%;border-collapse:collapse}.budget-input th,.budget-input td{padding:.7rem;border-bottom:1px solid var(--border);text-align:left;font-size:.78rem}.budget-input th{background:var(--surface-2);color:var(--text-2);font-weight:700}.budget-input input{width:100%;box-sizing:border-box;border:1px solid var(--border);border-radius:6px;padding:.45rem;background:var(--surface)}']
})
export class RetraitesPageComponent implements OnInit, OnDestroy {
  leaveDraftDialogOpen = false;
  leaveDraftMessage = '';
  private leaveDraftResolver?: (leave: boolean) => void;
  successDialogOpen = false;
  successDialogTitle = '';
  successDialogMessage = '';
  private successRedirect: string[] = [];
  private allowSuccessNavigation = false;
  private successTimer?: ReturnType<typeof setTimeout>;
  pieces: RetraitePiece[] = [];
  readonly pieceTypes = ['Copie carte mutuelle', 'Copie certificat de propriété', 'Copie CIN', 'Attestation de pension', 'Acte de mariage', 'Acte de décès', 'Certificat médical', 'Autre document'];
  hasPiece(type: string) { return this.pieces.some(p => p.type === type); }
  togglePiece(type: string, checked: boolean) {
    if (this.readOnly) return;
    if (checked && !this.hasPiece(type)) this.pieces.push({type, quantite:1, nom:'', mime:'', contenu:''});
    if (!checked) this.pieces = this.pieces.filter(p => p.type !== type);
  }
  tab: Tab = 'fiche'; message = ''; editing: Person | null = null; memberError = ''; memberSubmitted = false; private editingNewMember = false; isNewDossier = false; readOnly = false; validationMode = false;
  private dossierId?: number;
  selectedAdherent: AdherentResponse | null = null;
  photoUrl = '';
  saving = false;
  photoLoading = false;
  adherentSearch = '';
  adherentResults: AdherentResponse[] = [];
  searching = false;
  searchError = '';
  private draftSnapshot = '';
  private searchTimer?: ReturnType<typeof setTimeout>;
  profile: any = { dossier: '', prenom: '', nom: '', naissance: '', cin: '', situation: '', matricule: '', grade: '', tel: '', adresse: '', proprietaire: false, locataire: false };
  socialData: SocialEntry[] = [];
  assistances: AssistanceEntry[] = [];
  resources: BudgetEntry[] = [{ designation: 'Pension de retraite', montant: '' }, { designation: 'Pension de réforme', montant: '' }, { designation: 'Autres ressources', montant: '' }];
  charges: BudgetEntry[] = [{ designation: 'Crédit logement', montant: '' }, { designation: 'Eau / électricité', montant: '' }, { designation: 'Frais médicaux', montant: '' }, { designation: 'Frais de scolarité', montant: '' }, { designation: 'Autres (loyer, crédit, consommation)', montant: '' }];
  familyAction: Person['type'] | '' = '';
  family: Person[] = [];
  membership = { carteFraternelle:'', numeroDossier:'', cartePrelevementCmr:'', situationFraternelle:'', anneeAdhesion:'', modeReglement:'', numeroRecu:'', datePaiement:'', avecPhoto:false, observation:'', carteSpeciale:false, carteSpecialeNumero:'', carteSpecialeObservation:'', carteFraternelleAdherent:false, carteFraternelleObservation:'', amc:false, amcNumero:'', amcObservation:'' };
  benefits: { name: string; detail: string; icon: string; active: boolean }[] = [];
  requests: { title: string; date: string; pieces: number; status: string }[] = [];
  history: { title: string; detail: string; date: string }[] = [];
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
          this.photoUrl = dossier.details.photo ?? '';
          this.pieces = dossier.details.pieces ?? [];
          this.family = dossier.details.family as Person[];
          this.benefits = dossier.details.benefits as typeof this.benefits;
          this.requests = dossier.details.requests as typeof this.requests;
          this.history = dossier.details.history as typeof this.history;
          this.membership = { ...this.membership, ...dossier.details.membership } as typeof this.membership;
          const extra = dossier.details as typeof dossier.details & { socialData?: SocialEntry[]; assistances?: AssistanceEntry[]; resources?: BudgetEntry[]; charges?: BudgetEntry[] };
          this.socialData = extra.socialData || [];
          this.assistances = extra.assistances || [];
          this.resources = extra.resources || this.resources;
          this.charges = extra.charges?.length ? extra.charges : this.charges;
          this.ensureSchoolCharge();
        }
        this.loadPhoto();
        this.captureNavigationSnapshot();
      }, error: () => this.note('Impossible de charger ce dossier depuis le serveur.') });
    } else {
      this.store.list().subscribe({ error: () => this.note('Impossible de charger les dossiers existants.') });
    }
    this.route.paramMap.subscribe(p=>{const f=p.get('feature');this.tab=({demandes:'dossier',pieces:'dossier',historique:'historique',dossiers:'fiche'} as Record<string,Tab>)[f||'']||'fiche';});
  }
  readonly manualOptions: Record<string, string[]> = {"natureDeces": ["Naturel", "Accidentel", "Autre"], "region": ["Rabat", "Casablanca", "F\u00e8s", "Marrakech", "Tanger", "Agadir", "Oujda", "Autre"], "colisRamadan": ["Oui", "Non"], "regionResidence": ["Tanger-T\u00e9touan-Al Hoce\u00efma", "Oriental", "F\u00e8s-Mekn\u00e8s", "Rabat-Sal\u00e9-K\u00e9nitra", "B\u00e9ni Mellal-Kh\u00e9nifra", "Casablanca-Settat", "Marrakech-Safi", "Dr\u00e2a-Tafilalet", "Souss-Massa", "Guelmim-Oued Noun", "La\u00e2youne-Sakia El Hamra", "Dakhla-Oued Ed-Dahab", "Autre"], "hayRabat": ["Agdal", "Hassan", "Hay Riad", "Yacoub El Mansour", "Youssoufia", "Oc\u00e9an", "Autre"], "situationFraternelle": ["Adh\u00e9rent", "Non adh\u00e9rent", "Autre"], "modeReglement": ["Pr\u00e9l\u00e8vement", "Virement", "Ch\u00e8que", "Esp\u00e8ces", "Autre"], "niveauInstruction": ["Sans instruction", "Primaire", "Coll\u00e8ge", "Lyc\u00e9e", "Sup\u00e9rieur", "Formation professionnelle", "Autre"], "lien": ["Conjoint", "Enfant", "P\u00e8re", "M\u00e8re", "Fr\u00e8re", "S\u0153ur", "Autre"]};
  manualChoices(field: string, value: string | undefined): string[] {
    return [...new Set([...(this.manualOptions[field] || []), ...(value ? [value] : [])])];
  }
  get completion(){return Math.round([this.profile.prenom,this.profile.nom,this.profile.cin,this.profile.matricule,this.profile.tel,this.profile.adresse].filter(Boolean).length/6*100);}
  get isSingle(){return String(this.profile.situation).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() === 'celibataire';}
  get isDeathDossier(){return !!this.profile.dateDeces;}
  private ensureSchoolCharge(){
    if (this.charges.some(item => item.designation === 'Frais de scolarité')) return;
    const otherIndex = this.charges.findIndex(item => item.designation === 'Autres (loyer, crédit, consommation)');
    this.charges.splice(otherIndex < 0 ? this.charges.length : otherIndex, 0, { designation: 'Frais de scolarité', montant: '' });
  }
  onSituationChange(){if(this.isSingle) this.familyAction='';}
  setHabitation(choice: 'proprietaire' | 'locataire', checked: boolean) {
    this.profile[choice] = checked;
    if (checked) this.profile[choice === 'proprietaire' ? 'locataire' : 'proprietaire'] = false;
    this.note(checked ? `Habitation mise à jour : ${choice === 'proprietaire' ? 'propriétaire' : 'locataire'}` : 'Habitation mise à jour');
  }
  toggleAffiliation(card: 'carteSpeciale' | 'carteFraternelleAdherent' | 'amc', checked: boolean) {
    this.membership[card] = checked;
    if (checked) { this.note('Affiliation activée'); return; }
    if (card === 'carteSpeciale') { this.membership.carteSpecialeNumero = ''; this.membership.carteSpecialeObservation = ''; }
    if (card === 'carteFraternelleAdherent') { this.membership.carteFraternelle = ''; this.membership.carteFraternelleObservation = ''; }
    if (card === 'amc') { this.membership.amcNumero = ''; this.membership.amcObservation = ''; }
    this.note('Affiliation retirée');
  }
  openFamilyForm(){if(this.familyAction){this.addPerson(this.familyAction);this.familyAction='';}}
  addPerson(type:Person['type']){if(this.isSingle && type !== 'Membre de famille'){this.note('Pour une situation célibataire, l’ajout d’un conjoint ou d’un enfant est indisponible.');return;}this.editing={id:Date.now(),type,nom:'',prenom:'',naissance:'',cin:'',lien:type==='Conjoint'?'Conjoint':type==='Enfant'?'Enfant':'',charge:false};this.editingNewMember=true;this.memberError='';this.memberSubmitted=false;}
  editPerson(person:Person){this.editing={...person};this.editingNewMember=false;this.memberError='';this.memberSubmitted=false;this.note('Membre de famille ouvert en modification');}
  remove(id:number){this.family=this.family.filter(p=>p.id!==id);this.addHistory('Membre de famille supprimé');this.note('Membre de famille supprimé');}
  cancelMember(){this.editing=null;this.memberError='';this.memberSubmitted=false;}
  saveMember(){
    if(!this.editing) return;
    this.memberSubmitted=true;
    if(!this.editing.nom.trim() || !this.editing.prenom.trim() || !this.editing.naissance || !this.editing.lien.trim()) { this.memberError='Veuillez compléter tous les champs obligatoires.'; return; }
    if(this.editingNewMember) this.family.push(this.editing);
    else this.family=this.family.map(person=>person.id===this.editing!.id ? this.editing! : person);
    this.cancelMember();this.addHistory('Informations familiales mises à jour');this.note('Informations familiales enregistrées');
  }
  private canSave(): boolean {
    if (this.readOnly || this.saving || this.photoLoading) return false;
    if ([this.profile.prenom, this.profile.nom, this.profile.cin, this.profile.matricule, this.profile.tel].some(value => !String(value ?? '').trim())) {
      this.note('Renseignez le nom, le prenom, la CIN, le matricule et le telephone.'); return false;
    }
    if (!this.dossierId && !this.selectedAdherent) { this.note('Selectionnez un adherent.'); return false; }
    if (this.editing || this.socialData.some(x => !x.confirmed) || this.assistances.some(x => !x.confirmed)) {
      this.note('Validez ou annulez les lignes en cours avant de continuer.'); return false;
    }
    if (this.pieces.some(p => !Number.isInteger(p.quantite) || p.quantite < 1)) {
      this.note('La quantite doit etre un entier superieur ou egal a 1.'); return false;
    }
    if ([...this.resources, ...this.charges].some(x => {
      const value = String(x.montant ?? '').trim().replace(',', '.');
      return !x.designation.trim() || (value !== '' && (!/^\d+(\.\d{1,2})?$/.test(value) || Number(value) > 9999999999.99));
    })) { this.note('Saisissez des montants positifs ou nuls avec au maximum deux decimales.'); return false; }
    return true;
  }
  private saveError(error: any, fallback: string): void {
    this.note(typeof error?.error?.message === 'string' ? error.error.message : fallback);
  }
  save(){
    if (!this.canSave()) return;
    this.saving = true;
    const operation = this.dossierId ? this.store.saveDetails(this.dossierId, this.dossierDetails()) : this.store.create(this.dossierDetails());
    operation.pipe(finalize(() => this.saving = false)).subscribe({ next: dossier => {
      this.dossierId = dossier.id; this.profile.dossier = dossier.reference; this.isNewDossier = false;
      this.history = dossier.details?.history as typeof this.history ?? [];
      this.captureNavigationSnapshot();
      this.showSuccessDialog('Dossier enregistre', 'Le dossier a ete enregistre avec succes.', ['/retraites/dossiers']);
    }, error: error => this.saveError(error, 'Impossible d enregistrer le dossier.') });
  }
  validateAndClose(){
    if (!this.canSave()) return;
    this.saving = true;
    const operation = this.dossierId ? this.store.saveDetails(this.dossierId, this.dossierDetails()) : this.store.create(this.dossierDetails());
    operation.subscribe({ next: dossier => {
      this.dossierId = dossier.id; this.profile.dossier = dossier.reference; this.isNewDossier = false;
      this.history = dossier.details?.history as typeof this.history ?? [];
      this.captureNavigationSnapshot();
      this.closeDossier(dossier.id);
    }, error: error => { this.saving = false; this.saveError(error, 'Impossible d enregistrer avant la cloture.'); } });
  }
  private closeDossier(id: number) {
    this.store.close(id).pipe(finalize(() => this.saving = false)).subscribe({ next: dossier => {
      this.readOnly = true; this.validationMode = false;
      this.history = dossier.details?.history as typeof this.history ?? [];
      this.captureNavigationSnapshot();
      this.showSuccessDialog('Dossier valide et cloture', 'Le dossier a ete valide et cloture avec succes.', ['/retraites/validation']);
    }, error: error => this.saveError(error, 'Impossible de cloturer le dossier.') });
  }
  ngOnDestroy(): void { clearTimeout(this.successTimer); clearTimeout(this.searchTimer); }
  cancelValidation(){ this.router.navigate(['/retraites/validation']); }
  returnToDossiers(){ this.router.navigate(['/retraites/dossiers']); }
  closeConsultation(){ this.router.navigate(['/retraites/dashboard']); }
  confirmLeaveDraft(): boolean | Promise<boolean> {
    if (this.saving || this.photoLoading) return false;
    if (this.allowSuccessNavigation) return true;
    const isCreation = this.isNewDossier && !!this.selectedAdherent;
    const isValidation = this.validationMode && !this.readOnly;
    const hasUnsavedChanges = !!this.dossierId && !!this.draftSnapshot && this.hasDraftChanges();
    if (!isCreation && !isValidation && !hasUnsavedChanges) return true;
    this.leaveDraftMessage = isCreation
      ? 'Le dossier en cours de création sera perdu.'
      : isValidation
        ? 'La validation de ce dossier ne sera pas terminée.'
        : 'Les modifications non enregistrées seront perdues.';
    this.leaveDraftDialogOpen = true;
    return new Promise(resolve => this.leaveDraftResolver = resolve);
  }
  continueDraftCreation(): void {
    this.leaveDraftDialogOpen = false;
    this.leaveDraftResolver?.(false);
    this.leaveDraftResolver = undefined;
  }
  discardDraftAndLeave(): void {
    this.leaveDraftDialogOpen = false;
    this.leaveDraftResolver?.(true);
    this.leaveDraftResolver = undefined;
  }
  private showSuccessDialog(title: string, message: string, redirect: string[]): void {
    clearTimeout(this.successTimer);
    this.successDialogTitle = title;
    this.successDialogMessage = message;
    this.successRedirect = redirect;
    this.successDialogOpen = true;
    this.successTimer = setTimeout(() => this.continueAfterSuccess(), 1500);
  }
  private continueAfterSuccess(): void {
    clearTimeout(this.successTimer);
    this.successDialogOpen = false;
    this.allowSuccessNavigation = true;
    this.router.navigate(this.successRedirect);
  }
  cancelNewDossier(){
    if (this.saving || this.photoLoading) return;
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
  private prefillAdherent(adherent: AdherentResponse): void {
    this.profile = { ...this.profile,
      adherentId: adherent.id,
      prenom: adherent.prenomAr ?? '',
      nom: adherent.nomAr ?? '',
      prenomAr: adherent.prenomAr ?? '',
      nomAr: adherent.nomAr ?? '',
      naissance: adherent.dateNaissance ?? '',
      lieu: adherent.lieuNaissance ?? '',
      cin: adherent.cin ?? '',
      situationCategorie: adherent.situationCategorie ?? '',
      dateDeces: adherent.dateDeces ?? '',
      causeDeces: adherent.causeDeces ?? '',
      matricule: adherent.matriculeBR ?? '',
      corps: adherent.matricule ?? '',
      grade: adherent.grade ?? '',
      categorie: adherent.categorie ?? '',
      radiation: adherent.dateRadiation ?? '',
      motif: adherent.motifRadiation ?? '',
      pension: adherent.pension,
      unite: adherent.dernierUnite ?? '',
      formation: adherent.formationUnite ?? '',
      tel: adherent.telephone1 ?? '',
      tel2: adherent.telephone2 ?? '',
      email: adherent.email ?? '',
      adresse: adherent.adresse ?? '',
    };
  }
  private loadDeathDetails(adherentId: number): void {
    this.store.deathDetails(adherentId).subscribe({
      next: details => { if (this.profile.adherentId !== adherentId) return; this.profile = { ...this.profile,
        dateDeces: details.dateDeces ?? this.profile.dateDeces,
        causeDeces: details.causeDeces ?? this.profile.causeDeces,
        natureDeces: details.natureDeces ?? ''
      }; },
      error: () => undefined
    });
  }
  selectAdherent(adherent: AdherentResponse){
    if (this.saving) return;
    const dossier = this.existingDossier(adherent);
    if (dossier) {
      this.note(this.store.isClosed(dossier)
        ? 'Un dossier validé et clôturé existe déjà pour cet adhérent.'
        : 'Un dossier est déjà créé pour cet adhérent et attend son traitement.');
      return;
    }
    this.photoUrl = ''; this.family = []; this.socialData = []; this.assistances = []; this.history = [];
    this.editing = null;
    this.resources = this.resources.map(x => ({ ...x, montant: '' }));
    this.charges = this.charges.map(x => ({ ...x, montant: '' }));
    this.membership = Object.fromEntries(Object.entries(this.membership).map(([key, value]) => [key, typeof value === 'boolean' ? false : ''])) as typeof this.membership;
    this.profile = { dossier: '', prenom: '', nom: '', situation: '', proprietaire: false, locataire: false };
    this.selectedAdherent=adherent;
    this.pieces = [];
    this.profile = {...this.profile, dossier:`RET-${new Date().getFullYear()}-NOUVEAU`, situation:'', region:'', natureDeces:'', motifRadiationSanction:'', adresseEM:'', code:'', entree:'', dateEnquete:'', observation:''};
    this.prefillAdherent(adherent);
    this.loadDeathDetails(adherent.id);
    this.adherentsService.get(adherent.id).subscribe({
      next: freshAdherent => {
        if (this.selectedAdherent?.id !== freshAdherent.id) return;
        this.selectedAdherent = freshAdherent;
        this.prefillAdherent(freshAdherent);
        this.loadDeathDetails(freshAdherent.id);
      },
      error: () => undefined
    });
    this.adherentResults=[];
    this.loadPhoto();
    this.draftSnapshot = this.currentDraftSnapshot();
    this.note('Données de l’adhérent chargées. Complétez uniquement les champs manquants.');
  }
  private currentDraftSnapshot(): string { return JSON.stringify({ ...this.dossierDetails(), editing: this.editing }); }
  private hasDraftChanges(): boolean { return !!this.draftSnapshot && this.draftSnapshot !== this.currentDraftSnapshot(); }
  private captureNavigationSnapshot(): void { this.draftSnapshot = this.currentDraftSnapshot(); }
  existingDossier(adherent: AdherentResponse): RetraiteDossier | undefined {
    const matricule = adherent.matriculeBR || adherent.matricule;
    if (!matricule) return undefined;
    return this.store.all().find(dossier => dossier.details?.profile['adherentId'] === adherent.id || dossier.matricule === matricule);
  }
  isClosedDossier(dossier?: RetraiteDossier): boolean { return !!dossier && this.store.isClosed(dossier); }
  hasExistingDossier(dossier?: RetraiteDossier): boolean { return !!dossier; }
  onPhotoSelected(event: Event){
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || this.readOnly || this.saving) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { this.note('Veuillez sélectionner une image.'); return; }
    if (file.size > 2 * 1024 * 1024) { this.note('La photo ne doit pas dépasser 2 Mo.'); return; }
    const reader = new FileReader();
    this.photoLoading = true;
    reader.onload = () => { this.photoUrl = String(reader.result); this.photoLoading = false; this.note('Photo selectionnee. Cliquez sur Enregistrer pour la conserver.'); };
    reader.onerror = () => { this.photoLoading = false; this.note('Impossible de lire la photo.'); };
    reader.readAsDataURL(file);
  }
  private loadPhoto(){ if (!this.photoUrl) { try { this.photoUrl = localStorage.getItem(this.photoStorageKey()) || ''; } catch { /* Local storage may be disabled. */ } } }
  private photoStorageKey(){ return `service-social-adherent-photo-${this.profile.matricule || this.dossierId || 'nouveau'}`; }
  private dossierDetails(){ return { photo: this.photoUrl, pieces: this.pieces, profile: { ...this.profile }, family: this.family, benefits: this.benefits, requests: this.requests, history: this.history, membership: this.membership, socialData: this.socialData, assistances: this.assistances, resources: this.resources, charges: this.charges }; }
  newProfile(reference = `RET-${new Date().getFullYear()}-NOUVEAU`){this.isNewDossier=true;this.profile={...this.profile,dossier:reference,prenom:'',nom:'',cin:'',matricule:'',tel:'',adresse:''};this.tab='fiche';this.note('Nouvelle fiche prête à être renseignée');}
  addRequest(){this.requests.unshift({title:'Nouvelle demande administrative',date:new Date().toLocaleDateString('fr-FR'),pieces:0,status:'En cours'});this.addHistory('Nouvelle demande créée');}
  validate(r:{title:string;status:string}){r.status='Validée';this.addHistory('Demande validée : '+r.title);}
  addHistory(title:string){this.history.unshift({title,detail:`Dossier ${this.profile.dossier}`,date:new Date().toLocaleDateString('fr-FR')});}
  private socialDrafts = new Map<number, SocialEntry>();
  private assistanceDrafts = new Map<number, AssistanceEntry>();
  cancelSocialData(item: SocialEntry){
    const original = this.socialDrafts.get(item.id);
    if (original) Object.assign(item, original); else this.removeSocialData(item.id);
    this.socialDrafts.delete(item.id);
  }
  cancelAssistance(item: AssistanceEntry){
    const original = this.assistanceDrafts.get(item.id);
    if (original) Object.assign(item, original); else this.removeAssistance(item.id);
    this.assistanceDrafts.delete(item.id);
  }
  addSocialData(){ if (this.socialData.some(item => !item.confirmed)) { this.note('Validez ou supprimez la donnée médico-sociale en cours avant d’en ajouter une autre.'); return; } this.socialData.push({ id: Date.now(), identification: '', diagnostic: '', duree: '', confirmed: false }); this.note('Nouvelle donnée médico-sociale ajoutée'); }
  removeSocialData(id:number){ this.socialData=this.socialData.filter(item=>item.id!==id); this.note('Donnée médico-sociale supprimée'); }
  validateSocialData(item: SocialEntry){ if (!item.identification.trim() || !item.diagnostic.trim()) { this.note('Complétez l’identification et le diagnostic avant de valider.'); return; } item.confirmed = true; this.note('Donnée médico-sociale validée'); }
  editSocialData(item: SocialEntry){ this.socialDrafts.set(item.id, { ...item }); item.confirmed = false; this.note('Donnée médico-sociale ouverte en modification'); }
  addAssistance(){ if (this.assistances.some(item => !item.confirmed)) { this.note('Validez ou supprimez l’assistance en cours avant d’en ajouter une autre.'); return; } this.assistances.push({ id: Date.now(), nature: '', organisme: '', date: '', observation: '', confirmed: false }); this.note('Nouvelle assistance ajoutée'); }
  removeAssistance(id:number){ this.assistances=this.assistances.filter(item=>item.id!==id); this.note('Assistance supprimée'); }
  validateAssistance(item: AssistanceEntry){ if (!item.nature.trim() || !item.organisme.trim() || !item.date) { this.note('Complétez la nature, l’organisme et la date avant de valider.'); return; } item.confirmed = true; this.assistanceDrafts.delete(item.id); this.note('Assistance validée'); }
  editAssistance(item: AssistanceEntry){ this.assistanceDrafts.set(item.id, { ...item }); item.confirmed = false; this.note('Assistance ouverte en modification'); }
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
