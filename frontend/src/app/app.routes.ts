import { Routes } from '@angular/router';

import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { ScanHistoryComponent } from './components/scan-history/scan-history.component';

export const routes: Routes = [
  { path: '', redirectTo: '/my-tickets', pathMatch: 'full' },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'scan-history', component: ScanHistoryComponent },
 
];
