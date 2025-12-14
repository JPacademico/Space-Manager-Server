import { 
  Injectable, 
  BadRequestException, 
  ConflictException, 
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private async checkAvailability(spaceId: string, start: Date, end: Date, excludeBookingId?: string) {
    const conflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: spaceId,
        status: 'APPROVED',
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
        NOT: excludeBookingId ? { id: excludeBookingId } : undefined,
      },
    });

    if (conflict) {
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });

      const startDate = formatter.format(conflict.startDate);
      const endDate = formatter.format(conflict.endDate);
      throw new ConflictException(
        `Este espaço já está ocupado de ${startDate} até ${endDate}.`
      );
    }
  }

  async create(createBookingDto: CreateBookingDto) {
    const { userId, spaceId, startDate, durationWeeks } = createBookingDto;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (durationWeeks * 7));

    if (start < new Date()) {
      throw new BadRequestException('Start date cannot be in the past.');
    }

    await this.checkAvailability(spaceId, start, end);

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId,
        startDate: start,
        endDate: end,
        status: 'PENDING',
      },
    });
  }

  async approveBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'APPROVED') throw new BadRequestException('Already approved');

    await this.checkAvailability(
      booking.spaceId, 
      booking.startDate, 
      booking.endDate, 
      bookingId
    );

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'APPROVED' },
    });
  }

  async findMyAppointments(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId, status: 'APPROVED' },
      include: { space: true },
    });
  }

  async findPending() {
    return this.prisma.booking.findMany({
      where: { status: 'PENDING' },
      include: { space: true, user: true },
    });
  }
}
