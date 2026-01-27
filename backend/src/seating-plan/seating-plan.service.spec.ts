import { Test, TestingModule } from '@nestjs/testing';
import { SeatingPlanService } from './seating-plan.service';

describe('SeatingPlanService', () => {
  let service: SeatingPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatingPlanService],
    }).compile();

    service = module.get<SeatingPlanService>(SeatingPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
