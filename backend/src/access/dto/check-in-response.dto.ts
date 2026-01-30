import { ApiProperty } from '@nestjs/swagger';
import { Ticket } from '../entities/ticket.entity';

export class CheckInResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  ticketId?: string;

  @ApiProperty({ required: false })
  eventName?: string;

  @ApiProperty({ required: false })
  scannedAt?: Date;

  @ApiProperty({ required: false })
  status?: string;

  @ApiProperty({ required: false, type: () => Ticket })
  ticket?: Ticket;
}
