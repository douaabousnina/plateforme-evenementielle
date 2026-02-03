import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { EventService } from '../../../reservation/services/event.service';
import { Event } from '../../../reservation/models/event.model';
import { MarketplaceFilterBarComponent } from '../../components/marketplace-filter-bar/marketplace-filter-bar.component';
import { MarketplaceEventCardComponent } from '../../components/marketplace-event-card/marketplace-event-card.component';
import { ClientFooterComponent } from '../../components/client-footer/client-footer.component';
import { MarketplaceFilters } from '../../models/marketplace.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';

@Component({
  selector: 'app-marketplace-page',
  
  imports: [
    MarketplaceFilterBarComponent,
    MarketplaceEventCardComponent,
    ClientFooterComponent,
    HeaderComponent
  ],
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.css'],
})
export class MarketplacePage implements OnInit {
  private readonly eventService = inject(EventService);

  readonly loading = this.eventService.loading;
  readonly error = this.eventService.error;
  readonly events = signal<Event[]>([]);
  readonly meta = signal<any>(null);
  readonly footerConfig = signal<any>(null);
  readonly currentPage = signal(1);

  readonly heroTitle = computed(() => 'Découvrez des événements uniques');
  readonly heroSubtitle = computed(() => "Concerts, festivals, ateliers et plus encore. Trouvez votre prochaine expérience inoubliable.");
  readonly loadMoreLabel = 'Voir plus d\'événements';

  ngOnInit(): void {
    this.eventService.loadEventsList(1, 12).subscribe({
      next: (response) => {
        const eventsList = Array.isArray(response) ? response : (response.data || response);
        this.events.set(eventsList);
        this.meta.set(response.meta || { page: 1, limit: 12 });
      },
      error: (err) => {
        this.eventService.error.set(err.message || 'Failed to load events');
      }
    });
  }

  onFiltersChange(filters: Partial<MarketplaceFilters>): void {
    this.currentPage.set(1);
    this.eventService.loadEventsList(1, 12, filters).subscribe({
      next: (response) => {
        const eventsList = Array.isArray(response) ? response : (response.data || response);
        this.events.set(eventsList);
        this.meta.set(response.meta || { page: 1, limit: 12 });
      }
    });
  }

  loadMore(): void {
    const meta = this.meta();
    if (!meta || meta.page >= meta.totalPages) return;
    const next = this.currentPage() + 1;
    this.currentPage.set(next);
    
    this.eventService.loadEventsList(next, 12).subscribe({
      next: (response) => {
        const eventsList = Array.isArray(response) ? response : (response.data || response);
        const currentEvents = this.events();
        this.events.set([...currentEvents, ...eventsList]);
        this.meta.set(response.meta || { page: next, limit: 12 });
      }
    });
  }

  onFavorite(event: Event): void {
    // TODO: call favorites API or toggle local state
  }
}
