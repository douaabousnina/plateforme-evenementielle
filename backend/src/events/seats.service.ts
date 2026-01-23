import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './seat.entity';
import { Event } from './event.entity';
import { SeatStatus } from '../common/enums/reservation.enum';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private seatsRepository: Repository<Seat>,
  ) {}

  async findByEventId(eventId: string): Promise<Seat[]> {
    return this.seatsRepository.find({ where: { eventId } });
  }

  async findById(id: string): Promise<Seat | null> {
    return this.seatsRepository.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: SeatStatus): Promise<Seat | null> {
    await this.seatsRepository.update(id, { status });
    return this.findById(id);
  }

  async createSeat(seat: Partial<Seat>): Promise<Seat> {
    const newSeat = this.seatsRepository.create(seat);
    return this.seatsRepository.save(newSeat);
  }

  async generateSeatsForEvent(event: Event): Promise<void> {
    const sections = event.sections || ['Cat1', 'Cat2', 'Balcony'];
    const seatsPerSection = Math.floor(event.totalSeats / sections.length);
    const rows = 10;
    const seatsPerRow = Math.ceil(seatsPerSection / rows);

    let seatCount = 0;
    
    for (const section of sections) {
      for (let row = 1; row <= rows; row++) {
        for (let seat = 1; seat <= seatsPerRow; seat++) {
          if (seatCount >= event.totalSeats) break;

          const seatPrice = this.calculateSeatPrice(section);
          await this.createSeat({
            eventId: event.id,
            seatNumber: `${String.fromCharCode(64 + row)}${seat}`,
            row: String.fromCharCode(64 + row),
            section,
            price: seatPrice,
            status: SeatStatus.AVAILABLE,
          });

          seatCount++;
        }
        if (seatCount >= event.totalSeats) break;
      }
    }

    console.log(`✓ Generated ${seatCount} seats for event: ${event.name}`);
  }

  private calculateSeatPrice(section: string): number {
    const priceMap: Record<string, number> = {
      'Cat1': 150,
      'Cat2': 100,
      'Balcony': 75,
      'Pit': 200,
    };
    return priceMap[section] || 100;
  }
}
