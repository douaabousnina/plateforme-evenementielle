import {
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';
import { EventStatus } from '../entities/event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  image: string;

  @IsEnum(EventStatus)
  status: EventStatus;

  @IsNumber()
  totalSeats: number;

  @IsNumber()
  availableSeats: number;

  @IsString()
  organizerId: string;
}
