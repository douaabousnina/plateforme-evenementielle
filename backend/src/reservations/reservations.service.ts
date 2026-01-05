import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reservation } from './entities/reservation.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { ReservationStatus, SeatStatus } from 'src/common/enums/reservation.enum';
import { DEFAULT_SEAT_PRICE, RESERVATION_EXPIRATION_MINUTES } from 'src/common/constants/reservation.constants';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepo: Repository<Reservation>,

        @InjectRepository(ReservedSeat)
        private readonly seatRepo: Repository<ReservedSeat>,
    ) { }

    // LOCK SEATS & CREATE RESERVATION
    async lockSeats(userId: string, dto: LockSeatsDto) {
        // check seat availability
        const takenSeats = await this.seatRepo.find({
            where: {
                seatId: In(dto.seatIds),
                status: In([SeatStatus.LOCKED, SeatStatus.SOLD]),
            },
        });

        if (takenSeats.length > 0) {
            throw new BadRequestException(`Seats already taken: ${takenSeats.map(s => s.seatId).join(', ')}`);
        }

        // create reservation
        const expiresAt = new Date(Date.now() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000);
        const totalPrice = dto.seatIds.length * DEFAULT_SEAT_PRICE;

        const seats = dto.seatIds.map(seatId =>
            this.seatRepo.create({
                seatId,
                price: DEFAULT_SEAT_PRICE,
                status: SeatStatus.LOCKED,
            }),
        );

        const reservation = this.reservationRepo.create({
            userId,
            eventId: dto.eventId,
            seats,
            totalPrice,
            status: ReservationStatus.PENDING,
            expiresAt,
        });

        return this.reservationRepo.save(reservation);
    }

    // CONFIRM (after payment)
    async confirm(reservationId: string) {
        const reservation = await this.findById(reservationId);

        if (!reservation) throw new NotFoundException('Reservation not found');

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Reservation not confirmable');
        }

        if (reservation.expiresAt < new Date()) {
            reservation.status = ReservationStatus.EXPIRED;
            reservation.seats.forEach(s => (s.status = SeatStatus.AVAILABLE));
            await this.seatRepo.save(reservation.seats);
            await this.reservationRepo.save(reservation);
            throw new BadRequestException('Reservation expired');
        }

        reservation.status = ReservationStatus.CONFIRMED;
        reservation.seats.forEach(s => (s.status = SeatStatus.SOLD));
        await this.seatRepo.save(reservation.seats);
        return this.reservationRepo.save(reservation);
    }

    // CANCEL (by user)
    async cancel(reservationId: string) {
        const reservation = await this.findById(reservationId);

        if (!reservation) throw new NotFoundException('Reservation not found');

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Only pending reservations can be cancelled');
        }

        reservation.status = ReservationStatus.CANCELLED;
        reservation.seats.forEach(s => (s.status = SeatStatus.AVAILABLE));
        await this.seatRepo.save(reservation.seats);
        return this.reservationRepo.save(reservation);
    }

    // FIND ONE
    async findById(id: string) {
        const reservation = await this.reservationRepo.findOne({
            where: { id },
            relations: ['seats'],
        });

        if (!reservation) throw new NotFoundException('Reservation not found');
        return reservation;
    }

    // FIND BY USER
    async findByUser(userId: string) {
        return this.reservationRepo.find({
            where: { userId },
            relations: ['seats'],
            order: { createdAt: 'DESC' },
        });
    }

    // AUTO-EXPIRE PENDING RESERVATIONS
    @Cron(CronExpression.EVERY_MINUTE)
    async expireOldReservations() {
        const expired = await this.reservationRepo.find({
            where: { status: ReservationStatus.PENDING, expiresAt: LessThan(new Date()) },
            relations: ['seats'],
        });

        for (const reservation of expired) {
            reservation.status = ReservationStatus.EXPIRED;
            reservation.seats.forEach(s => (s.status = SeatStatus.AVAILABLE));
            await this.seatRepo.save(reservation.seats);
            await this.reservationRepo.save(reservation);
        }

        return expired.length;
    }

}
