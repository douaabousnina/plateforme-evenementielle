import { DataSource } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Seat } from '../../events/entities/seat.entity';
import { ScanLog } from '../../access/entities/scan-log.entity';
import { Ticket } from '../../access/entities/ticket.entity';
import { Event } from '../../events/entities/event.entity';
import { Location } from '../../events/entities/location.entity';

/** Clear all seed-relevant tables in FK-safe order. */
export async function clearAll(dataSource: DataSource): Promise<void> {
  const order = [
    Payment,
    Reservation,
    Seat,
    ScanLog,
    Ticket,
    Event,
    Location,
  ];
  for (const Entity of order) {
    const repo = dataSource.getRepository(Entity);
    await repo.delete({});
  }
}
