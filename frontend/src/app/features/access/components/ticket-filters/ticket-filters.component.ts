import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterTab = 'upcoming' | 'past' | 'cancelled';

@Component({
  selector: 'app-ticket-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-filters.component.html',
  styleUrls: ['./ticket-filters.component.css']
})
export class TicketFiltersComponent {
  activeTab = input<FilterTab>('upcoming');
  counts = input<{ upcoming: number; past: number; cancelled: number }>({ upcoming: 0, past: 0, cancelled: 0 });
  tabChange = output<FilterTab>();

  onTabClick(tab: FilterTab): void {
    this.tabChange.emit(tab);
  }
}
