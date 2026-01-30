import { ApiProperty } from '@nestjs/swagger';
import { ScanStatus } from '../enums/scan-status.enum';

export class ScanLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ticketId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty({ required: false })
  eventName?: string;

  @ApiProperty()
  scannedBy: string;

  @ApiProperty()
  scannedAt: Date;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty({ enum: ScanStatus })
  status: ScanStatus;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  deviceInfo?: string;
}
