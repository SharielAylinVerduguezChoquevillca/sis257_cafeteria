import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Bebidas' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ example: 'Bebidas calientes y frías' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
