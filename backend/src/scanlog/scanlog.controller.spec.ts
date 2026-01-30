import { Test, TestingModule } from '@nestjs/testing';
import { ScanlogController } from './scanlog.controller';
import { ScanlogService } from './scanlog.service';

describe('ScanlogController', () => {
  let controller: ScanlogController;
  let service: ScanlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanlogController],
      providers: [
        {
          provide: ScanlogService,
          useValue: {
            getScanLogs: jest.fn(),
            getScanLogById: jest.fn(),
            getScanLogsByTicket: jest.fn(),
            getScanLogsByEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScanlogController>(ScanlogController);
    service = module.get<ScanlogService>(ScanlogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScanLogs', () => {
    it('should return filtered scan logs', async () => {
      const dto = { eventId: 'event-id' };
      const result = [{ id: 'log-1', eventId: 'event-id' }];

      jest.spyOn(service, 'getScanLogs').mockResolvedValue(result as any);

      expect(await controller.getScanLogs(dto)).toBe(result);
      expect(service.getScanLogs).toHaveBeenCalledWith(dto);
    });
  });

  describe('getScanLogById', () => {
    it('should return a specific scan log', async () => {
      const id = 'log-id';
      const result = { id, eventId: 'event-id' };

      jest.spyOn(service, 'getScanLogById').mockResolvedValue(result as any);

      expect(await controller.getScanLogById(id)).toBe(result);
      expect(service.getScanLogById).toHaveBeenCalledWith(id);
    });
  });
});
