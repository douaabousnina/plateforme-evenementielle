import { DataSource } from 'typeorm';
import { Ticket } from '../../access/entities/ticket.entity';
import { TicketStatus } from '../../access/enums/ticket-status.enum';
import { ScanLog } from '../../scanlog/entities/scan-log.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Event } from '../../events/entities/event.entity';
import { ReservationStatus } from '../../common/enums/reservation.enum';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import { ScanStatus } from '../../scanlog/enums/scan-status.enum';
export async function seedTickets(
  dataSource: DataSource,
  reservations: Reservation[],
  events: Event[],
): Promise<Ticket[]> {
  const ticketRepo = dataSource.getRepository(Ticket);
  const eventMap = new Map(events.map((e) => [e.id, e]));
  const tickets: Ticket[] = [];

  for (const reservation of reservations) {
    if (reservation.status !== ReservationStatus.CONFIRMED) continue;
    const event = eventMap.get(reservation.eventId);
    if (!event) continue;

    const qrToken = crypto
      .createHash('sha256')
      .update(`${reservation.id}-${Date.now()}-${Math.random()}`)
      .digest('hex');
    const ticketId = crypto.randomUUID();
    const qrData = JSON.stringify({
      ticketId,
      eventId: event.id,
      userId: reservation.userId,
      token: qrToken,
      timestamp: Date.now(),
    });
    const qrCode = await QRCode.toDataURL(qrData, { width: 200, margin: 2 });

    const ticket = ticketRepo.create({
      id: ticketId,
      eventId: event.id,
      eventName: event.title,
      eventDate: event.startDate,
      eventLocation: 'Venue',
      userId: reservation.userId,
      orderId: reservation.id,
      reservationId: reservation.id,
      qrCode,
      qrToken,
      category: 'Standard',
      price: reservation.totalPrice,
      status: TicketStatus.CONFIRMED,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    const saved = await ticketRepo.save(ticket);
    tickets.push(saved);
  }

  return tickets;
}

export async function seedScanLogs(
  dataSource: DataSource,
  ticketIds: string[],
): Promise<ScanLog[]> {
  if (ticketIds.length === 0) return [];
  const scanLogRepo = dataSource.getRepository(ScanLog);
  const ticketRepo = dataSource.getRepository(Ticket);
  const logs: ScanLog[] = [];

  const tickets = await ticketRepo.find({
    where: ticketIds.map((id) => ({ id })),
    take: 3,
  });
  const controllerId = 'seed-controller-id';

  for (const ticket of tickets) {
    const log = scanLogRepo.create({
      ticketId: ticket.id,
      eventId: ticket.eventId,
      eventName: ticket.eventName ?? undefined,
      scannedBy: controllerId,
      status: ScanStatus.VALID,
      location: 'Main entrance',
      deviceInfo: 'Seed scanner',
    });
    logs.push(await scanLogRepo.save(log));
  }

  return logs;
}
