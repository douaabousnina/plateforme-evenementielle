import { Routes } from '@angular/router';

import { MyTicketsComponent } from './pages/my-tickets/my-tickets.page';
import { ScanHistoryComponent } from './pages/scan-history/scan-history.page';
import { QrScannerComponent } from './pages/qr-scanner/qr-scanner.page';
import { roleGuard } from '../../core/guards/role.guard';

export const accessRoutes: Routes = [
  { path: 'my-tickets', component: MyTicketsComponent },


  { path: 'dashboard/scanner', component: QrScannerComponent },
  { 
    path: 'dashboard/scan-history', 
    component: ScanHistoryComponent,
     //canActivate: [roleGuard],
     //data: { roles: [UserRole.ORGANIZER] }
  },
];
