import { IsArray, ArrayNotEmpty, IsString, IsNotEmpty } from 'class-validator';

export class LockSeatsDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsArray()
  @ArrayNotEmpty()
  seatIds: string[];
}
