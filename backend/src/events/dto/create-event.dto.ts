import {
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
  IsOptional,
  IsUUID,
  MaxLength,
  IsUrl,
  IsArray,
  ValidateNested,
  IsObject,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory, EventStatus, EventType } from 'src/common/enums/event.enum';
import { CreateLocationDto } from './create-location.dto';

export class CreateEventDto {
  // Basic Details
  @IsString()
  @MaxLength(255)
  title: string;

  @IsEnum(EventType)
  type: EventType;

  @IsEnum(EventCategory)
  category: EventCategory;

  // Date & Time
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsDate()
  @Type(() => Date)
  endTime: Date;

  // Location
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location?: CreateLocationDto;

  // Description
  @IsString()
  description: string;

  // Seats
  @IsBoolean()
  hasSeatingPlan: boolean;

  @IsNumber()
  @Min(1)
  totalCapacity: number;

  @IsNumber()
  @Min(0)
  availableCapacity: number;

  // Media
  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  gallery?: string[];

  // Status
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @IsString()
  organizerId: string;
}
