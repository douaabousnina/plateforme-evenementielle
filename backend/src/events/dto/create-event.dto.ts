import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsUrl
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '../enums/event-category.enum';
import { SeatingPlanDto } from './seating-plan.dto';

export class CreateEventDto {
  @ApiProperty({ example: 'Summer Music Festival 2025' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'The biggest summer music festival featuring top artists' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: EventCategory, example: EventCategory.CONCERT })
  @IsEnum(EventCategory)
  category: EventCategory;

  @ApiProperty({ example: '2025-07-15T18:00:00Z' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: 'Central Park, New York' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Madison Square Garden' })
  @IsString()
  @IsOptional()
  venueName?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(1)
  totalCapacity: number;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  bannerImage?: string;

  @ApiProperty({ type: SeatingPlanDto })
  @ValidateNested()
  @Type(() => SeatingPlanDto)
  seatingPlan: SeatingPlanDto;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  maxTicketsPerUser?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  salesStartDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  salesEndDate?: Date;
}