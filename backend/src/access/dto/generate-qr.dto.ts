import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateQrDto {
  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
