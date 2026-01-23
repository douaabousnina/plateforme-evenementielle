import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Seat } from './seat.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Seat])],
  controllers: [EventsController, SeatsController],
  providers: [EventsService, SeatsService],
  exports: [EventsService, SeatsService],
})
export class EventsModule {}
