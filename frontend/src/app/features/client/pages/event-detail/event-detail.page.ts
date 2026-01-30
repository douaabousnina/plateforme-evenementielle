import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketplaceService } from '../../services/marketplace.service';
import { EventDetailHeaderComponent } from '../../components/event-detail-header/event-detail-header.component';
import { EventDetailHeroComponent } from '../../components/event-detail-hero/event-detail-hero.component';
import { EventDetailDescriptionComponent } from '../../components/event-detail-description/event-detail-description.component';
import { EventDetailLineupComponent } from '../../components/event-detail-lineup/event-detail-lineup.component';
import { EventDetailSeatMapComponent } from '../../components/event-detail-seat-map/event-detail-seat-map.component';
import { EventDetailReviewsComponent } from '../../components/event-detail-reviews/event-detail-reviews.component';
import { EventDetailTicketCardComponent } from '../../components/event-detail-ticket-card/event-detail-ticket-card.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbStep } from '../../../../core/models/breadcrumb.model';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [
    EventDetailHeaderComponent,
    BreadcrumbComponent,
    EventDetailHeroComponent,
    EventDetailDescriptionComponent,
    EventDetailLineupComponent,
    EventDetailSeatMapComponent,
    EventDetailReviewsComponent,
    EventDetailTicketCardComponent,
  ],
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.css'],
})
export class EventDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly marketplace = inject(MarketplaceService);

  readonly event = signal<import('../../models/event-detail.model').EventDetail | null>(null);
  readonly ticketOptions = signal<import('../../models/event-detail.model').EventDetailTicketOption[]>([]);
  readonly artists = signal<import('../../models/event-detail.model').EventDetailArtist[]>([]);
  readonly reviews = signal<import('../../models/event-detail.model').EventDetailReview[]>([]);
  readonly seatMapSections = signal<import('../../models/event-detail.model').SeatMapSection[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly descriptionHighlights = signal<string[]>([
    '3 Scènes thématiques',
    'Installations d\'art numérique interactives',
    'Food court gourmet par les meilleurs chefs de rue de Paris',
  ]);

  readonly breadcrumbSteps = computed<BreadcrumbStep[]>(() => {
    const ev = this.event();
    if (!ev) return [];
    return [
      { label: 'Accueil', route: '/client/marketplace', completed: true, active: false, stepNumber: 1 },
      { label: ev.categoryLabel, route: `/client/marketplace?category=${ev.category}`, completed: true, active: false, stepNumber: 2 },
      { label: ev.title, route: '', completed: false, active: true, stepNumber: 3 },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Événement introuvable');
      this.loading.set(false);
      return;
    }
    this.marketplace.getEventDetail(id).subscribe((data) => {
      this.loading.set(false);
      if (!data) {
        this.error.set('Événement introuvable');
        return;
      }
      this.event.set(data.event);
      this.ticketOptions.set(data.ticketOptions);
      this.artists.set(data.artists);
      this.reviews.set(data.reviews);
      this.seatMapSections.set(data.seatMapSections);
    });
  }

  onReserve(payload: { ticketId: string; quantity: number }): void {
    // TODO: navigate to checkout or open modal
  }

  onViewAllReviews(): void {
    // TODO: open reviews modal or scroll to full list
  }

  onExpandSeatMap(): void {
    // TODO: open full-screen seat map
  }

  onChooseOnMap(): void {
    // TODO: enable seat selection mode
  }
}
