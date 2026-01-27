import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event])
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService], // Export service for use by other modules (Reservations, etc.)
})
export class EventsModule {}