import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './services/events.service';
import { Event } from './entities/event.entity';
import { Location } from './entities/location.entity';
import { Seat } from './entities/seat.entity';
import { TicketType } from './entities/ticket-type.entity';
import { SeatsService } from './services/seats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Location, Seat, TicketType])],
  controllers: [EventsController],
  providers: [EventsService, SeatsService],
  exports: [EventsService, SeatsService],
})
export class EventsModule {}
