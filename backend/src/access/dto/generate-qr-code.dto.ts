import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateQrCodeDto {
  @ApiProperty({ description: 'Ticket ID to generate QR code for' })
  @IsNotEmpty()
  @IsUUID()
  ticketId: string;
}
