import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplaceFilters } from '../../models/marketplace.model';

@Component({
  selector: 'app-marketplace-filter-bar',
  
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
  readonly maxPriceValue = 300;

  filtersChange = output<Partial<MarketplaceFilters>>();

  readonly dateOptions = this.marketplace.dateFilterOptions;
  readonly categoryOptions = this.marketplace.categoryFilterOptions;

  get pricePercent(): number {
    const value = this.priceMax() ?? this.maxPriceValue;
    const percent = (value / this.maxPriceValue) * 100;
    return Math.max(0, Math.min(100, percent));
  }

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

  onPriceSliderChange(value: string): void {
    const num = Number(value);
    this.onPriceChange(Number.isNaN(num) ? null : num);
  }

  onPriceChange(value: number | null): void {
    this.priceMax.set(value);
    this.filtersChange.emit({ priceMax: value ?? undefined });
  }

  selectCategory(value: string): void {
    this.category.set(value);
    this.filtersChange.emit({ category: value });
  }
}
