import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCategoria: number;

  @ApiProperty({ example: 'Café Americano' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ example: 'Café negro sin leche' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 15.5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: 'https://ejemplo.com/cafe.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagen?: string;
}
