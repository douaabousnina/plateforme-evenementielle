import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanLog } from '../../models/access.model';

@Component({
  selector: 'app-scan-details-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scan-details-table.component.html',
  styleUrls: ['./scan-details-table.component.css']
})
export class ScanDetailsTableComponent {
  @Input() scans: ScanLog[] = [];

  formatDateTime(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'valid':
        return 'bg-green-100 text-green-700';
      case 'already_scanned':
        return 'bg-yellow-100 text-yellow-700';
      case 'expired':
        return 'bg-orange-100 text-orange-700';
      case 'invalid':
      case 'fake':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'valid':
        return 'Valide';
      case 'already_scanned':
        return 'Déjà scanné';
      case 'expired':
        return 'Expiré';
      case 'invalid':
        return 'Invalide';
      case 'fake':
        return 'Faux';
      default:
        return status;
    }
  }
}
