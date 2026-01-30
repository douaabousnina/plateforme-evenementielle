import { Test, TestingModule } from '@nestjs/testing';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

describe('AccessController', () => {
  let controller: AccessController;
  let service: AccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessController],
      providers: [
        {
          provide: AccessService,
          useValue: {
            generateQrCode: jest.fn(),
            checkIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccessController>(AccessController);
    service = module.get<AccessService>(AccessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('generateQrCode', () => {
    it('should generate QR code for a ticket', async () => {
      const dto = { ticketId: 'test-ticket-id' };
      const result = { qrCode: 'base64-qr-code-data', qrToken: 'secure-token' };

      jest.spyOn(service, 'generateQrCode').mockResolvedValue(result);

      expect(await controller.generateQrCode(dto)).toBe(result);
      expect(service.generateQrCode).toHaveBeenCalledWith(dto.ticketId);
    });
  });

  describe('checkIn', () => {
    it('should check in a ticket successfully', async () => {
      const dto = {
        qrCode: 'qr-code-data',
        scannedBy: 'user-id',
        location: 'Main Entrance',
      };
      const result = {
        success: true,
        message: 'Check-in successful',
        status: 'valid',
      };

      jest.spyOn(service, 'checkIn').mockResolvedValue(result);

      expect(await controller.checkIn(dto)).toBe(result);
      expect(service.checkIn).toHaveBeenCalledWith(dto);
    });
  });
});
