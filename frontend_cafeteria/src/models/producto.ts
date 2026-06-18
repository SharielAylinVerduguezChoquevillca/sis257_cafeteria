import type { Categoria } from './categoria'

export interface Producto {
  id: number
  idCategoria: number
  categoria?: Categoria
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  activo: boolean
  imagen?: string
}