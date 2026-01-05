import { IsNotEmpty } from 'class-validator';

export class CancelReservationDto {
  @IsNotEmpty()
  reason?: string;
}
