import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly repo: Repository<Venta>,
  ) {}

  create(dto: CreateVentaDto) {
    const venta = this.repo.create(dto);
    return this.repo.save(venta);
  }

  findAll() {
    return this.repo.find({
      relations: {
        cliente: true,
        usuario: true,
        detalles: {
          producto: true,
        },
      },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const venta = await this.repo.findOne({
      where: { id },
      relations: {
        cliente: true,
        usuario: true,
        detalles: {
          producto: true,
        },
      },
    });
    if (!venta) throw new NotFoundException(`Venta #${id} no encontrada`);
    return venta;
  }

  async update(id: number, dto: UpdateVentaDto) {
    const venta = await this.findOne(id);
    Object.assign(venta, dto);
    return this.repo.save(venta);
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    return this.repo.softRemove(venta);
  }
}
