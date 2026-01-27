import { Test, TestingModule } from '@nestjs/testing';
import { SeatingPlanController } from './seating-plan.controller';

describe('SeatingPlanController', () => {
  let controller: SeatingPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatingPlanController],
    }).compile();

    controller = module.get<SeatingPlanController>(SeatingPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
