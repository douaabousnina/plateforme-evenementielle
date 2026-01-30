import { DataSource } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Seat } from '../../events/entities/seat.entity';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';
import { ReservationStatus } from '../../common/enums/reservation.enum';
import { SeatStatus } from '../../common/enums/reservation.enum';
import { Role } from 'src/common/enums/role.enum';

const RESERVATION_EXPIRATION_MINUTES = 30;

export async function seedReservations(
  dataSource: DataSource,
  events: Event[],
  users: User[],
): Promise<{ reservations: Reservation[] }> {
  const reservationRepo = dataSource.getRepository(Reservation);
  const seatRepo = dataSource.getRepository(Seat);
  const eventRepo = dataSource.getRepository(Event);

  const reservations: Reservation[] = [];

  // Get client users only
  const clientUsers = users.filter((u) => u.role === Role.CLIENT);

  for (const event of events) {
    if (!event.hasSeatingPlan) continue;
    const seats = await seatRepo.find({
      where: { eventId: event.id, status: SeatStatus.AVAILABLE },
      take: 30,
    });
    if (seats.length < 3) continue;

    const numReservations = 2 + (event.id.charCodeAt(0) % 2);
    let seatIndex = 0;

    for (let i = 0; i < numReservations && seatIndex + 3 <= seats.length; i++) {
      const numSeats = 2 + (i % 2);
      const selectedSeats = seats.slice(seatIndex, seatIndex + numSeats);
      seatIndex += numSeats;

      // Use a real user ID from the seeded users
      const user = clientUsers[i % clientUsers.length];
      const userId = user?.id?.toString() || '1';
      const totalPrice = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);
      const isConfirmed = i % 2 === 0;
      const status = isConfirmed ? ReservationStatus.CONFIRMED : ReservationStatus.PENDING;
      const expiresAt = new Date(Date.now() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000);

      const reservation = reservationRepo.create({
        userId,
        eventId: event.id,
        totalPrice,
        status,
        expiresAt,
      });
      const savedReservation = await reservationRepo.save(reservation);
      reservations.push(savedReservation);

      for (const seat of selectedSeats) {
        seat.status = isConfirmed ? SeatStatus.SOLD : SeatStatus.LOCKED;
        seat.reservationId = savedReservation.id;
      }
      await seatRepo.save(selectedSeats);

      const eventEntity = await eventRepo.findOne({ where: { id: event.id } });
      if (eventEntity && eventEntity.availableCapacity != null) {
        eventEntity.availableCapacity -= selectedSeats.length;
        await eventRepo.save(eventEntity);
      }
    }
  }

  return { reservations };
}
