import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EventStats {
  eventId: string;
  eventName: string;
  totalScans: number;
  uniqueScans: number;
  duplicateScans: number;
  lastScan: Date | null;
}

@Component({
  selector: 'app-event-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-stats-card.component.html',
  styleUrls: ['./event-stats-card.component.css']
})
export class EventStatsCardComponent {
  event = input.required<EventStats>();
  isExpanded = input<boolean>(false);
  toggleExpand = output<void>();

  onToggle(): void {
    this.toggleExpand.emit();
  }

  formatDateTime(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
