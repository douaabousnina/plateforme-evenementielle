import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MarketplaceFilterBarComponent } from '../../components/marketplace-filter-bar/marketplace-filter-bar.component';
import { MarketplaceEventCardComponent } from '../../components/marketplace-event-card/marketplace-event-card.component';
import { ClientFooterComponent } from '../../components/client-footer/client-footer.component';
import { MarketplaceFilters } from '../../models/marketplace.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { MarketplaceService } from '../../services/marketplace.service';

@Component({
  selector: 'app-marketplace-page',
  standalone: true,
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
  private readonly marketplace = inject(MarketplaceService);

  readonly loading = this.marketplace.isLoading;
  readonly error = this.marketplace.hasError;
  readonly events = this.marketplace.eventsList;
  readonly meta = this.marketplace.listMeta;
  readonly footerConfig = this.marketplace.footerConfig;
  readonly isDemoMode = this.marketplace.isDemoMode;
  readonly currentPage = signal(1);
  private readonly currentFilters = signal<Partial<MarketplaceFilters>>({});

  readonly heroTitle = computed(() => 'Découvrez des événements');
  readonly heroSubtitle = computed(() => "Concerts, festivals, ateliers et plus encore. Trouvez votre prochaine expérience inoubliable.");
  readonly loadMoreLabel = 'Voir plus d\'événements';

  ngOnInit(): void {
    this.marketplace.loadEvents(undefined, 1, 12).subscribe();
  }

  onFiltersChange(filters: Partial<MarketplaceFilters>): void {
    const merged = { ...this.currentFilters(), ...filters };
    this.currentFilters.set(merged);
    this.currentPage.set(1);
    this.marketplace.loadEvents(merged, 1, 12).subscribe();
  }

  loadMore(): void {
    const meta = this.meta();
    if (!meta || meta.page >= meta.totalPages) return;
    const next = this.currentPage() + 1;
    this.currentPage.set(next);
    this.marketplace.loadEvents(this.currentFilters(), next, 12).subscribe();
  }

  onFavorite(_event: unknown): void {
    // TODO: call favorites API or toggle local state
  }
}
