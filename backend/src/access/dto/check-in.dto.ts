import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({ description: 'QR code data from the ticket' })
  @IsNotEmpty()
  @IsString()
  qrCode: string;

  @ApiProperty({ description: 'User ID of the controller scanning the ticket' })
  @IsNotEmpty()
  @IsUUID()
  scannedBy: string;

  @ApiProperty({ description: 'Location where the scan is happening', required: false })
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Device information', required: false })
  @IsString()
  deviceInfo?: string;
}
