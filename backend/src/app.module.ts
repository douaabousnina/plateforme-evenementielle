import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './src/events/events.module';
import { EventsModule } from './events/events.module';
import { SeatingPlanModule } from './seating-plan/seating-plan.module';

@Module({
  imports: [EventsModule, SeatingPlanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
