import { IsOptional, IsEnum } from 'class-validator';
import { EventStatus } from 'src/common/enums/event.enum';

export class UpdateEventStatusDto {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
