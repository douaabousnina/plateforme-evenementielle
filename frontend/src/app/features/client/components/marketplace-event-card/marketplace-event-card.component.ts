import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketplaceEventCard } from '../../models/marketplace.model';

@Component({
  selector: 'app-marketplace-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './marketplace-event-card.component.html',
  styleUrls: ['./marketplace-event-card.component.css'],
})
export class MarketplaceEventCardComponent {
  event = input.required<MarketplaceEventCard>();
  favorited = output<MarketplaceEventCard>();
  detailsClick = output<MarketplaceEventCard>();

  onFavorite(): void {
    this.favorited.emit(this.event());
  }

  onDetails(card: MarketplaceEventCard): void {
    this.detailsClick.emit(card);
  }
}
