import { IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  userId!: string;

  @IsString()
  spaceId!: string;

  @IsDateString() // Garante que é uma data ISO válida
  startDate!: string;

  @IsInt() // Garante que é número inteiro
  @Min(1)  // Mínimo de 1 semana
  durationWeeks!: number;
}