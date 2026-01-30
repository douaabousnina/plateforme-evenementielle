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
     * Also validates that all seats belong to the specified event
     */
    async checkSeatsAvailability(
        seatIds: string[],
        eventId: string
    ): Promise<{
        allAvailable: boolean;
        takenSeatIds: string[];
    }> {
        // First, validate that the event exists
        await this.eventsService.findOne(eventId);

        // Fetch the seats
        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
            },
        });

        // Check if all requested seats exist
        if (seats.length !== seatIds.length) {
            const foundIds = seats.map(s => s.id);
            const missingIds = seatIds.filter(id => !foundIds.includes(id));
            throw new NotFoundException(
                `Seats not found: ${missingIds.join(', ')}`
            );
        }

        // Verify all seats belong to the specified event
        const seatsFromDifferentEvent = seats.filter(seat => seat.eventId !== eventId);
        if (seatsFromDifferentEvent.length > 0) {
            throw new BadRequestException(
                `Seats ${seatsFromDifferentEvent.map(s => s.id).join(', ')} do not belong to event ${eventId}`
            );
        }

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
     * Validates seats belong to the event and updates event capacity
     */
    async lockSeats(seatIds: string[], eventId: string): Promise<Seat[]> {
        // Validate event exists
        const event = await this.eventsService.findOne(eventId);

        // Fetch seats
        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
            },
        });

        if (seats.length !== seatIds.length) {
            const foundIds = seats.map(s => s.id);
            const missingIds = seatIds.filter(id => !foundIds.includes(id));
            throw new NotFoundException(
                `Seats not found: ${missingIds.join(', ')}`
            );
        }

        // Verify all seats belong to this event
        const seatsFromDifferentEvent = seats.filter(seat => seat.eventId !== eventId);
        if (seatsFromDifferentEvent.length > 0) {
            throw new BadRequestException(
                `Cannot lock seats from different event. Expected event ${eventId}, but seats ${seatsFromDifferentEvent.map(s => s.id).join(', ')} belong to different events`
            );
        }

        // Check if any seat is already taken
        const takenSeats = seats.filter(
            seat => seat.status === SeatStatus.LOCKED || seat.status === SeatStatus.SOLD
        );

        if (takenSeats.length > 0) {
            throw new ConflictException(
                `Seats already taken: ${takenSeats.map(s => s.category + " : " + s.number).join(', ')}`
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
     * Assign a reservation to already-locked seats (sets reservationId).
     * Call after lockSeats when creating a reservation.
     */
    async setReservationForSeats(
        seatIds: string[],
        eventId: string,
        reservationId: string,
    ): Promise<Seat[]> {
        await this.eventsService.findOne(eventId);
        const seats = await this.seatRepository.find({
            where: { id: In(seatIds) },
        });
        if (seats.length !== seatIds.length) {
            throw new NotFoundException('Some seats not found');
        }
        const invalid = seats.filter((s) => s.eventId !== eventId);
        if (invalid.length > 0) {
            throw new BadRequestException(
                `Seats do not belong to event ${eventId}`,
            );
        }
        seats.forEach((seat) => {
            seat.reservationId = reservationId;
        });
        return this.seatRepository.save(seats);
    }

    /**
     * Find all seats for a given reservation (for loading reservation with seats).
     */
    async findByReservationId(reservationId: string): Promise<Seat[]> {
        return this.seatRepository.find({
            where: { reservationId },
            order: { section: 'ASC', row: 'ASC', number: 'ASC' },
        });
    }

    /**
     * Mark seats as sold (after payment confirmation)
     * Seats should already be locked before calling this
     */
    async markSeatsAsSold(seatIds: string[], eventId: string): Promise<Seat[]> {
        // Validate event exists
        await this.eventsService.findOne(eventId);

        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
            },
        });

        if (seats.length !== seatIds.length) {
            throw new NotFoundException(
                `Some seats not found. Requested: ${seatIds.length}, Found: ${seats.length}`
            );
        }

        // Verify all seats belong to this event
        const seatsFromDifferentEvent = seats.filter(seat => seat.eventId !== eventId);
        if (seatsFromDifferentEvent.length > 0) {
            throw new BadRequestException(
                `Seats ${seatsFromDifferentEvent.map(s => s.id).join(', ')} do not belong to event ${eventId}`
            );
        }

        // Verify seats are locked (should be from a reservation)
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
     * Release seats (make them available again)
     * Used when: reservation expires, user cancels, or payment fails
     * Also updates event capacity back
     */
    async releaseSeats(seatIds: string[], eventId: string): Promise<Seat[]> {
        // Validate event exists
        const event = await this.eventsService.findOne(eventId);

        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
            },
        });

        if (seats.length !== seatIds.length) {
            throw new NotFoundException(
                `Some seats not found. Requested: ${seatIds.length}, Found: ${seats.length}`
            );
        }

        // Verify all seats belong to this event
        const seatsFromDifferentEvent = seats.filter(seat => seat.eventId !== eventId);
        if (seatsFromDifferentEvent.length > 0) {
            throw new BadRequestException(
                `Seats ${seatsFromDifferentEvent.map(s => s.id).join(', ')} do not belong to event ${eventId}`
            );
        }

        // Count only locked seats (not sold ones) for capacity release
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
        // Validate event exists
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
     * Find a single seat by ID and optionally validate it belongs to an event
     */
    async findById(id: string, eventId?: string): Promise<Seat> {
        const seat = await this.seatRepository.findOne({
            where: { id },
        });

        if (!seat) {
            throw new NotFoundException(`Seat with ID ${id} not found`);
        }

        // If eventId is provided, validate the seat belongs to that event
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
        // Validate event exists
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

    /**
     * Validate that multiple seats all belong to the same event
     * Useful for batch operations
     */
    async validateSeatsForEvent(seatIds: string[], eventId: string): Promise<void> {
        await this.eventsService.findOne(eventId);

        const seats = await this.seatRepository.find({
            where: {
                id: In(seatIds),
            },
        });

        if (seats.length !== seatIds.length) {
            throw new NotFoundException('Some seats not found');
        }

        const invalidSeats = seats.filter(seat => seat.eventId !== eventId);
        if (invalidSeats.length > 0) {
            throw new BadRequestException(
                `These seats do not belong to event ${eventId}: ${invalidSeats.map(s => s.id).join(', ')}`
            );
        }
    }
}