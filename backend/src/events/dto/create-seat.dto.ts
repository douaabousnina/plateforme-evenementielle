import { IsString, IsNumber, IsUUID, IsOptional, IsEnum, IsDecimal } from 'class-validator';
import { SeatStatus } from 'src/common/enums/reservation.enum';

export class CreateSeatDto {
  @IsUUID()
  eventId: string;

  @IsString()
  row: string;

  @IsNumber()
  number: number;

  @IsString()
  section: string;

  @IsString()
  category: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsOptional()
  @IsUUID()
  reservationId?: string;

  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;
}
