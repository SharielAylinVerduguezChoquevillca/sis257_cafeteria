import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const hash = await bcrypt.hash(dto.password, 10);
    const usuario = this.repo.create({ ...dto, password: hash });
    return this.repo.save(usuario);
  }

  findAll() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario)
      throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(usuario, dto);
    return this.repo.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    return this.repo.softRemove(usuario);
  }
}