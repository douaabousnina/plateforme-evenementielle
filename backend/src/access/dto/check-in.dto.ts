import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  qrData: string;

  @IsString()
  @IsNotEmpty()
  scannedBy: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
