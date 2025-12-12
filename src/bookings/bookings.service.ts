import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // 1. Lógica de Solicitação (Usuário)
  async create(createBookingDto: CreateBookingDto) {
    const { userId, spaceId, startDate, durationWeeks } = createBookingDto;

    // Calcular Data Final
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (durationWeeks * 7)); // Soma as semanas em dias

    // Validação Simples: Data não pode ser no passado
    if (start < new Date()) {
      throw new BadRequestException('A data de início não pode ser no passado.');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId,
        startDate: start,
        endDate: end,
        status: 'PENDING', // REGRA: Sempre começa como Pendente
      },
    });
  }

  // 2. Lógica de Aprovação (Admin)
  async approveBooking(bookingId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'APPROVED' },
    });
  }

  // 3. Lógica de "Meus Agendamentos" (Usuário - Apenas Aprovados)
  async findMyAppointments(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId: userId,
        status: 'APPROVED', // Só retorna o que já foi aprovado
      },
      include: { space: true }, // Traz os detalhes da sala junto
    });
  }

  // 4. Lógica para Admin ver todos os Pendentes
  async findPending() {
    return this.prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: { space: true, user: true }, // Traz detalhes de quem pediu e qual sala
    });
  }
}
