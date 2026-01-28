import { Routes } from '@angular/router';

import { MyTicketsComponent } from './pages/my-tickets/my-tickets.page';
import { ScanHistoryComponent } from './pages/scan-history/scan-history.page';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.page';

export const accessRoutes: Routes = [
  { path: 'my-tickets', component: MyTicketsComponent },
  { path: 'scanner', component: QrScannerComponent },
  { path: 'scan-history', component: ScanHistoryComponent },
];
