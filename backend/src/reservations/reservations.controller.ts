import {
    Controller,
    Post,
    Patch,
    Get,
    Param,
    Body,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { LockSeatsDto } from './dto/lock-seats.dto';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    // LOCK SEATS & CREATE RESERVATION
    @Post('lock')
    async lockSeats(
        @Body() lockSeatsDto: LockSeatsDto,
    ) {
        const userId = 'sample-user-id'; // TODO: get this from auth context later
        return this.reservationsService.lockSeats(userId, lockSeatsDto);
    }

    // CONFIRM RESERVATION
    @Patch(':id/confirm')
    async confirm(@Param('id') reservationId: string) {
        return this.reservationsService.confirm(reservationId);
    }

    // CANCEL RESERVATION
    @Patch(':id/cancel')
    async cancel(@Param('id') reservationId: string) {
        return this.reservationsService.cancel(reservationId);
    }

    // GET SINGLE RESERVATION
    @Get(':id')
    async findOne(@Param('id') reservationId: string) {
        return this.reservationsService.findById(reservationId);
    }

    // GET RESERVATIONS BY USER
    @Get('user/:userId')
    async findByUser(@Param('userId') userId: string) {
        return this.reservationsService.findByUser(userId);
    }

    // GET SEATS BY EVENT
    @Get('seats/event/:eventId')
    async findSeatsByEventId(@Param('eventId') eventId: string) {
        return this.reservationsService.findSeatsByEventId(eventId);
    }
}
