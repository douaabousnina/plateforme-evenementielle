import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum SectionType {
  VIP = 'VIP',
  REGULAR = 'REGULAR',
  STANDING = 'STANDING'
}

export class SeatDto {
  @ApiProperty()
  @IsNumber()
  seatNumber: number;

  @ApiProperty()
  @IsString()
  status: string; // 'available', 'reserved', 'sold'
}

export class RowDto {
  @ApiProperty()
  @IsNumber()
  rowNumber: number;

  @ApiProperty({ type: [SeatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}

export class SectionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: SectionType })
  @IsEnum(SectionType)
  type: SectionType;

  @ApiProperty()
  @IsNumber()
  capacity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ type: [RowDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RowDto)
  rows?: RowDto[];
}

export class LayoutDto {
  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsString()
  stagePosition: string; // 'top', 'bottom', 'left', 'right'
}

export class SeatingPlanDto {
  @ApiProperty({ type: [SectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];

  @ApiProperty({ type: LayoutDto })
  @ValidateNested()
  @Type(() => LayoutDto)
  layout: LayoutDto;
}