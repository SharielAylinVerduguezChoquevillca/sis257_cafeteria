import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly repo: Repository<DetalleVenta>,
  ) {}

  create(dto: CreateDetalleVentaDto) {
    const detalle = this.repo.create(dto);
    return this.repo.save(detalle);
  }

  findAll() {
    return this.repo.find({
      relations: { venta: true, producto: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const detalle = await this.repo.findOne({
      where: { id },
      relations: { venta: true, producto: true },
    });
    if (!detalle) throw new NotFoundException(`Detalle #${id} no encontrado`);
    return detalle;
  }

  async update(id: number, dto: UpdateDetalleVentaDto) {
    const detalle = await this.findOne(id);
    Object.assign(detalle, dto);
    return this.repo.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    return this.repo.softRemove(detalle);
  }
}
