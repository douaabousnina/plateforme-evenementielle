import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  eventId: string;

  @IsArray()
  seatIds: string[];
}
