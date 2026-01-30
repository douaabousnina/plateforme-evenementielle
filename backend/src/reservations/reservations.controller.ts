import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  /**
   * LOCK SEATS - Client only
   * Create a pending reservation with locked seats
   */
  @Post('lock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async lockSeats(
    @Body() lockSeatsDto: LockSeatsDto,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    return await this.reservationsService.lockSeats(userId, lockSeatsDto);
  }

  /**
   * CONFIRM RESERVATION - Client only
   * Confirm after successful payment
   */
  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async confirm(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const userId = req.user.sub;

    // Verify user owns this reservation
    const reservation = await this.reservationsService.findById(id);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only confirm your own reservations');
    }

    return await this.reservationsService.confirm(id);
  }

  /**
   * CANCEL RESERVATION - Client only
   * Cancel before payment/expiration
   */
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async cancel(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const userId = req.user.sub;

    // Verify user owns this reservation
    const reservation = await this.reservationsService.findById(id);
    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    return await this.reservationsService.cancel(id);
  }

  /**
   * GET USER'S RESERVATIONS - Client only
   * View booking history
   */
  @Get('my-reservations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT)
  async findMyReservations(@Req() req: any) {
    const userId = req.user.sub;
    return await this.reservationsService.findByUser(userId);
  }

  /**
   * GET SINGLE RESERVATION - Client and Organizer
   * View reservation details
   * Organizers can view reservations for their events
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENT, Role.ORGANIZER)
  async findOne(
    @Param('id') id: string,
    @Req() req: any
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;

    const reservation = await this.reservationsService.findById(id);

    // Clients can only view their own reservations
    if (userRole === Role.CLIENT && reservation.userId !== userId) {
      throw new ForbiddenException('You can only view your own reservations');
    }

    // Organizers can view reservations for their events
    // (You may want to add event ownership verification here)

    return reservation;
  }
}