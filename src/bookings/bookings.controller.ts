import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create({
      ...createBookingDto,
      userId: req.user.id, 
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('pending')
  findPending(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Acesso negado. Apenas Admins.');
    }
  
    return this.bookingsService.findPending();
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/approve')
  approve(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Você não tem permissão para aprovar.');
    }
  
    return this.bookingsService.approveBooking(id);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('my-appointments')
  findMyAppointments(@Request() req) {
    return this.bookingsService.findMyAppointments(req.user.id); 
  }
}
