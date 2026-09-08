import { Injectable } from '@angular/core';
import { RetraiteDossier } from './retraites-store.service';

type Entry = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class RetraitesExportService {
  export(dossier: RetraiteDossier): void {
    const popup = window.open('', '_blank', 'width=1050,height=800');
    if (!popup) return;
    const details = (dossier.details || {}) as RetraiteDossier['details'] & { socialData?: Entry[]; assistances?: Entry[]; resources?: Entry[]; charges?: Entry[] };
    const profile = details.profile || {};
    const membership = details.membership || {};
    const family = (details.family || []) as Entry[];
    const escape = (value: unknown) => String(value ?? '—').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
    const field = (key: string) => escape(profile[key]);
    const yesNo = (value: unknown) => value ? 'OUI' : 'NON';
    const rows = (items: Entry[], keys: string[], columns: number) => items.length
      ? items.map(item => `<tr>${keys.map(key => `<td>${escape(item[key] || '')}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columns}" class="blank">&nbsp;</td></tr>`;
    const spouse = family.filter(item => item['type'] === 'Conjoint');
    const children = family.filter(item => item['type'] === 'Enfant');
    const resources = details.resources || [];
    const charges = details.charges || [];
    const budgetRows = Array.from({ length: Math.max(resources.length, charges.length, 3) }, (_, index) => {
      const resource = resources[index] || {};
      const charge = charges[index] || {};
      return `<tr><td>${escape(resource['designation'] || '')}</td><td>${escape(resource['montant'] || '')}</td><td>${escape(charge['designation'] || '')}</td><td>${escape(charge['montant'] || '')}</td></tr>`;
    }).join('');
    const total = (items: Entry[]) => items.reduce((sum, item) => sum + (Number(String(item['montant'] || '').replace(',', '.')) || 0), 0);
    const exportDate = new Date().toLocaleDateString('fr-FR');

    popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>&#8203;</title><style>@page{size:A4;margin:0}body{box-sizing:border-box;margin:0;padding:10mm;font:11px Arial,sans-serif;color:#111}.top{display:flex;justify-content:space-between;font-weight:700;font-size:12px}.top span:last-child{text-align:right}h1,h2{text-align:center;margin:4px 0}h1{font-size:21px}h2{font-size:15px;margin-top:13px}.meta{margin:8px 0;font-weight:700}table{width:100%;border-collapse:collapse;margin:5px 0 11px}th,td{border:1px solid #222;padding:4px 5px;vertical-align:middle}th{background:#f6f6f6;font-family:Georgia,serif;font-style:italic;text-transform:uppercase}.label{width:18%;font-weight:700}.blank{height:17px}.total{font-weight:700;text-align:center;letter-spacing:3px}@media print{table{break-inside:avoid}}</style></head><body><div class="top"><span>ROYAUME DU MAROC</span><span>GENDARMERIE ROYALE<br>SERVICE SOCIAL<br>SECTION DES RETRAITÉS</span></div><h1>FICHE D’ENQUÊTE SOCIALE</h1><h2>(RETRAITE-REFORME)</h2><p class="meta">En date du : ${exportDate} &nbsp;&nbsp;&nbsp; MOTIF : ${field('motif')}</p><h2>IDENTIFICATION DU MILITAIRE</h2><table><tr><th class="label">Nom</th><td>${field('nom') || escape(dossier.nom)}</td><th class="label">Prénom</th><td>${field('prenom')}</td></tr><tr><th class="label">Grade</th><td>${field('grade')}</td><th class="label">Mle/CIN</th><td>${field('matricule') || escape(dossier.matricule)} / ${field('cin')}</td></tr><tr><th class="label">Date radiation</th><td>${field('radiation')}</td><th class="label">Situation familiale</th><td>${field('situation') || escape(dossier.situation)}</td></tr><tr><th class="label">Téléphone</th><td>${field('tel')}</td><th class="label">Adresse</th><td>${field('adresse')}</td></tr><tr><th class="label">Habitation</th><td colspan="3">${field('habitation')} · Propriétaire : ${yesNo(profile['proprietaire'])} · Locataire : ${yesNo(profile['locataire'])}</td></tr></table><h2>AFFILIATION</h2><table><tr><th>Carte</th><th>Oui</th><th>Non</th><th>N° carte</th><th>Observation</th></tr><tr><td>Carte spéciale</td><td>${membership['carteSpeciale'] ? '☑' : '☐'}</td><td>${membership['carteSpeciale'] ? '☐' : '☑'}</td><td>${escape(membership['carteSpecialeNumero'] || '')}</td><td>${escape(membership['carteSpecialeObservation'] || '')}</td></tr><tr><td>Carte fraternelle</td><td>${membership['carteFraternelleAdherent'] ? '☑' : '☐'}</td><td>${membership['carteFraternelleAdherent'] ? '☐' : '☑'}</td><td>${escape(membership['carteFraternelle'] || '')}</td><td>${escape(membership['carteFraternelleObservation'] || '')}</td></tr><tr><td>A.M.C</td><td>${membership['amc'] ? '☑' : '☐'}</td><td>${membership['amc'] ? '☐' : '☑'}</td><td>${escape(membership['amcNumero'] || '')}</td><td>${escape(membership['amcObservation'] || '')}</td></tr></table><h2>IDENTIFICATION DE L’ÉPOUSE</h2><table><tr><th>Nom</th><th>Prénom</th><th>Date naissance</th><th>Activité</th><th>CIN</th></tr>${rows(spouse, ['nom', 'prenom', 'naissance', 'fonction', 'cin'], 5)}</table><h2>DONNÉES MÉDICO-SOCIALES</h2><table><tr><th>Identification</th><th>Diagnostic</th><th>Durée</th></tr>${rows(details.socialData || [], ['identification', 'diagnostic', 'duree'], 3)}</table><h2>ASSISTANCE OCTROYÉE</h2><table><tr><th>Nature</th><th>Organisme</th><th>Date</th><th>Observation</th></tr>${rows(details.assistances || [], ['nature', 'organisme', 'date', 'observation'], 4)}</table><h2>SITUATION DES ENFANTS</h2><table><tr><th>Prénom</th><th>Date naissance</th><th>Situation</th><th>Niveau</th><th>Emploi</th></tr>${rows(children, ['prenom', 'naissance', 'charge', 'niveauInstruction', 'emploi'], 5)}</table><table><tr><th colspan="2">RESSOURCES MENSUELLES</th><th colspan="2">CHARGES MENSUELLES</th></tr><tr><th>Désignation</th><th>Montant</th><th>Désignation</th><th>Montant</th></tr>${budgetRows}<tr><td class="total">TOTAL</td><td>${total(resources)}</td><td class="total">TOTAL</td><td>${total(charges)}</td></tr></table></body></html>`);
    popup.document.close();
    popup.focus();
    setTimeout(() => popup.print(), 250);
  }
}
