import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

@Component({ selector: 'app-ayants-droit-picker', imports: [CommonModule, RouterLink], templateUrl: './ayants-droit-picker.component.html',
  styleUrl: './ayants-droit-picker.component.scss' })
export class AyantsDroitPickerComponent implements OnInit { 
  dossiers:DossierDecesResponse[]=[]; loading=true; error=''; 
  constructor(private svc:DecesService){} ngOnInit(){this.svc.findAll().subscribe({next:d=>{this.dossiers=d;this.loading=false;},error:()=>{this.error='Impossible de charger les dossiers.';this.loading=false;}});} }