import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() activeTab: FilterTab = 'upcoming';
  @Input() counts = { upcoming: 0, past: 0, cancelled: 0 };
  @Output() tabChange = new EventEmitter<FilterTab>();

  onTabClick(tab: FilterTab): void {
    this.tabChange.emit(tab);
  }
}
