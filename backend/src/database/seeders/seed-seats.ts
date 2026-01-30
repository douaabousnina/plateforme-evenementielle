import { DataSource } from 'typeorm';
import { Seat } from '../../events/entities/seat.entity';
import { Event } from '../../events/entities/event.entity';
import { SeatStatus } from '../../common/enums/reservation.enum';

const SECTIONS = [
  { name: 'Fosse Or', rows: 3, seatsPerRow: 15, price: 150 },
  { name: 'Catégorie 1', rows: 3, seatsPerRow: 15, price: 95 },
  { name: 'Balcon', rows: 3, seatsPerRow: 15, price: 65 },
];

export async function seedSeats(
  dataSource: DataSource,
  events: Event[],
): Promise<Seat[]> {
  const repo = dataSource.getRepository(Seat);
  const allSeats: Seat[] = [];

  for (const event of events) {
    if (!event.hasSeatingPlan) continue;
    for (const section of SECTIONS) {
      for (let r = 1; r <= section.rows; r++) {
        const rowLabel = String.fromCharCode(64 + r);
        for (let n = 1; n <= section.seatsPerRow; n++) {
          allSeats.push(
            repo.create({
              eventId: event.id,
              row: rowLabel,
              number: n,
              section: section.name,
              category: section.name,
              price: section.price,
              status: SeatStatus.AVAILABLE,
            }),
          );
        }
      }
    }
  }

  return repo.save(allSeats);
}
