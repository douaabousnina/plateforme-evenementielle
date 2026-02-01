import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Event } from '../../../reservation/models/event.model';

@Component({
  selector: 'app-marketplace-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './marketplace-event-card.component.html',
  styleUrls: ['./marketplace-event-card.component.css'],
})
export class MarketplaceEventCardComponent {
  event = input.required<Event>();
  favorited = output<Event>();
  detailsClick = output<Event>();

  onFavorite(): void {
    this.favorited.emit(this.event());
  }

  onDetails(event: Event): void {
    this.detailsClick.emit(event);
  }

  getDateLabel(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getLocationString(location: any): string {
    if (!location) return 'Lieu à déterminer';
    if (typeof location === 'string') return location;
    return location.city || location.venue || 'Lieu à déterminer';
  }

  getPriceFromCapacity(): number {
    return 29.99;
  }
}
