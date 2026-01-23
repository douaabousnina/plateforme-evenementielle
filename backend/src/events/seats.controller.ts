import { Controller, Get, Param } from '@nestjs/common';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('event/:eventId')
  async getSeatsForEvent(@Param('eventId') eventId: string) {
    return this.seatsService.findByEventId(eventId);
  }

  @Get(':id')
  async getSeat(@Param('id') id: string) {
    return this.seatsService.findById(id);
  }
}
