import { CanDeactivateFn } from '@angular/router';
import { RetraitesPageComponent } from './retraites-page.component';

export const retraitesDraftNavigationGuard: CanDeactivateFn<RetraitesPageComponent> = component =>
  component.confirmLeaveDraft();
