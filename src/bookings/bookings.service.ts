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

  // --- HELPER: Logic to check for overlaps ---
  private async checkAvailability(spaceId: string, start: Date, end: Date, excludeBookingId?: string) {
    // Search for any booking that is APPROVED and Overlaps with our dates
    const conflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: spaceId,
        status: 'APPROVED', // Only blocked by approved bookings
        AND: [
          { startDate: { lt: end } },   // Existing Start < New End
          { endDate: { gt: start } },   // Existing End > New Start
        ],
        // If we are updating a booking, don't count itself as a conflict
        NOT: excludeBookingId ? { id: excludeBookingId } : undefined,
      },
    });

    if (conflict) {
      throw new ConflictException(
        `Space is already booked from ${conflict.startDate.toISOString()} to ${conflict.endDate.toISOString()}`
      );
    }
  }

  // 1. User Request Logic
  async create(createBookingDto: CreateBookingDto) {
    const { userId, spaceId, startDate, durationWeeks } = createBookingDto;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (durationWeeks * 7));

    if (start < new Date()) {
      throw new BadRequestException('Start date cannot be in the past.');
    }

    // NEW: Check if it's already taken before even saving
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

  // 2. Admin Approval Logic
  async approveBooking(bookingId: string) {
    // First, find the booking to know its dates
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'APPROVED') throw new BadRequestException('Already approved');

    // NEW: Check conflict again (Double check logic)
    // Scenario: User A and User B requested the same room. 
    // Admin approves User A. Now Admin tries to approve User B -> This must fail.
    await this.checkAvailability(
      booking.spaceId, 
      booking.startDate, 
      booking.endDate, 
      bookingId // Exclude itself from the check
    );

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'APPROVED' },
    });
  }

  // ... (Keep the read methods as they were) ...
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
