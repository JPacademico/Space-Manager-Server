import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SpacesModule } from './spaces/spaces.module';
import { BookingsModule } from './bookings/bookings.module';


@Module({
  imports: [UsersModule, SpacesModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
