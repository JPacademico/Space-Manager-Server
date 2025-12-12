import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Rota para criar solicitação
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  // Rota para Admin ver pendentes
  @Get('pending')
  findPending() {
    return this.bookingsService.findPending();
  }

  // Rota para Admin Aprovar
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.bookingsService.approveBooking(id);
  }

  // Rota para Usuário ver seus agendamentos
  @Get('my-appointments/:userId')
  findMyAppointments(@Param('userId') userId: string) {
    return this.bookingsService.findMyAppointments(userId);
  }
}
