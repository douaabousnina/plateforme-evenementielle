import { Routes } from '@angular/router';

import { MyTicketsComponent } from './pages/my-tickets/my-tickets.component';
import { ScanHistoryComponent } from './pages/scan-history/scan-history.component';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.component';

export const accessRoutes: Routes = [
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'scanner', component: QrScannerComponent },
  { path: 'scan-history', component: ScanHistoryComponent },
];
