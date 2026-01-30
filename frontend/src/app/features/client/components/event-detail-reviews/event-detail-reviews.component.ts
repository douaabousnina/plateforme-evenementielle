import { Component, input, output } from '@angular/core';
import { EventDetailReview } from '../../models/event-detail.model';

@Component({
  selector: 'app-event-detail-reviews',
  standalone: true,
  templateUrl: './event-detail-reviews.component.html',
  styleUrls: ['./event-detail-reviews.component.css'],
})
export class EventDetailReviewsComponent {
  reviews = input.required<EventDetailReview[]>();
  rating = input<number | null>(null);
  reviewCount = input<number | null>(null);
  sectionTitle = input('Avis & Notes');
  viewAllLabel = input('Voir tous les avis');

  viewAllClick = output<void>();
}
