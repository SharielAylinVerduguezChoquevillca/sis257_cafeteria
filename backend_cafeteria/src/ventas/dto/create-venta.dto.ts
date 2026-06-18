import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateVentaDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCliente: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number;

  @ApiProperty({ example: 150.5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiPropertyOptional({ example: 'Sin azúcar' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
