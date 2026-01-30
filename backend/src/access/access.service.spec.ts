import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';

describe('AccessService', () => {
  let service: AccessService;
  let ticketRepository: Repository<Ticket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccessService>(AccessService);
    ticketRepository = module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateQrCode', () => {
    it('should generate QR code for a valid ticket', async () => {
      const ticketId = 'test-ticket-id';
      const ticket = {
        id: ticketId,
        reservationId: 'reservation-id',
      };

      jest.spyOn(ticketRepository, 'findOne').mockResolvedValue(ticket as any);

      const result = await service.generateQrCode(ticketId);

      expect(result).toHaveProperty('qrCode');
      expect(ticketRepository.findOne).toHaveBeenCalledWith({
        where: { id: ticketId },
      });
    });

    it('should throw error if ticket not found', async () => {
      const ticketId = 'invalid-ticket-id';

      jest.spyOn(ticketRepository, 'findOne').mockResolvedValue(null);

      await expect(service.generateQrCode(ticketId)).rejects.toThrow();
    });
  });

  describe('checkIn', () => {
    it('should successfully check in a valid ticket', async () => {
      const dto = {
        qrCode: 'valid-qr-code',
        scannedBy: 'user-id',
        location: 'Main Entrance',
      };

      // Add your test implementation
      expect(service.checkIn).toBeDefined();
    });
  });
});
