import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  create(createSpaceDto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: createSpaceDto,
    });
  }

  findAll() {
    return this.prisma.space.findMany({
      where: { isAvailable: true },
    });
  }

  findOne(id: string) {
    return this.prisma.space.findUnique({
      where: { id },
    });
  }
}