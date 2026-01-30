import { DataSource } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Seat } from '../../events/entities/seat.entity';
import { ScanLog } from '../../scanlog/entities/scan-log.entity';
import { Ticket } from '../../access/entities/ticket.entity';
import { Event } from '../../events/entities/event.entity';
import { Location } from '../../events/entities/location.entity';

/** Clear all seed-relevant tables in FK-safe order. */
export async function clearAll(dataSource: DataSource): Promise<void> {
  // Delete in correct order: children before parents
  const order = [
    ScanLog,    // References Ticket
    Ticket,     // References Event, Reservation
    Payment,    // References Reservation
    Seat,       // References Event, Reservation
    Reservation, // References Event
    Event,      // References Location
    Location,
  ];
  
  for (const Entity of order) {
    const repo = dataSource.getRepository(Entity);
    // Use createQueryBuilder to delete without FK constraints issues
    await repo.createQueryBuilder()
      .delete()
      .from(Entity)
      .execute();
  }
}
