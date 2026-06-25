<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'
import type { Producto } from '../../models/producto'

const ventas = ref<Venta[]>([])
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])

const paginaActual = ref(1)
const productosPorPagina = ref(5)

const mostrarDetalleModal = ref(false)
const ventaSeleccionada = ref<Venta | null>(null)
const cargandoDetalle = ref(false)

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

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar esta venta?')) {
    await axios.delete(`/ventas/${id}`)
    await obtenerLista()
  }
}

async function verDetalle(id: number) {
  cargandoDetalle.value = true
  mostrarDetalleModal.value = true
  try {
    const response = await axios.get(`/ventas/${id}`)
    ventaSeleccionada.value = response.data
  } catch (error) {
    console.error('Error al cargar detalle:', error)
  } finally {
    cargandoDetalle.value = false
  }
}

function cerrarDetalle() {
  mostrarDetalleModal.value = false
  ventaSeleccionada.value = null
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
            <th style="width: 50px">#</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Usuario</th>
            <th class="t-right">Total</th>
            <th>Observación</th>
            <th class="t-center" style="width: 220px">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="ventasPaginadas.length === 0">
            <td colspan="7" class="vacio">No hay ventas registradas</td>
          </tr>

          <tr v-for="(venta, index) in ventasPaginadas" :key="venta.id" class="fila-venta">
            <td class="c-num">{{ (paginaActual - 1) * productosPorPagina + index + 1 }}</td>
            <td class="c-dato">{{ new Date(venta.fecha!).toLocaleDateString() }}</td>
            <td class="c-nombre">{{ venta.cliente?.nombre }}</td>
            <td class="c-dato">{{ venta.usuario?.nombre }}</td>
            <td class="t-right c-total">Bs. {{ venta.total }}</td>
            <td class="c-dato">{{ venta.observacion || '—' }}</td>
            <td class="t-center">
              <div class="acciones">
                <button class="btn-detalle" @click="verDetalle(venta.id)">Ver</button>
                <button class="btn-editar" @click="emit('edit', venta)">Editar</button>
                <button class="btn-eliminar" @click="eliminar(venta.id)">Eliminar</button>
              </div>
            </td>
          </tr>
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

  <!-- MODAL DE DETALLE -->
  <div v-if="mostrarDetalleModal" class="modal-overlay" @click.self="cerrarDetalle">
    <div class="modal-panel modal-large">
      <div class="modal-header">
        <span class="subheading-sm">Cafetería</span>
        <h3>Detalle de Venta #{{ ventaSeleccionada?.id }}</h3>
        <button class="close-btn" @click="cerrarDetalle">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div v-if="cargandoDetalle" class="cargando">
          <p>Cargando detalles...</p>
        </div>

        <div v-else-if="ventaSeleccionada">
          <div class="info-grid">
            <div class="info-item">
              <label class="field-label">Cliente</label>
              <p class="info-value">{{ ventaSeleccionada.cliente?.nombre || 'Sin cliente' }}</p>
            </div>
            <div class="info-item">
              <label class="field-label">Usuario</label>
              <p class="info-value">{{ ventaSeleccionada.usuario?.nombre }}</p>
            </div>
            <div class="info-item">
              <label class="field-label">Fecha</label>
              <p class="info-value">{{ new Date(ventaSeleccionada.fecha!).toLocaleString() }}</p>
            </div>
            <div class="info-item">
              <label class="field-label">Observación</label>
              <p class="info-value">{{ ventaSeleccionada.observacion || '—' }}</p>
            </div>
          </div>

          <div class="divider-light"></div>

          <h4 class="section-title">Productos de esta venta</h4>

          <div class="cart-list">
            <table class="tabla-detalle-modal">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th class="t-center">Cantidad</th>
                  <th class="t-right">Precio unit.</th>
                  <th class="t-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detalle, index) in ventaSeleccionada.detalles" :key="detalle.id">
                  <td class="c-num">{{ index + 1 }}</td>
                  <td class="c-nombre">{{ detalle.producto?.nombre || `Producto #${detalle.idProducto}` }}</td>
                  <td class="t-center c-dato">{{ detalle.cantidad }}</td>
                  <td class="t-right c-dato">Bs. {{ detalle.precioUnitario }}</td>
                  <td class="t-right c-subtotal">Bs. {{ detalle.subtotal }}</td>
                </tr>
                <tr v-if="!ventaSeleccionada.detalles || ventaSeleccionada.detalles.length === 0">
                  <td colspan="5" class="d-vacio">Esta venta no tiene productos registrados</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" class="t-right d-total-label">Total</td>
                  <td class="t-right d-total">Bs. {{ ventaSeleccionada.total }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancelar" @click="cerrarDetalle">Cerrar</button>
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

.vacio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #a98a66;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.acciones {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-detalle,
.btn-editar,
.btn-eliminar {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-detalle {
  background: transparent;
  border: 1px solid #4a90d9;
  color: #4a90d9;
}

.btn-detalle:hover {
  background: #4a90d9;
  color: #fff;
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

/* ESTILOS DEL MODAL DE DETALLE */
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(36, 20, 16, 0.6);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #fbf6ef;
  border: 1px solid #e8dcc8;
  border-radius: 16px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-panel.modal-large {
  max-width: 800px;
}

.modal-header {
  padding: 24px 28px 12px;
  position: relative;
}

.subheading-sm {
  font-family: 'Great Vibes', cursive;
  font-size: 26px;
  color: #b0832b;
  display: block;
  line-height: 1;
  margin-bottom: 2px;
}

.modal-header h3 {
  font-size: 19px;
  color: #4a2c2a;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #a98a66;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #6f4e37;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, #c49b63, rgba(196, 155, 99, 0.1));
  margin: 0 28px;
}

.divider-light {
  height: 1px;
  background: #f0e7d9;
  margin: 22px 0;
}

.modal-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  max-height: calc(90vh - 180px);
}

.cargando {
  text-align: center;
  padding: 2rem;
  color: #a98a66;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6f4e37;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #4a2c2a;
  margin: 0;
}

.section-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6f4e37;
  margin: 0;
  font-weight: 700;
}

.cart-list {
  background: #ffffff;
  border: 1px solid #e8dcc8;
  border-radius: 8px;
  overflow: auto;
}

.tabla-detalle-modal {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tabla-detalle-modal thead th {
  background: #4a2c2a;
  color: #f3e5d5;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
  padding: 11px 12px;
  font-weight: 600;
  text-align: left;
}

.tabla-detalle-modal tbody td {
  padding: 11px 12px;
  border-bottom: 1px solid #f0e7d9;
}

.tabla-detalle-modal tbody tr:last-child td {
  border-bottom: none;
}

.tabla-detalle-modal tfoot td {
  padding: 11px 12px;
  border-top: 2px solid #e8dcc8;
}

.modal-footer {
  padding: 16px 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  border-top: 1px solid #f0e7d9;
}

.btn-cancelar {
  background: transparent;
  border: 1px solid #d8c6ad;
  color: #7a6650;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cancelar:hover {
  background: #f0e7d9;
  color: #4a2c2a;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
