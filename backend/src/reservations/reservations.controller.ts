import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { ReservationsService } from './reservations.service';
  import { LockSeatsDto } from './dto/lock-seats.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @Controller('reservations')
  export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}
  
    // LOCK SEATS => Create a pending reservation
    @Post('lock')
    @UseGuards(JwtAuthGuard)
    async lockSeats(
      @Body() lockSeatsDto: LockSeatsDto,
      @Req() req: any
    ) {
      const userId = req.user.sub;
  
      return await this.reservationsService.lockSeats(userId, lockSeatsDto);
    }
  
    // CONFIRM RESERVATION => After successful payment
    @Patch(':id/confirm')
    @UseGuards(JwtAuthGuard)
    async confirm(
      @Param('id') id: string,
      @Req() req: any
    ) {
      const userId = req.user.sub;
      
      return await this.reservationsService.confirm(id);
    }
  
    // CANCEL RESERVATION => User cancels before payment/expiration
    @Patch(':id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancel(
      @Param('id') id: string,
      @Req() req: any
    ) {
      const userId = req.user.sub;
      
      return await this.reservationsService.cancel(id);
    }
  
    // GET USER'S RESERVATIONS => Booking history
    @Get('my-reservations')
    @UseGuards(JwtAuthGuard)
    async findMyReservations(@Req() req: any) {
      const userId = req.user.sub;
  
      return await this.reservationsService.findByUser(userId);
    }
  
    // GET SINGLE RESERVATION => View details
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
      @Param('id') id: string,
      @Req() req: any
    ) {
      const userId = req.user.sub;
      
      return await this.reservationsService.findById(id);
    }
  }