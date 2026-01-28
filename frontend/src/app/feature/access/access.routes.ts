import { Routes } from '@angular/router';

import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { ScanHistoryComponent } from './components/scan-history/scan-history.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';

export const accessRoutes: Routes = [
  { path: '', redirectTo: 'my-tickets', pathMatch: 'full' },
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'scanner', component: QrScannerComponent },
  { path: 'scan-history', component: ScanHistoryComponent },
];
