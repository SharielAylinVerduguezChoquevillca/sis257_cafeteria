import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  create(dto: CreateProductoDto) {
    const producto = this.repo.create(dto);
    return this.repo.save(producto);
  }

  findAll() {
    return this.repo.find({
      relations: { categoria: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number) {
    const producto = await this.repo.findOne({
      where: { id },
      relations: { categoria: true },
    });
    if (!producto) throw new NotFoundException(`Producto #${id} no encontrado`);
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto) {
    const producto = await this.findOne(id);
    Object.assign(producto, dto);
    return this.repo.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.repo.softRemove(producto);
  }
}
