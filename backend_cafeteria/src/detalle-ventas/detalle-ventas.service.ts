import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly repo: Repository<DetalleVenta>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateDetalleVentaDto) {
    const producto = await this.productoRepo.findOne({
      where: { id: dto.idProducto },
    });

    if (!producto) {
      throw new NotFoundException(`Producto #${dto.idProducto} no encontrado`);
    }

    if (producto.stock < dto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${dto.cantidad}`,
      );
    }

    const detalle = this.repo.create(dto);
    const detalleGuardado = await this.repo.save(detalle);

    await this.productoRepo.decrement(
      { id: dto.idProducto },
      'stock',
      dto.cantidad,
    );

    return detalleGuardado;
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

    if (dto.cantidad && dto.cantidad !== detalle.cantidad) {
      const diferencia = dto.cantidad - detalle.cantidad;

      if (diferencia > 0) {
        const producto = await this.productoRepo.findOne({
          where: { id: detalle.idProducto },
        });

        if (producto && producto.stock < diferencia) {
          throw new BadRequestException(`Stock insuficiente`);
        }

        await this.productoRepo.decrement(
          { id: detalle.idProducto },
          'stock',
          diferencia,
        );
      } else if (diferencia < 0) {
        await this.productoRepo.increment(
          { id: detalle.idProducto },
          'stock',
          Math.abs(diferencia),
        );
      }
    }

    Object.assign(detalle, dto);
    return this.repo.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);

    await this.productoRepo.increment(
      { id: detalle.idProducto },
      'stock',
      detalle.cantidad,
    );

    return this.repo.softRemove(detalle);
  }
}
