import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetraitesStoreService } from '../services/retraites-store.service';

@Component({
  selector: 'app-retraites-global-history-page', imports: [CommonModule],
  templateUrl: './retraites-global-history-page.component.html',
  styleUrl: './retraites-global-history-page.component.css'
})
export class RetraitesGlobalHistoryPageComponent {
  activities = this.store.activities();
  constructor(private readonly store: RetraitesStoreService) {}
}