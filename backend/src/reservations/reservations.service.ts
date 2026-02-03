import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Reservation } from './entities/reservation.entity';
import { Event } from '../events/entities/event.entity';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { ReservationStatus } from 'src/common/enums/reservation.enum';
import { RESERVATION_EXPIRATION_MINUTES } from 'src/common/constants/reservation.constants';
import { AccessService } from '../access/access.service';
import { SeatsService } from '../events/services/seats.service';

@Injectable()
export class ReservationsService {
    private isExpiringWorking = false;

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepo: Repository<Reservation>,
        private readonly seatsService: SeatsService,

        @InjectRepository(Event)
        private readonly eventRepo: Repository<Event>,

        private readonly accessService: AccessService,
    ) { }

    // LOCK SEATS & CREATE RESERVATION
    async lockSeats(userId: string, dto: LockSeatsDto) {
        const availabilityCheck = await this.seatsService.checkSeatsAvailability(
            dto.seatIds,
            dto.eventId
        );

        if (!availabilityCheck.allAvailable) {
            throw new ConflictException(
                `Seats already taken: ${availabilityCheck.takenSeatIds.join(', ')}`
            );
        }

        const seats = await this.seatsService.lockSeats(dto.seatIds, dto.eventId);
        const totalPrice = seats.reduce((sum, s) => sum + Number(s.price), 0);
        const expiresAt = new Date(Date.now() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000);

        const reservation = await this.reservationRepo.save({
            userId,
            eventId: dto.eventId,
            totalPrice,
            status: ReservationStatus.PENDING,
            expiresAt,
        });

        await this.seatsService.setReservationForSeats(
            dto.seatIds,
            dto.eventId,
            reservation.id,
        );

        return this.findById(reservation.id, userId);
    }

    // CONFIRM (after payment)
    async confirm(reservationId: string, userId: string) {
        const reservation = await this.findById(reservationId, userId);

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Reservation not confirmable');
        }

        this.validateReservationSeats(reservation)

        const seatIds = reservation.seats.map((s) => s.id);

        if (reservation.expiresAt < new Date()) {
            reservation.status = ReservationStatus.EXPIRED;
            await this.seatsService.releaseSeats(seatIds, reservation.eventId);
            await this.reservationRepo.save(reservation);
            throw new BadRequestException('Reservation expired');
        }

        reservation.status = ReservationStatus.CONFIRMED;
        await this.seatsService.markSeatsAsSold(seatIds, reservation.eventId);
        const confirmedReservation = await this.reservationRepo.save(reservation);

        // Generate tickets for the confirmed reservation
        const event = await this.eventRepo.findOne({
            where: { id: reservation.eventId },
            relations: ['location'] // we need location info pour tickets
        });
        if (event)
            await this.accessService.generateTicketsForReservation(reservation, event);

        return confirmedReservation;
    }

    // CANCEL (by user)
    async cancel(reservationId: string, userId: string) {
        const reservation = await this.findById(reservationId, userId);

        if (reservation.status !== ReservationStatus.PENDING) {
            throw new BadRequestException('Only pending reservations can be cancelled');
        }

        this.validateReservationSeats(reservation)

        reservation.status = ReservationStatus.CANCELLED;
        await this.seatsService.releaseSeats(
            reservation.seats.map((s) => s.id),
            reservation.eventId
        );
        return this.reservationRepo.save(reservation);
    }

    // FIND ONE
    async findById(id: string, userId: string) {
        const reservation = await this.reservationRepo.findOne({
            where: { id: id, userId: userId },
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
            where: {
                status: ReservationStatus.PENDING,
                expiresAt: LessThan(new Date())
            },
            relations: ['seats'],
        });

        for (const reservation of expired) {
            reservation.status = ReservationStatus.EXPIRED;
            const seatIds = reservation.seats.map((s) => s.id);
            await this.seatsService.releaseSeats(seatIds, reservation.eventId);
        }

        if (expired.length > 0) {
            await this.reservationRepo.save(expired);
        }

        this.isExpiringWorking = false;
        return expired.length;
    }

    // helper
    private validateReservationSeats(reservation: Reservation): void {
        if (!reservation.seats) {
            throw new NotFoundException('Reserved seats not found');
        }

        if (reservation.seats.length === 0) {
            throw new NotFoundException('No seats found in this reservation');
        }
    }
}