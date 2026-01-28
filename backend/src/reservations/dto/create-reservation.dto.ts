import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsArray()
  @ArrayNotEmpty()
  seatIds: string[];
}
