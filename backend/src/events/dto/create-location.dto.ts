import {
  IsString,
  IsEnum,
  IsOptional,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { LocationType } from 'src/common/enums/event.enum';

export class CreateLocationDto {
  @IsEnum(LocationType)
  type: LocationType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  venueName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsUrl()
  onlineUrl?: string;
}