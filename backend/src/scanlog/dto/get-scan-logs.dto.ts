import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScanStatus } from '../enums/scan-status.enum';

export class GetScanLogsDto {
  @ApiProperty({ description: 'Filter by ticket ID', required: false })
  @IsOptional()
  @IsUUID()
  ticketId?: string;

  @ApiProperty({ description: 'Filter by event ID', required: false })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @ApiProperty({ description: 'Filter by scanner user ID', required: false })
  @IsOptional()
  @IsUUID()
  scannedBy?: string;

  @ApiProperty({ description: 'Filter by scan status', enum: ScanStatus, required: false })
  @IsOptional()
  @IsEnum(ScanStatus)
  status?: ScanStatus;

  @ApiProperty({ description: 'Filter from this date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Filter until this date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
