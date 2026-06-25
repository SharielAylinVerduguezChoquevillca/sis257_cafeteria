import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVentasService } from './detalle-ventas.service';
import { DetalleVentasController } from './detalle-ventas.controller';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta,Producto])],
  controllers: [DetalleVentasController],
  providers: [DetalleVentasService],
  exports: [DetalleVentasService],
})
export class DetalleVentasModule {}
