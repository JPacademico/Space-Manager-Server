import { IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
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