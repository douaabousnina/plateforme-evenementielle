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
  
  // TODO: Uncomment when auth module is ready
  // import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('reservations')
  export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) {}
  
    // LOCK SEATS => Create a pending reservation
    @Post('lock')
    // TODO: Uncomment when auth is ready
    // @UseGuards(JwtAuthGuard)
    async lockSeats(
      @Body() lockSeatsDto: LockSeatsDto,
      @Req() req: any
    ) {
      // TODO: Get userId from JWT token
      // const userId = req.user.id;
      const userId = 'temp-user-id'; // Temporary for testing
  
      return await this.reservationsService.lockSeats(userId, lockSeatsDto);
    }
  
    // CONFIRM RESERVATION => After successful payment
    @Patch(':id/confirm')
    // TODO: Uncomment when auth is ready
    // @UseGuards(JwtAuthGuard)
    async confirm(
      @Param('id') id: string,
      @Req() req: any
    ) {
      // TODO: Verify user owns this reservation
      // const userId = req.user.id;
      
      return await this.reservationsService.confirm(id);
    }
  
    // CANCEL RESERVATION => User cancels before payment/expiration
    @Patch(':id/cancel')
    // TODO: Uncomment when auth is ready
    // @UseGuards(JwtAuthGuard)
    async cancel(
      @Param('id') id: string,
      @Req() req: any
    ) {
      // TODO: Verify user owns this reservation
      // const userId = req.user.id;
      
      return await this.reservationsService.cancel(id);
    }
  
    // GET USER'S RESERVATIONS => Booking history
    @Get('my-reservations')
    // TODO: Uncomment when auth is ready
    // @UseGuards(JwtAuthGuard)
    async findMyReservations(@Req() req: any) {
      // TODO: Get userId from JWT token
      // const userId = req.user.id;
      const userId = 'temp-user-id'; // Temporary
  
      return await this.reservationsService.findByUser(userId);
    }
  
    // GET SINGLE RESERVATION => View details
    @Get(':id')
    // TODO: Uncomment when auth is ready
    // @UseGuards(JwtAuthGuard)
    async findOne(
      @Param('id') id: string,
      @Req() req: any
    ) {
      // TODO: Verify user owns this reservation
      // const userId = req.user.id;
      
      return await this.reservationsService.findById(id);
    }
  }