import { Module } from '@nestjs/common';
import { SeatingPlanService } from './seating-plan.service';
import { SeatingPlanController } from './seating-plan.controller';

@Module({
  providers: [SeatingPlanService],
  controllers: [SeatingPlanController]
})
export class SeatingPlanModule {}
