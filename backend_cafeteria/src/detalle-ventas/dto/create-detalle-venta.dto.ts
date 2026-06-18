import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idVenta: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idProducto: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 15.5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precioUnitario: number;

  @ApiProperty({ example: 31.0 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  subtotal: number;
}
