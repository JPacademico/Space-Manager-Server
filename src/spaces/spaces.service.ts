import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  // Criar um espaço (Ação de Admin)
  create(createSpaceDto: CreateSpaceDto) {
    return this.prisma.space.create({
      data: createSpaceDto,
    });
  }

  // Listar todos os espaços disponíveis
  findAll() {
    return this.prisma.space.findMany({
      where: { isAvailable: true }, // Regra: só mostra os que não estão em manutenção
    });
  }

  // Buscar um espaço específico
  findOne(id: string) {
    return this.prisma.space.findUnique({
      where: { id },
    });
  }
}