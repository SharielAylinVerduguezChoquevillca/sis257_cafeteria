<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'
import type { Producto } from '../../models/producto'

const ventas = ref<Venta[]>([])
const productos = ref<Producto[]>([])
const expandidas = ref<Set<number>>(new Set())
const emit = defineEmits(['edit'])

const paginaActual = ref(1)
const productosPorPagina = ref(5)

async function obtenerLista() {
  const response = await axios.get('/ventas')
  ventas.value = response.data
  paginaActual.value = 1
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

const busqueda = ref('')

const ventasFiltradas = computed(() => {
  if (!busqueda.value) return ventas.value
  return ventas.value.filter((v) => {
    const fecha = new Date(v.fecha!).toLocaleDateString()
    return (
      v.cliente?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      v.usuario?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      fecha.includes(busqueda.value)
    )
  })
})

const totalFiltrados = computed(() => ventasFiltradas.value.length)

const ventasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * productosPorPagina.value
  const fin = inicio + productosPorPagina.value
  return ventasFiltradas.value.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  return Math.ceil(totalFiltrados.value / productosPorPagina.value)
})

watch(busqueda, () => {
  paginaActual.value = 1
})

function irPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

function obtenerRangoPaginas() {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const rango: number[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      rango.push(i)
    }
  } else {
    if (actual <= 3) {
      rango.push(1, 2, 3, 4, 5)
    } else if (actual >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        rango.push(i)
      }
    } else {
      rango.push(actual - 2, actual - 1, actual, actual + 1, actual + 2)
    }
  }
  return rango
}
</script>

<template>
  <div>
    <input v-model="busqueda" class="buscador" placeholder="Buscar cliente, usuario o fecha..." />

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
          <tr v-if="ventasPaginadas.length === 0">
            <td colspan="8" class="vacio">No hay ventas registradas</td>
          </tr>

          <template v-for="(venta, index) in ventasPaginadas" :key="venta.id">
            <tr class="fila-venta">
              <td class="t-center">
                <button class="btn-toggle" @click="toggleDetalle(venta.id)">
                  <span :class="{ abierto: expandidas.has(venta.id) }">▸</span>
                </button>
              </td>
              <td class="c-num">{{ (paginaActual - 1) * productosPorPagina + index + 1 }}</td>
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

    <div v-if="totalFiltrados > 0" class="paginacion">
      <div class="paginacion-info">
        Mostrando {{ (paginaActual - 1) * productosPorPagina + 1 }} -
        {{ Math.min(paginaActual * productosPorPagina, totalFiltrados) }}
        de {{ totalFiltrados }} ventas
      </div>

      <div class="paginacion-controles">
        <button
          class="btn-pagina"
          :disabled="paginaActual === 1"
          @click="irPagina(paginaActual - 1)"
        >
          ◀
        </button>

        <button
          v-for="pagina in obtenerRangoPaginas()"
          :key="pagina"
          class="btn-pagina"
          :class="{ 'activo': pagina === paginaActual }"
          @click="irPagina(pagina)"
        >
          {{ pagina }}
        </button>

        <button
          class="btn-pagina"
          :disabled="paginaActual === totalPaginas"
          @click="irPagina(paginaActual + 1)"
        >
          ▶
        </button>
      </div>

      <div class="paginacion-items">
        <span class="texto-items">{{ productosPorPagina }} por página</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.buscador {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e8dcc8;
  color: #4a2c2a;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.25s;
}

.buscador::placeholder {
  color: #b5a48e;
}

.buscador:focus {
  border-color: #c49b63;
}

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

.paginacion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0.5rem 0;
}

.paginacion-info {
  font-size: 13px;
  color: #7a6650;
  font-weight: 500;
}

.paginacion-controles {
  display: flex;
  gap: 4px;
  align-items: center;
}

.btn-pagina {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  background: transparent;
  border: 1px solid #e8dcc8;
  border-radius: 6px;
  color: #4a2c2a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-pagina:hover:not(:disabled) {
  background: #f0e7d9;
  border-color: #c49b63;
}

.btn-pagina:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-pagina.activo {
  background: #6f4e37;
  border-color: #6f4e37;
  color: #fbf6ef;
}

.btn-pagina.activo:hover {
  background: #4a2c2a;
  border-color: #4a2c2a;
}

.paginacion-items {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #7a6650;
}

.texto-items {
  font-weight: 500;
  color: #4a2c2a;
}

@media (max-width: 768px) {
  .paginacion {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .paginacion-info {
    text-align: center;
  }

  .paginacion-controles {
    justify-content: center;
    flex-wrap: wrap;
  }

  .paginacion-items {
    justify-content: center;
  }
}
</style>
