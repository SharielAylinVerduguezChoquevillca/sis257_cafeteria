import type { Cliente } from './cliente'
import type { Usuario } from './usuario'
import type { DetalleVenta } from './detalleVenta'

export interface Venta {
  id: number
  idCliente: number
  idUsuario: number
  cliente?: Cliente
  usuario?: Usuario
  fecha?: string
  total: number
  observacion?: string
  detalles?: DetalleVenta[]
}