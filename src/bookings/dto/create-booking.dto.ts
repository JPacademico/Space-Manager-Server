export class CreateBookingDto {
    userId: string;        // Quem está pedindo
    spaceId: string;       // Qual sala
    startDate: string;     // Data de início (formato ISO string)
    durationWeeks: number; // Quantas semanas vai durar
}