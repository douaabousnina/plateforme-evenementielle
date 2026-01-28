import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  icon: string;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
}

@Component({
  selector: 'app-scan-stats-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scan-stats-summary.component.html',
  styleUrls: ['./scan-stats-summary.component.css']
})
export class ScanStatsSummaryComponent {
  @Input() totalEvents = 0;
  @Input() totalScans = 0;
  @Input() uniqueTickets = 0;

  get stats(): StatCard[] {
    return [
      {
        icon: 'event',
        label: 'Total Événements',
        value: this.totalEvents,
        bgColor: 'bg-blue-100',
        iconColor: 'text-primary'
      },
      {
        icon: 'qr_code_scanner',
        label: 'Total Scans',
        value: this.totalScans,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        icon: 'confirmation_number',
        label: 'Billets Uniques',
        value: this.uniqueTickets,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
      }
    ];
  }
}
