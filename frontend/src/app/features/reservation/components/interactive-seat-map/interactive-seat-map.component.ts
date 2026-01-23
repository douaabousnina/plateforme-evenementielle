import { Component, input, output, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interactive-seat-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive-seat-map.component.html',
})
export class InteractiveSeatMapComponent {
  seats = input.required<any[]>();
  selectedSeats = input.required<any[]>();
  
  seatSelected = output<any>();

  // Group seats by section and rows dynamically
  fosseOrRows = computed(() => {
    const fosseSeats = this.seats().filter(s => s.section === 'Fosse Or');
    return this.groupByRows(fosseSeats, 12);
  });

  cat1LeftRows = computed(() => {
    const cat1Seats = this.seats().filter(s => s.section === 'Catégorie 1');
    const totalInSection = cat1Seats.length;
    const perSide = Math.floor(totalInSection / 3);
    return this.groupByRows(cat1Seats.slice(0, perSide), 4);
  });

  cat1CenterRows = computed(() => {
    const cat1Seats = this.seats().filter(s => s.section === 'Catégorie 1');
    const totalInSection = cat1Seats.length;
    const perSide = Math.floor(totalInSection / 3);
    const centerStart = perSide;
    const centerEnd = perSide + Math.ceil(totalInSection / 3);
    return this.groupByRows(cat1Seats.slice(centerStart, centerEnd), 6);
  });

  cat1RightRows = computed(() => {
    const cat1Seats = this.seats().filter(s => s.section === 'Catégorie 1');
    const totalInSection = cat1Seats.length;
    const perSide = Math.floor(totalInSection / 3);
    const centerEnd = perSide + Math.ceil(totalInSection / 3);
    return this.groupByRows(cat1Seats.slice(centerEnd), 4);
  });

  balconRows = computed(() => {
    const balconSeats = this.seats().filter(s => s.section === 'Balcon');
    return this.groupByRows(balconSeats, 10);
  });

  // Get unique sections for dynamic rendering
  sections = computed(() => {
    const sectionSet = new Set(this.seats().map(s => s.section));
    return Array.from(sectionSet);
  });

  // Get price per section
  getPriceForSection(section: string): number {
    const seat = this.seats().find(s => s.section === section);
    return seat?.price || 0;
  }

  onSeatClick(seat: any): void {
    if (seat.status !== 'sold') {
      this.seatSelected.emit(seat);
    }
  }

  private groupByRows(seats: any[], perRow: number): any[][] {
    const rows: any[][] = [];
    for (let i = 0; i < seats.length; i += perRow) {
      rows.push(seats.slice(i, i + perRow));
    }
    return rows;
  }
}