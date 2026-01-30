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
        // Check seat availability - this validates:
        // 1. Event exists
        // 2. Seats exist
        // 3. Seats belong to the specified event
        // 4. Seats are available (not locked/sold)
        const availabilityCheck = await this.seatsService.checkSeatsAvailability(
            dto.seatIds,
            dto.eventId
        );
        
        if (!availabilityCheck.allAvailable) {
            throw new ConflictException(
                `Seats already taken: ${availabilityCheck.takenSeatIds.join(', ')}`
            );
        }

        // Lock seats - this also:
        // 1. Validates seats belong to the event
        // 2. Updates event capacity
        const seats = await this.seatsService.lockSeats(dto.seatIds, dto.eventId);
        const totalPrice = seats.reduce((sum, s) => sum + Number(s.price), 0);
        const expiresAt = new Date(Date.now() + RESERVATION_EXPIRATION_MINUTES * 60 * 1000);

        const reservation = this.reservationRepo.create({
            userId,
            eventId: dto.eventId,
            totalPrice,
            status: ReservationStatus.PENDING,
            expiresAt,
        });
        const savedReservation = await this.reservationRepo.save(reservation);

        await this.seatsService.setReservationForSeats(
            dto.seatIds,
            dto.eventId,
            savedReservation.id,
        );

        return this.findById(savedReservation.id);
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
        await this.seatsService.releaseSeats(
            reservation.seats.map((s) => s.id),
            reservation.eventId
        );
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

        try {
            const expired = await this.reservationRepo.find({
                where: { 
                    status: ReservationStatus.PENDING, 
                    expiresAt: LessThan(new Date()) 
                },
                relations: ['seats'],
            });

            if (expired.length === 0) {
                return 0;
            }

            // First, save the expired status to reservations
            for (const reservation of expired) {
                reservation.status = ReservationStatus.EXPIRED;
            }
            await this.reservationRepo.save(expired);

            // Then, release seats for all expired reservations
            for (const reservation of expired) {
                if (reservation.seats?.length > 0) {
                    const seatIds = reservation.seats.map((s) => s.id);
                    await this.seatsService.releaseSeats(seatIds, reservation.eventId);
                }
            }

            return expired.length;
        } catch (error) {
            return 0;
        } finally {
            this.isExpiringWorking = false;
        }
    }

    // Get seats for an event
    async findSeatsByEventId(eventId: string) {
        return this.seatsService.findByEventId(eventId);
    }
}