import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-module-placeholder',
    imports: [CommonModule],
    templateUrl: './module-placeholder-page.component.html',
    styleUrl: './module-placeholder-page.component.scss'
})
export class ModulePlaceholderPageComponent {
  moduleLabel = 'Module';
  featureTitle = 'Page';

  constructor(private readonly route: ActivatedRoute) {
    const moduleKey = this.route.snapshot.paramMap.get('moduleKey') || '';
    const feature = this.route.snapshot.paramMap.get('feature') || 'page';
    this.moduleLabel = moduleKey.replace(/-/g, ' ');
    this.featureTitle = feature.replace(/-/g, ' ');
  }
}
