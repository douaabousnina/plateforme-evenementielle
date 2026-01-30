import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplaceFilters } from '../../models/marketplace.model';

@Component({
  selector: 'app-marketplace-filter-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './marketplace-filter-bar.component.html',
  styleUrls: ['./marketplace-filter-bar.component.css'],
})
export class MarketplaceFilterBarComponent {
  private readonly marketplace = inject(MarketplaceService);

  search = signal('');
  datePreset = signal('');
  category = signal('');
  priceMax = signal<number | null>(150);

  filtersChange = output<Partial<MarketplaceFilters>>();

  readonly dateOptions = this.marketplace.dateFilterOptions;
  readonly categoryOptions = this.marketplace.categoryFilterOptions;

  onSearchChange(value: string): void {
    this.search.set(value);
    this.filtersChange.emit({ search: value });
  }

  onDateChange(value: string): void {
    this.datePreset.set(value);
    this.filtersChange.emit({ datePreset: value });
  }

  onCategoryChange(value: string): void {
    this.category.set(value);
    this.filtersChange.emit({ category: value });
  }

  onPriceChange(value: number | null): void {
    this.priceMax.set(value);
    this.filtersChange.emit({ priceMax: value });
  }

  selectCategory(value: string): void {
    this.category.set(value);
    this.filtersChange.emit({ category: value });
  }
}
