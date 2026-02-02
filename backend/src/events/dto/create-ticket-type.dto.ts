import { IsEnum, IsNumber, IsInt, Min } from 'class-validator';
import { TicketTypeEnum } from '../entities/ticket-type.entity';

export class CreateTicketTypeDto {
  @IsEnum(TicketTypeEnum)
  type: TicketTypeEnum;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  capacity: number;
}
