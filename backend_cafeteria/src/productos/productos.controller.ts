import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Productos')
@Controller({ path: 'productos', version: '1' })
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateProductoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.service.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) { 
    return this.service.remove(+id);
  }
}
