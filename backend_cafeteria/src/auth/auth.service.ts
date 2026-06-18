import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.findByEmail(loginDto.email);
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const passwordValido = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );
    if (!passwordValido)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async verifyPayload(payload: JwtPayload) {
    const usuario = await this.usuariosService.findByEmail(payload.email);
    if (!usuario) throw new UnauthorizedException('Token inválido');
    return usuario;
  }
}
