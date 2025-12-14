import { IsString, IsInt, IsDateString, Min, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  userId!: string;

  @IsString()
  spaceId!: string;

  @IsDateString()
  startDate!: string;

  @IsInt()
  @Min(1)
  durationWeeks!: number;
}