import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplaceHeaderComponent } from '../../components/marketplace-header/marketplace-header.component';
import { MarketplaceFilterBarComponent } from '../../components/marketplace-filter-bar/marketplace-filter-bar.component';
import { MarketplaceEventCardComponent } from '../../components/marketplace-event-card/marketplace-event-card.component';
import { ClientFooterComponent } from '../../components/client-footer/client-footer.component';
import { MarketplaceFilters } from '../../models/marketplace.model';

@Component({
  selector: 'app-marketplace-page',
  standalone: true,
  imports: [
    MarketplaceHeaderComponent,
    MarketplaceFilterBarComponent,
    MarketplaceEventCardComponent,
    ClientFooterComponent,
  ],
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.css'],
})
export class MarketplacePage implements OnInit {
  private readonly marketplace = inject(MarketplaceService);

  readonly events = this.marketplace.eventsList;
  readonly meta = this.marketplace.listMeta;
  readonly loading = this.marketplace.isLoading;
  readonly error = this.marketplace.hasError;
  readonly footerConfig = this.marketplace.footerConfig;
  readonly currentPage = signal(1);

  readonly heroTitle = computed(() => 'Découvrez des événements uniques');
  readonly heroSubtitle = computed(() => "Concerts, festivals, ateliers et plus encore. Trouvez votre prochaine expérience inoubliable.");
  readonly loadMoreLabel = 'Voir plus d\'événements';

  ngOnInit(): void {
    this.marketplace.loadEvents(undefined, 1, 12).subscribe();
  }

  onFiltersChange(filters: Partial<MarketplaceFilters>): void {
    this.marketplace.updateFilters(filters);
    this.currentPage.set(1);
    this.marketplace.loadEvents(filters, 1, 12).subscribe();
  }

  loadMore(): void {
    const meta = this.meta();
    if (!meta || meta.page >= meta.totalPages) return;
    const next = this.currentPage() + 1;
    this.currentPage.set(next);
    this.marketplace.loadEvents(this.marketplace.currentFilters(), next, 12).subscribe();
  }

  onFavorite(_card: unknown): void {
    // TODO: call favorites API or toggle local state
  }
}
