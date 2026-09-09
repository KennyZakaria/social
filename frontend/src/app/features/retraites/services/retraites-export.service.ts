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
    const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] || c));
    const field = (key: string, fallback = '') => esc(profile[key] ?? fallback);
    const mark = (value: unknown) => value ? '☑' : '☐';
    const deceased = !!profile['dateDeces'];
    const spouse = family.filter(x => x['type'] === 'Conjoint');
    const children = family.filter(x => x['type'] === 'Enfant');
    const rows = (items: Entry[], keys: string[], min = 1) => {
      const content = items.map(item => `<tr>${keys.map(key => `<td>${esc(item[key])}</td>`).join('')}</tr>`);
      while (content.length < min) content.push(`<tr><td colspan="${keys.length}" class="blank">&nbsp;</td></tr>`);
      return content.join('');
    };
    const resources = (details.resources || []) as Entry[];
    const charges = ((details.charges || []) as Entry[]).filter(item => deceased || item['designation'] !== 'Frais de scolarité');
    const total = (items: Entry[]) => items.reduce((sum, x) => sum + (Number(String(x['montant'] ?? 0).replace(',', '.')) || 0), 0).toFixed(2);
    const budget = Array.from({ length: Math.max(4, resources.length, charges.length) }, (_, i) => `<tr><td>${esc(resources[i]?.['designation'])}</td><td>${esc(resources[i]?.['montant'])}</td><td>${esc(charges[i]?.['designation'])}</td><td>${esc(charges[i]?.['montant'])}</td></tr>`).join('');
    const card = (label: string, active: unknown, number: unknown, note: unknown) => `<tr><td>${label}</td><td>${mark(active)}</td><td>${mark(!active)}</td><td>${esc(number)}</td><td>${esc(note)}</td></tr>`;
    const cards = [
      card('Carte spéciale', membership['carteSpeciale'], membership['carteSpecialeNumero'], membership['carteSpecialeObservation']),
      card('Carte fraternelle', membership['carteFraternelleAdherent'], membership['carteFraternelle'], membership['carteFraternelleObservation']),
      ...(deceased ? [] : [card('A.M.C.', membership['amc'], membership['amcNumero'], membership['amcObservation'])])
    ].join('');
    const identityRows = deceased
      ? `<tr><th>Nom</th><td>${field('nom', dossier.nom)}</td><th>Prénom</th><td>${field('prenom')}</td></tr><tr><th>Grade</th><td>${field('grade')}</td><th>Mle/C · C.I.N.</th><td>${field('matricule', dossier.matricule)} / ${field('corps')} / ${field('cin')}</td></tr><tr><th>D. naissance</th><td>${field('naissance')}</td><th>S. familiale</th><td>${field('situation', dossier.situation)}</td></tr><tr><th>Date radiation</th><td>${field('radiation')}</td><th>Motif</th><td>${field('motif')}</td></tr><tr><th>Date décès</th><td colspan="3">${field('dateDeces')}</td></tr><tr><th>Téléphone GSM</th><td>${field('tel')}</td><th>Téléphone fixe</th><td>${field('telephoneFixe')}</td></tr>`
      : `<tr><th>Nom</th><td>${field('nom', dossier.nom)}</td><th>Prénom</th><td>${field('prenom')}</td></tr><tr><th>Grade</th><td>${field('grade')}</td><th>Mle/C · C.I.N.</th><td>${field('matricule', dossier.matricule)} / ${field('corps')} / ${field('cin')}</td></tr><tr><th>D. naissance</th><td>${field('naissance')}</td><th>S. familiale</th><td>${field('situation', dossier.situation)}</td></tr><tr><th>Date radiation</th><td>${field('radiation')}</td><th>Motif</th><td>${field('motif')}</td></tr><tr><th>Téléphone GSM</th><td>${field('tel')}</td><th>Téléphone fixe</th><td>${field('telephoneFixe')}</td></tr>`;
    const pieces = (details.pieces || []).map(piece => `<p>${String(Math.max(1, Number(piece.quantite) || 1)).padStart(2, '0')} ${esc(piece.type)}</p>`).join('');
    popup.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Fiche d’enquête sociale</title><style>@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;padding:9mm;font:10.5px Arial;color:#111}.top{display:flex;justify-content:space-between;font-weight:700;font-size:11px}.top span:last-child{text-align:right}h1,h2{text-align:center;margin:4px 0}h1{font-size:19px}h2{font-size:14px;margin-top:10px}.meta{margin:7px 0;font-weight:700}table{width:100%;border-collapse:collapse;margin:4px 0 9px}th,td{border:1px solid #222;padding:3px 4px;vertical-align:middle}th{background:#f6f6f6;font-family:Georgia,serif;font-style:italic;text-transform:uppercase}.blank{height:16px}.total{font-weight:700;text-align:center}.pieces p{margin:2px 0}@media print{table{break-inside:avoid}}</style></head><body><div class="top"><span>ROYAUME DU MAROC</span><span>GENDARMERIE ROYALE<br>SERVICE SOCIAL<br>SECTION DES RETRAITÉS</span></div><h1>FICHE D’ENQUÊTE SOCIALE</h1><h2>${deceased ? '(VEUVE D’UN RETRAITÉ)' : '(RETRAITÉ-RÉFORMÉ)'}</h2><p class="meta">En date du : ${new Date().toLocaleDateString('fr-FR')} &nbsp;&nbsp;&nbsp; MOTIF : ${field('motifEnquete')}</p><h2>${deceased ? 'IDENTIFICATION DU DÉFUNT' : 'IDENTIFICATION DU MILITAIRE'}</h2><table>${identityRows}<tr><th>Affectation</th><td colspan="3">${field('unite')}</td></tr><tr><th>Adresse</th><td colspan="3">${field('adresse')}</td></tr><tr><th>Habitation</th><td>Propriétaire : ${mark(profile['proprietaire'])}</td><td>Locataire : ${mark(profile['locataire'])}</td><td>Autres : ${field('habitationPrecision')}</td></tr></table><h2>AFFILIATION</h2><table><tr><th>Cartes ou adhésion</th><th>Oui</th><th>Non</th><th>N° carte</th><th>Observation</th></tr>${cards}</table><h2>${deceased ? 'IDENTIFICATION DE LA VEUVE' : 'IDENTIFICATION DE L’ÉPOUSE'}</h2><table><tr><th>Nom</th><th>Prénom</th><th>D. naissance</th><th>Activité</th><th>C.I.N.</th></tr>${rows(spouse,['nom','prenom','naissance','fonction','cin'])}</table><h2>DONNÉES MÉDICO-SOCIALES</h2><table><tr><th>Identification</th><th>Diagnostic</th><th>Durée</th></tr>${rows(details.socialData || [],['identification','diagnostic','duree'])}</table><h2>ASSISTANCE OCTROYÉE</h2><table><tr><th>Nature</th><th>Organisme</th><th>Date</th><th>Observation</th></tr>${rows(details.assistances || [],['nature','organisme','date','observation'])}</table><h2>SITUATION DES ENFANTS</h2><table><tr><th>Prénom</th><th>D. naissance</th><th>S. familiale</th><th>Niveau d’instruction</th><th>Emploi</th></tr>${rows(children,['prenom','naissance','situationFamiliale','niveauInstruction','fonction'],3)}</table><h2>SITUATION FINANCIÈRE</h2><table><tr><th colspan="2">RESSOURCES MENSUELLES</th><th colspan="2">CHARGES MENSUELLES</th></tr><tr><th>Désignation</th><th>Montant</th><th>Désignation</th><th>Montant</th></tr>${budget}<tr><td class="total">TOTAL</td><td>${total(resources)}</td><td class="total">TOTAL</td><td>${total(charges)}</td></tr></table>${pieces ? `<div class="pieces">${pieces}</div>` : ''}</body></html>`);
    popup.document.close(); popup.focus(); setTimeout(() => popup.print(), 250);
  }
}
