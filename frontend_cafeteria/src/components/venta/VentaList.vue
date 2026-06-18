<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'
import type { Producto } from '../../models/producto'

const ventas = ref<Venta[]>([])
const productos = ref<Producto[]>([])
const expandidas = ref<Set<number>>(new Set())
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/ventas')
  ventas.value = response.data
}

async function obtenerProductos() {
  const response = await axios.get('/productos')
  productos.value = response.data
}

function nombreProducto(idProducto: number): string {
  const prod = productos.value.find((p) => p.id === idProducto)
  return prod ? prod.nombre : `Producto #${idProducto}`
}

function toggleDetalle(id: number) {
  if (expandidas.value.has(id)) {
    expandidas.value.delete(id)
  } else {
    expandidas.value.add(id)
  }
  expandidas.value = new Set(expandidas.value)
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar esta venta?')) {
    await axios.delete(`/ventas/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
  obtenerProductos()
})
</script>

<template>
  <div class="tabla-wrapper">
    <table class="tabla">
      <thead>
        <tr>
          <th style="width: 44px"></th>
          <th style="width: 50px">#</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Usuario</th>
          <th class="t-right">Total</th>
          <th>Observación</th>
          <th class="t-center" style="width: 180px">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="ventas.length === 0">
          <td colspan="8" class="vacio">No hay ventas registradas</td>
        </tr>

        <template v-for="(venta, index) in ventas" :key="venta.id">
          <tr class="fila-venta">
            <td class="t-center">
              <button class="btn-toggle" @click="toggleDetalle(venta.id)">
                <span :class="{ abierto: expandidas.has(venta.id) }">▸</span>
              </button>
            </td>
            <td class="c-num">{{ index + 1 }}</td>
            <td class="c-dato">{{ new Date(venta.fecha!).toLocaleDateString() }}</td>
            <td class="c-nombre">{{ venta.cliente?.nombre }}</td>
            <td class="c-dato">{{ venta.usuario?.nombre }}</td>
            <td class="t-right c-total">Bs. {{ venta.total }}</td>
            <td class="c-dato">{{ venta.observacion || '—' }}</td>
            <td class="t-center">
              <div class="acciones">
                <button class="btn-editar" @click="emit('edit', venta)">Editar</button>
                <button class="btn-eliminar" @click="eliminar(venta.id)">Eliminar</button>
              </div>
            </td>
          </tr>

          <tr v-if="expandidas.has(venta.id)" class="fila-detalle">
            <td></td>
            <td colspan="7">
              <div class="detalle-box">
                <h5 class="detalle-titulo">Productos de esta venta</h5>
                <table class="detalle-tabla">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th class="t-center">Cantidad</th>
                      <th class="t-right">Precio unit.</th>
                      <th class="t-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="d in venta.detalles" :key="d.id">
                      <td class="d-nombre">{{ nombreProducto(d.idProducto) }}</td>
                      <td class="t-center d-dato">{{ d.cantidad }}</td>
                      <td class="t-right d-dato">Bs. {{ d.precioUnitario }}</td>
                      <td class="t-right d-subtotal">Bs. {{ d.subtotal }}</td>
                    </tr>
                    <tr v-if="!venta.detalles || venta.detalles.length === 0">
                      <td colspan="4" class="d-vacio">Esta venta no tiene productos registrados</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="3" class="t-right d-total-label">Total</td>
                      <td class="t-right d-total">Bs. {{ venta.total }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tabla-wrapper {
  overflow-x: auto;
  background: #fbf6ef;
  border: 1px solid #e8dcc8;
  border-radius: 12px;
}

.tabla {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
  font-size: 13.5px;
}

.tabla thead tr {
  background: #4a2c2a;
}

.tabla thead th {
  color: #f3e5d5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
  font-weight: 600;
  padding: 14px 14px;
  text-align: left;
}

.fila-venta td {
  padding: 14px 14px;
  border-bottom: 1px solid #f0e7d9;
  vertical-align: middle;
}

.fila-venta:nth-of-type(odd) {
  background: #fcf7f0;
}

.fila-venta:hover {
  background: #f6ece0;
}

.c-num {
  color: #a98a66;
}
.c-nombre {
  color: #4a2c2a;
  font-weight: 600;
}
.c-dato {
  color: #7a6650;
}
.c-total {
  color: #3b6d11;
  font-weight: 700;
}

.t-right {
  text-align: right;
}
.t-center {
  text-align: center;
}

.btn-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #6f4e37;
  padding: 4px 8px;
}

.btn-toggle span {
  display: inline-block;
  transition: transform 0.2s ease;
}

.btn-toggle span.abierto {
  transform: rotate(90deg);
}

.vacio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #a98a66;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.fila-detalle td {
  padding: 0 14px 16px;
  background: #f3e9dc;
}

.detalle-box {
  background: #ffffff;
  border: 1px solid #e8dcc8;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 4px;
}

.detalle-titulo {
  margin: 0 0 10px;
  font-size: 13px;
  color: #6f4e37;
  font-weight: 700;
}

.detalle-tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.detalle-tabla thead th {
  background: #f0e7d9;
  color: #6f4e37;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 10px;
  text-align: left;
}

.detalle-tabla tbody td {
  padding: 8px 10px;
  border-bottom: 1px solid #f0e7d9;
}

.d-nombre {
  color: #4a2c2a;
  font-weight: 600;
}
.d-dato {
  color: #7a6650;
}
.d-subtotal {
  color: #3b6d11;
  font-weight: 700;
}

.d-vacio {
  text-align: center;
  color: #a98a66;
  padding: 12px;
}

.detalle-tabla tfoot td {
  padding: 10px;
  border-top: 2px solid #e8dcc8;
}

.d-total-label {
  color: #7a6650;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.d-total {
  color: #3b6d11;
  font-weight: 700;
  font-size: 15px;
}

/* Acciones */
.acciones {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-editar,
.btn-eliminar {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-editar {
  background: transparent;
  border: 1px solid #b0832b;
  color: #b0832b;
}

.btn-editar:hover {
  background: #b0832b;
  color: #fff;
}

.btn-eliminar {
  background: transparent;
  border: 1px solid #c0563a;
  color: #c0563a;
}

.btn-eliminar:hover {
  background: #c0563a;
  color: #fff;
}
</style>