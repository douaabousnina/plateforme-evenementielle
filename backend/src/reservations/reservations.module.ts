import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { EventsModule } from 'src/events/events.module';
import { Event } from '../events/entities/event.entity';
import { AccessModule } from '../access/access.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Event]),
    AccessModule, EventsModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
