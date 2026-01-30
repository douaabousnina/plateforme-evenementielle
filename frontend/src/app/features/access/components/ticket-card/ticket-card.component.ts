import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models/access.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css']
})
export class TicketCardComponent {
  ticket = input.required<Ticket>();
  qrClick = output<Ticket>();

  onQrClick(): void {
    this.qrClick.emit(this.ticket());
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Date non disponible';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Concert': 'music_note',
      'Conférence': 'business_center',
      'Théâtre': 'theater_comedy',
      'Sport': 'sports_soccer',
      'Autre': 'event'
    };
    return icons[category] || 'confirmation_number';
  }
}
