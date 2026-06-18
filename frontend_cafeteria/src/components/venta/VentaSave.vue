<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'
import type { Cliente } from '../../models/cliente'
import type { Producto } from '../../models/producto'
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'

const props = defineProps<{
  mostrar: boolean
  venta: Venta | null | undefined
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])
const authStore = useAuthStore()
const buscarCliente = ref('')
const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])
const mostrarFormCliente = ref(false)

const nuevoCliente = ref({
  nombre: '',
  nit: '',
})

const form = ref<Venta>({
  id: 0,
  idCliente: 0,
  idUsuario: authStore.usuario?.id || 0,
  total: 0,
  observacion: '',
})

const detalles = ref<
  Array<{
    idProducto: number
    cantidad: number
    precioUnitario: number
    subtotal: number
    productoNombre: string
  }>
>([])

const productoSeleccionado = ref(0)
const cantidadSeleccionada = ref(1)
const clientesFiltrados = computed(() => {
  if (!buscarCliente.value) return clientes.value

  return clientes.value.filter((c) =>
    c.nombre.toLowerCase().includes(buscarCliente.value.toLowerCase()),
  )
})

watch(
  () => props.venta,
  (val) => {
    if (val) {
      form.value = {
        ...val,
        idCliente: Number(val.idCliente || val.cliente?.id || 0),
        idUsuario: Number(val.idUsuario || val.usuario?.id || authStore.usuario?.id || 0),
        total: Number(val.total),
      }
    } else {
      form.value = {
        id: 0,
        idCliente: 0,
        idUsuario: authStore.usuario?.id || 0,
        total: 0,
        observacion: '',
      }
      detalles.value = []
    }
  },
)

async function obtenerClientes() {
  const response = await axios.get('/clientes')
  clientes.value = response.data
}
async function guardarCliente() {
  const response = await axios.post('/clientes', nuevoCliente.value)

  await obtenerClientes()

  form.value.idCliente = response.data.id

  mostrarFormCliente.value = false

  nuevoCliente.value = { nombre: '', nit: '' }
}

async function obtenerProductos() {
  try {
    console.log('LLAMANDO /productos...')

    const response = await axios.get('/productos')

    console.log('RESPUESTA BRUTA:', response)
    console.log('DATA:', response.data)

    productos.value = response.data
  } catch (error) {
    console.error('ERROR REAL:', error)
  }
}
function seleccionarCliente(cliente: any) {
  form.value.idCliente = cliente.id
  buscarCliente.value = cliente.nombre
}
function agregarProducto() {
  if (productoSeleccionado.value === 0) return
  const producto = productos.value.find((p) => p.id === productoSeleccionado.value)
  if (!producto) return

  const existente = detalles.value.find((d) => d.idProducto === producto.id)
  if (existente) {
    existente.cantidad += cantidadSeleccionada.value
    existente.subtotal = existente.cantidad * existente.precioUnitario
  } else {
    detalles.value.push({
      idProducto: producto.id,
      cantidad: cantidadSeleccionada.value,
      precioUnitario: Number(producto.precio),
      subtotal: cantidadSeleccionada.value * Number(producto.precio),
      productoNombre: producto.nombre,
    })
  }
  calcularTotal()
  productoSeleccionado.value = 0
  cantidadSeleccionada.value = 1
}

function eliminarDetalle(index: number) {
  detalles.value.splice(index, 1)
  calcularTotal()
}

function calcularTotal() {
  form.value.total = detalles.value.reduce((acc, d) => acc + d.subtotal, 0)
}

async function guardar() {
  if (form.value.idCliente === 0) {
    alert('Seleccione un cliente')
    return
  }

  if (props.modoEdicion) {
    const payload = {
      idCliente: Number(form.value.idCliente),
      idUsuario: authStore.usuario?.id,
      total: form.value.total,
      observacion: form.value.observacion,
    }
    await axios.patch(`/ventas/${form.value.id}`, payload)
  } else {
    if (detalles.value.length === 0) {
      alert('Agregue al menos un producto')
      return
    }
    const ventaResponse = await axios.post('/ventas', {
      idCliente: Number(form.value.idCliente),
      idUsuario: form.value.idUsuario,
      total: form.value.total,
      observacion: form.value.observacion,
    })
    const ventaId = ventaResponse.data.id
    for (const detalle of detalles.value) {
      await axios.post('/detalle-ventas', {
        idVenta: ventaId,
        idProducto: detalle.idProducto,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        subtotal: detalle.subtotal,
      })
    }
  }

  emit('guardar')
  emit('close')
}

onMounted(() => {
  obtenerClientes()
  obtenerProductos()
})
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-panel modal-large">
      <div class="modal-header">
        <span class="subheading-sm">Cafetería</span>
        <h3>{{ modoEdicion ? 'Editar venta' : 'Nueva venta' }} — El Buen Gusto</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div class="form-group">
          <label class="field-label">Cliente</label>

          <input
            v-model="buscarCliente"
            class="control"
            placeholder="Escriba para buscar cliente..."
          />

          <div v-if="buscarCliente" class="lista-clientes">
            <div
              v-for="cliente in clientesFiltrados"
              :key="cliente.id"
              class="cliente-item"
              :class="{ activo: form.idCliente === cliente.id }"
              @click="seleccionarCliente(cliente)"
            >
              {{ cliente.nombre }} - {{ cliente.nit || 'SIN NIT' }}
            </div>

            <div v-if="clientesFiltrados.length === 0" class="sin-resultados">
              No se encontraron clientes
            </div>
          </div>

          <button class="btn-nuevo" @click="mostrarFormCliente = true">+ Nuevo cliente</button>
        </div>

        <div class="form-group">
          <label class="field-label">Observación</label>
          <input v-model="form.observacion" class="control" placeholder="Observación (opcional)" />
        </div>

        <div class="product-section">
          <h4 class="section-title">Agregar productos</h4>

          <div class="product-row">
            <select v-model="productoSeleccionado" class="control product-select">
              <option :value="0">Seleccione un producto</option>
              <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                {{ producto.nombre }} - Bs. {{ producto.precio }}
              </option>
            </select>

            <input
              v-model="cantidadSeleccionada"
              type="number"
              min="1"
              class="control quantity-input"
            />

            <button class="btn-agregar" @click="agregarProducto">Agregar</button>
          </div>
        </div>

        <div v-if="detalles.length > 0" class="cart-list">
          <table class="tabla-detalle">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="t-right">Precio unit.</th>
                <th class="t-center">Cantidad</th>
                <th class="t-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, index) in detalles" :key="index">
                <td class="c-nombre">{{ detalle.productoNombre }}</td>
                <td class="t-right c-dato">Bs. {{ detalle.precioUnitario }}</td>
                <td class="t-center c-dato">{{ detalle.cantidad }}</td>
                <td class="t-right c-subtotal">Bs. {{ detalle.subtotal }}</td>
                <td class="t-center">
                  <button class="btn-remove" @click="eliminarDetalle(index)">✕</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="total-box">
          <strong>Total:</strong>
          <span class="total-amount">Bs. {{ form.total }}</span>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-guardar" @click="guardar">
          {{ modoEdicion ? 'Guardar cambios' : 'Registrar venta' }}
        </button>
        <button class="btn-cancelar" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
  <div v-if="mostrarFormCliente" class="modal-overlay" @click.self="mostrarFormCliente = false">
    <div class="modal-panel modal-small">
      <div class="modal-header">
        <h3>Nuevo Cliente</h3>

        <button class="close-btn" @click="mostrarFormCliente = false">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div class="form-group">
          <label class="field-label">Nombre</label>
          <input v-model="nuevoCliente.nombre" class="control" placeholder="Ingrese el nombre" />
        </div>

        <div class="form-group">
          <label class="field-label">NIT</label>
          <input v-model="nuevoCliente.nit" class="control" placeholder="Opcional" />
        </div>

        <div class="form-group">
          <label class="field-label">Teléfono</label>
          <input v-model="nuevoCliente.telefono" class="control" placeholder="70000000" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancelar" @click="mostrarFormCliente = false">Cancelar</button>

        <button class="btn-guardar" @click="guardarCliente">Guardar cliente</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.section-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6f4e37;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.form-group {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6f4e37;
  margin-bottom: 6px;
}

.control {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #e8dcc8;
  border-radius: 8px;
  color: #4a2c2a;
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s;
  box-sizing: border-box;
}

.control::placeholder {
  color: #b5a48e;
}

.control:focus {
  border-color: #c49b63;
}

select.control {
  cursor: pointer;
}

.product-row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.product-select {
  background: #fff;
  color: #2b1a14;
  font-weight: 500;
}

.product-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quantity-input {
  width: 90px;
}

.btn-agregar {
  height: 44px;
  padding: 0 22px;
  white-space: nowrap;
  background: #6f4e37;
  color: #fbf6ef;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-agregar:hover {
  background: #4a2c2a;
}

.cart-list {
  display: block;
  background: #ffffff;
  border: 2px solid rgb(255, 255, 255);
  min-height: 150px;
  overflow: auto;
  margin: 20px 0;
}

.tabla-detalle {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tabla-detalle thead th {
  background: #4a2c2a;
  color: #f3e5d5;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
  padding: 11px 12px;
  font-weight: 600;
  text-align: left;
}

.tabla-detalle tbody td {
  padding: 11px 12px;
  border-bottom: 1px solid #f0e7d9;
}

.tabla-detalle tbody tr:last-child td {
  border-bottom: none;
}

.c-nombre {
  color: #4a2c2a;
  font-weight: 600;
}
.c-dato {
  color: #7a6650;
}
.c-subtotal {
  color: #3b6d11;
  font-weight: 700;
}

.t-right {
  text-align: right;
}
.t-center {
  text-align: center;
}

.btn-remove {
  background: transparent;
  border: 1px solid #d8a08f;
  color: #c0563a;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.btn-remove:hover {
  background: #c0563a;
  border-color: #c0563a;
  color: #fff;
}

.total-box {
  margin-top: 10px;
  padding: 12px 0;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  border-top: 1px solid #e8dcc8;
}

.total-box strong {
  color: #7a6650;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: 14px;
}

.total-amount {
  color: #3b6d11;
  font-size: 22px;
  font-weight: 700;
}

.modal-footer {
  padding: 16px 28px;

  display: flex;
  justify-content: center;
  gap: 14px;

  border-top: 1px solid #f0e7d9;
}

.btn-guardar {
  background: #6f4e37;
  color: #fbf6ef;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-guardar:hover {
  background: #4a2c2a;
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
.cliente-row {
  display: flex;
  gap: 10px;
}

.btn-nuevo {
  background: #6f4e37;
  color: white;
  border: none;
  padding: 0 14px;
  border-radius: 8px;
  cursor: pointer;
}
.lista-clientes {
  max-height: 160px;
  overflow-y: auto;
  border: 1px solid #e8dcc8;
  border-radius: 8px;
  margin-top: 8px;
  background: white;
}

.cliente-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f0e7d9;
  color: #4a2c2a;
}

.cliente-item:hover {
  background: #f6ece0;
}

.cliente-item.activo {
  background: #6f4e37;
  color: white;
}

.sin-resultados {
  padding: 10px;
  color: #a98a66;
  text-align: center;
}

.modal-small {
  max-width: 480px;
}

.modal-small .modal-body {
  padding: 28px;
}

.modal-small .form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.modal-small .modal-footer {
  justify-content: flex-end;
  padding: 18px 28px;
}

.modal-small h3 {
  margin: 0;
}
</style>
