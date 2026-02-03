import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatStatus } from '../../enums/reservation.enum';
import { SECTION_CONFIGS, SectionConfig } from './seat-map.config';

interface SectionData {
  config: SectionConfig;
  subsections: {
    seats: any[][];
    rotation?: number;
  }[];
}

@Component({
  selector: 'app-interactive-seat-map',
  imports: [CommonModule],
  templateUrl: './interactive-seat-map.component.html',
})
export class InteractiveSeatMapComponent {
  seats = input.required<any[]>();
  selectedSeats = input.required<any[]>();
  seatSelected = output<any>();

  protected readonly SeatStatus = SeatStatus;
  protected readonly sectionConfigs = SECTION_CONFIGS;

  // Organize all sections based on config
  sections = computed<SectionData[]>(() => {
    return SECTION_CONFIGS.map(config => ({
      config,
      subsections: this.buildSubsections(config),
    })).filter(section => section.subsections.length > 0);
  });

  getPriceForSection(sectionName: string): number {
    const seat = this.seats().find(s => s.section === sectionName);
    return Number(seat?.price) || 0;
  }

  onSeatClick(seat: any): void {
    if (seat.status !== SeatStatus.SOLD) {
      this.seatSelected.emit(seat);
    }
  }

  getBorderColorClass(config: SectionConfig, status: SeatStatus): string {
    if (status === SeatStatus.LOCKED) return 'border-primary';

    const color = config.style?.borderColor || 'primary';
    return status === SeatStatus.AVAILABLE ? `border-${color}-400/50` : '';
  }

  getHoverColorClass(config: SectionConfig): string {
    const color = config.style?.borderColor || 'primary';
    return `hover:bg-${color}-400/20`;
  }

  private buildSubsections(config: SectionConfig): { seats: any[][], rotation?: number }[] {
    const sectionSeats = this.seats().filter(s => s.section === config.name);
    if (sectionSeats.length === 0) return [];

    if (config.layout === 'triple') {
      return this.splitIntoThree(sectionSeats, config);
    }

    return [{
      seats: this.groupByRows(sectionSeats, config.seatsPerRow),
    }];
  }

  private splitIntoThree(seats: any[], config: SectionConfig): { seats: any[][], rotation?: number }[] {
    const total = seats.length;
    const perSide = Math.floor(total / 3);
    const centerCount = total - (perSide * 2);

    return [
      {
        seats: this.groupByRows(seats.slice(0, perSide), 4),
        rotation: config.style?.rotation || 0,
      },
      {
        seats: this.groupByRows(seats.slice(perSide, perSide + centerCount), config.seatsPerRow),
        rotation: 0,
      },
      {
        seats: this.groupByRows(seats.slice(perSide + centerCount), 4),
        rotation: -(config.style?.rotation || 0),
      },
    ];
  }

  private groupByRows(seats: any[], perRow: number): any[][] {
    const rows: any[][] = [];
    for (let i = 0; i < seats.length; i += perRow) {
      rows.push(seats.slice(i, i + perRow));
    }
    return rows;
  }
}