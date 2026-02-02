import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../reservation/services/event.service';
import { Event } from '../../../reservation/models/event.model';
import { EventDetail } from '../../models/event-detail.model';
import { EventDetailHeroComponent } from '../../components/event-detail-hero/event-detail-hero.component';
import { EventDetailDescriptionComponent } from '../../components/event-detail-description/event-detail-description.component';
import { EventDetailReviewsComponent } from '../../components/event-detail-reviews/event-detail-reviews.component';
import { EventDetailTicketCardComponent } from '../../components/event-detail-ticket-card/event-detail-ticket-card.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbStep } from '../../../../core/models/breadcrumb.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    EventDetailHeroComponent,
    EventDetailDescriptionComponent,
    EventDetailReviewsComponent,
    EventDetailTicketCardComponent,
    HeaderComponent
  ],
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.css'],
})
export class EventDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventService);

  readonly event = signal<EventDetail | null>(null);
  readonly loading = this.eventService.loading;
  readonly error = this.eventService.error;
  readonly artists = signal<any[]>([]);
  readonly reviews = signal<any[]>([]);
  readonly seatMapSections = signal<any[]>([]);
  readonly ticketOptions = signal<any[]>([]);
  readonly descriptionHighlights = signal<string[]>([
    '3 Scènes thématiques',
    'Installations d\'art numérique interactives',
    'Food court gourmet par les meilleurs chefs de rue de Paris',
  ]);

  readonly breadcrumbSteps = computed<BreadcrumbStep[]>(() => {
    const ev = this.event();
    if (!ev) return [];
    return [
      { label: 'Accueil', route: '/events', completed: true, active: false, stepNumber: 1 },
      { label: ev.category || 'Événement', route: `/events?category=${ev.category}`, completed: true, active: false, stepNumber: 2 },
      { label: ev.title, route: '', completed: false, active: true, stepNumber: 3 },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.eventService.error.set('Événement introuvable');
      return;
    }
    this.eventService.loadEventById(id).subscribe({
      next: (data) => {
        this.event.set(this.mapEventToEventDetail(data));
      },
      error: (err) => {
        this.eventService.error.set('Événement introuvable');
      }
    });
  }

  private mapEventToEventDetail(event: Event): EventDetail {
    const startDate = new Date(event.startDate);
    const dateLabel = startDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const startTime = new Date(event.startTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = new Date(event.endTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      categoryLabel: event.category.charAt(0).toUpperCase() + event.category.slice(1),
      tags: [],
      date: startDate,
      dateLabel,
      timeRange: `${startTime} - ${endTime}`,
      venueName: event.location?.venueName || 'Lieu à déterminer',
      address: event.location?.address || '',
      city: event.location?.city,
      country: event.location?.country,
      organizerId: event.organizerId,
      organizerName: 'Organizer Name',
      images: event.gallery || [],
      bannerImage: event.coverImage,
      priceFrom: 0,
      priceCurrency: 'TND',
      isAvailable: (event.availableCapacity ?? 0) > 0,
      availabilityLabel: (event.availableCapacity ?? 0) > 0 ? 'Places disponibles' : 'Événement complet'
    };
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
