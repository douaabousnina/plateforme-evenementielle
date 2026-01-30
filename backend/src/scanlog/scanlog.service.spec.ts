import { Test, TestingModule } from '@nestjs/testing';
import { ScanlogService } from './scanlog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScanLog } from './entities/scan-log.entity';
import { Repository } from 'typeorm';

describe('ScanlogService', () => {
  let service: ScanlogService;
  let scanLogRepository: Repository<ScanLog>;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScanlogService,
        {
          provide: getRepositoryToken(ScanLog),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn((dto) => dto),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile();

    service = module.get<ScanlogService>(ScanlogService);
    scanLogRepository = module.get<Repository<ScanLog>>(getRepositoryToken(ScanLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getScanLogs', () => {
    it('should return scan logs based on filters', async () => {
      const filters = { eventId: 'event-id' };
      const result = [{ id: 'log-1', eventId: 'event-id' }];

      mockQueryBuilder.getMany.mockResolvedValue(result);

      expect(await service.getScanLogs(filters)).toBe(result);
      expect(scanLogRepository.createQueryBuilder).toHaveBeenCalledWith('scanLog');
    });
  });

  describe('getScanLogById', () => {
    it('should return a specific scan log', async () => {
      const id = 'log-id';
      const result = { id, eventId: 'event-id' };

      jest.spyOn(scanLogRepository, 'findOne').mockResolvedValue(result as any);

      expect(await service.getScanLogById(id)).toBe(result);
      expect(scanLogRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw error if scan log not found', async () => {
      const id = 'invalid-id';

      jest.spyOn(scanLogRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getScanLogById(id)).rejects.toThrow();
    });
  });

  describe('createScanLog', () => {
    it('should create and save a new scan log', async () => {
      const scanLogData = {
        ticketId: 'ticket-id',
        eventId: 'event-id',
        scannedBy: 'user-id',
        status: 'valid' as any,
      };

      jest.spyOn(scanLogRepository, 'save').mockResolvedValue({ id: 'new-log', ...scanLogData } as any);

      const result = await service.createScanLog(scanLogData);

      expect(result).toHaveProperty('id');
      expect(scanLogRepository.save).toHaveBeenCalled();
    });
  });
});
