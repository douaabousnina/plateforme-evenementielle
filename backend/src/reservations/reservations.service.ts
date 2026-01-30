import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reservation } from './entities/reservation.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';
import { Event } from '../events/entities/event.entity';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { ReservationStatus, SeatStatus } from 'src/common/enums/reservation.enum';
import { DEFAULT_SEAT_PRICE, RESERVATION_EXPIRATION_MINUTES } from 'src/common/constants/reservation.constants';
import { AccessService } from '../access/access.service';

@Injectable()
export class ReservationsService {
    private isExpiringWorking = false;

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepo: Repository<Reservation>,

        @InjectRepository(ReservedSeat)
        private readonly seatRepo: Repository<ReservedSeat>,

        @InjectRepository(Event)
        private readonly eventRepo: Repository<Event>,

        private readonly accessService: AccessService,
    ) { }

    // LOCK SEATS & CREATE RESERVATION
    async lockSeats(userId: string, dto: LockSeatsDto) {
        // check seat availability
        const takenSeats = await this.seatRepo.find({
            where: {
                id: In(dto.seatIds),
                status: In([SeatStatus.LOCKED, SeatStatus.SOLD]),
            },
        });

        if (takenSeats.length > 0) {
            throw new ConflictException(
                `Seats already taken: ${takenSeats.map(s => s.id).join(', ')}`
            );
        }

        // create reservation
        const expiresAt = new Date(Date.now() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000);
        const totalPrice = dto.seatIds.length * DEFAULT_SEAT_PRICE;

        const seats = await this.seatRepo.find({
            where: {
                id: In(dto.seatIds),
            },
        });

        seats.forEach(seat => {
            seat.status = SeatStatus.LOCKED;
        });

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

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Reservation not confirmable');
        }

        if (!reservation.seats?.length) {
            throw new NotFoundException('Reserved seats not found');
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
        const confirmedReservation = await this.reservationRepo.save(reservation);

        // Generate tickets for the confirmed reservation
        try {
            const event = await this.eventRepo.findOne({ where: { id: reservation.eventId } });
            if (event) {
                await this.accessService.generateTicketsForReservation(reservation, event);
            }
        } catch (error) {
            console.error('Failed to generate tickets:', error);
            // Don't throw error to prevent payment confirmation failure
        }

        return confirmedReservation;
    }

    // CANCEL (by user)
    async cancel(reservationId: string) {
        const reservation = await this.findById(reservationId);

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Only pending reservations can be cancelled');
        }

        if (!reservation.seats?.length) {
            throw new NotFoundException('Reserved seats not found');
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
        if (this.isExpiringWorking) return 0;
        this.isExpiringWorking = true;

        const expired = await this.reservationRepo.find({
            where: { status: ReservationStatus.PENDING, expiresAt: LessThan(new Date()) },
            relations: ['seats'],
        });

        for (const reservation of expired) {
            reservation.status = ReservationStatus.EXPIRED;
            reservation.seats.forEach(s => (s.status = SeatStatus.AVAILABLE));
        }

        if (expired.length > 0) {
            await this.seatRepo.save(expired.flatMap(r => r.seats));
            await this.reservationRepo.save(expired);
        }

        this.isExpiringWorking = false;
        return expired.length;
    }

    async findSeatsByEventId(eventId: string) {
        return this.seatRepo.find({
            where: { eventId },
            order: { section: 'ASC', row: 'ASC', number: 'ASC' },
        });
    }
}