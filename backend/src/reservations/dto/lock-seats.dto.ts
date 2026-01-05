import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class LockSeatsDto {
  @IsString()
  eventId: string;

  @IsArray()
  @ArrayNotEmpty()
  seatIds: string[];
}
