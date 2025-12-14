import { Controller, Get, Post, Body, Param, ForbiddenException, UseGuards, Request } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @UseGuards(AuthGuard('jwt')) // 1. Must be logged in
  @Post()
  create(@Request() req, @Body() createSpaceDto: CreateSpaceDto) {
    // 2. Must be Admin
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admins can create spaces');
    }
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }
}
