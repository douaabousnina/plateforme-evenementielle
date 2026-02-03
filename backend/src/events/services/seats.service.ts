import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from '../entities/seat.entity';
import { Repository, In } from 'typeorm';
import { SeatStatus } from '../../common/enums/reservation.enum';
import { EventsService } from './events.service';

@Injectable()
export class SeatsService {
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        private readonly eventsService: EventsService,
    ) { }

    /**
     * Check if seats are available for reservation 
     * & validates that all seats belong to the specified event
     */
    async checkSeatsAvailability(
        seatIds: string[],
        eventId: string
    ): Promise<{
        allAvailable: boolean;
        takenSeatIds: string[];
    }> {
        const seats = await this.fetchAndValidateSeats(seatIds, eventId);

        // Check for taken seats
        const takenSeats = seats.filter(
            seat => seat.status === SeatStatus.LOCKED || seat.status === SeatStatus.SOLD
        );

        return {
            allAvailable: takenSeats.length === 0,
            takenSeatIds: takenSeats.map(s => s.id),
        };
    }

    /**
     * Lock seats for a pending reservation
     */
    async lockSeats(seatIds: string[], eventId: string): Promise<Seat[]> {
        const event = await this.eventsService.findOne(eventId);
        const seats = await this.fetchAndValidateSeats(seatIds, eventId);

        // Check if any seat is already taken
        const takenSeats = seats.filter(
            seat => seat.status === SeatStatus.LOCKED || seat.status === SeatStatus.SOLD
        );

        if (takenSeats.length > 0) {
            throw new ConflictException(
                `Seats already taken: ${takenSeats.map(s => s.id).join(', ')}`
            );
        }

        // Update event capacity if event tracks capacity
        if (event.hasSeatingPlan) {
            await this.eventsService.updateCapacity(eventId, seats.length);
        }

        // Lock all seats
        seats.forEach(seat => {
            seat.status = SeatStatus.LOCKED;
        });

        return this.seatRepository.save(seats);
    }

    /**
     * Assign a reservation to already-locked seats
     */
    async setReservationForSeats(
        seatIds: string[],
        eventId: string,
        reservationId: string,
    ): Promise<Seat[]> {
        const seats = await this.fetchAndValidateSeats(seatIds, eventId);

        seats.forEach((seat) => {
            seat.reservationId = reservationId;
        });

        return this.seatRepository.save(seats);
    }

    /**
     * Find all seats for a given reservation
     */
    async findByReservationId(reservationId: string): Promise<Seat[]> {
        return this.seatRepository.find({
            where: { reservationId },
            order: { section: 'ASC', row: 'ASC', number: 'ASC' },
        });
    }

    /**
     * Mark seats as sold (after payment confirmation)
     */
    async markSeatsAsSold(seatIds: string[], eventId: string): Promise<Seat[]> {
        const seats = await this.fetchAndValidateSeats(seatIds, eventId);

        // Verify seats are locked
        const notLockedSeats = seats.filter(seat => seat.status !== SeatStatus.LOCKED);
        if (notLockedSeats.length > 0) {
            throw new BadRequestException(
                `Cannot mark seats as sold - they are not locked: ${notLockedSeats.map(s => s.id).join(', ')}`
            );
        }

        seats.forEach(seat => {
            seat.status = SeatStatus.SOLD;
        });

        return this.seatRepository.save(seats);
    }

    /**
     * Used when: reservation expires / user cancels / payment fails
     */
    async releaseSeats(seatIds: string[], eventId: string): Promise<Seat[]> {
        const event = await this.eventsService.findOne(eventId);
        const seats = await this.fetchAndValidateSeats(seatIds, eventId);

        // Count only locked seats for capacity release
        const lockedSeats = seats.filter(seat => seat.status === SeatStatus.LOCKED);

        // Update event capacity if event tracks capacity and seats were locked
        if (event.hasSeatingPlan && lockedSeats.length > 0) {
            await this.eventsService.releaseCapacity(eventId, lockedSeats.length);
        }

        seats.forEach(seat => {
            seat.status = SeatStatus.AVAILABLE;
            seat.reservationId = null;
        });

        return this.seatRepository.save(seats);
    }

    /**
     * Find all seats for a specific event
     */
    async findByEventId(eventId: string): Promise<Seat[]> {
        await this.eventsService.findOne(eventId);

        return this.seatRepository.find({
            where: { eventId },
            order: {
                section: 'ASC',
                row: 'ASC',
                number: 'ASC'
            },
        });
    }

    /**
     * Find a single seat by id & (optionally) validate it belongs to an event
     */
    async findById(id: string, eventId?: string): Promise<Seat> {
        const seat = await this.seatRepository.findOne({
            where: { id },
        });

        if (!seat) {
            throw new NotFoundException(`Seat with ID ${id} not found`);
        }

        if (eventId && seat.eventId !== eventId) {
            throw new BadRequestException(
                `Seat ${id} does not belong to event ${eventId}`
            );
        }

        return seat;
    }

    /**
     * Get available seats count for an event
     */
    async getAvailableSeatsCount(eventId: string): Promise<number> {
        await this.eventsService.findOne(eventId);

        return this.seatRepository.count({
            where: {
                eventId,
                status: SeatStatus.AVAILABLE,
            },
        });
    }

    /**
     * Get seat statistics for an event
     */
    async getSeatStatistics(eventId: string): Promise<{
        total: number;
        available: number;
        locked: number;
        sold: number;
    }> {
        const seats = await this.findByEventId(eventId);

        return {
            total: seats.length,
            available: seats.filter(s => s.status === SeatStatus.AVAILABLE).length,
            locked: seats.filter(s => s.status === SeatStatus.LOCKED).length,
            sold: seats.filter(s => s.status === SeatStatus.SOLD).length,
        };
    }

    // helpers
    private async fetchAndValidateSeats(seatIds: string[], eventId: string): Promise<Seat[]> {
        // Validate event exists
        await this.eventsService.findOne(eventId);

        // Fetch seats that belong to this event
        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
                eventId: eventId,
            },
        });

        // Check if all seats were found
        if (seats.length !== seatIds.length) {
            const foundIds = seats.map(s => s.id);
            const missingIds = seatIds.filter(id => !foundIds.includes(id));
            throw new BadRequestException(
                `Seats not found or do not belong to event ${eventId}: ${missingIds.join(', ')}`
            );
        }

        return seats;
    }
}