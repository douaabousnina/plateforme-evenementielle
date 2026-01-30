import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateSeatHoldDto {
  @ApiProperty({ example: 2, description: 'Number of seats to hold temporarily' })
  @IsInt()
  @Min(1)
  seats: number;

  @ApiProperty({
    required: false,
    example: '00000000-0000-0000-0000-000000000001',
    description: 'Optional userId (future auth integration)',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}

