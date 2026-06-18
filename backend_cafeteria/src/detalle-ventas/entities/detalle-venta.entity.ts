import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_venta', nullable: false })
  idVenta: number;

  @ManyToOne(() => Venta, (venta) => venta.detalles)
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @Column({ name: 'id_producto', nullable: false })
  idProducto: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({
    name: 'precio_unitario',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
}
