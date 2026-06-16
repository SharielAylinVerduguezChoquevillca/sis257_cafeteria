import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Roles } from '../auth/decorators/roles.decorator';        
import { RolesGuard } from '../auth/guards/roles.guard';           

@Controller({ path: 'categorias', version: '1' })
@UseGuards(AuthGuard('jwt'), RolesGuard)                           
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Roles('admin')                    
  @Post()
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  @Get()                            
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')                        
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id);
  }

  @Roles('admin')                    
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(+id, dto);
  }

  @Roles('admin')                    
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id);
  }
}