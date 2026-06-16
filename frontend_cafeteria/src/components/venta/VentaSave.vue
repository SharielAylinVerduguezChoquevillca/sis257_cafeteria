<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'
import type { Cliente } from '../../models/cliente'
import type { Producto } from '../../models/producto'
import { useAuthStore } from '../../stores/auth'

const props = defineProps<{
  mostrar: boolean
  venta: Venta | null | undefined
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])
const authStore = useAuthStore()

const clientes = ref<Cliente[]>([])
const productos = ref<Producto[]>([])

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

async function obtenerProductos() {
  const response = await axios.get('/productos')
  productos.value = response.data
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
    console.log('payload edicion:', payload)
    console.log('usuario actual:', authStore.usuario)
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
      <div class="modal-header-coffee">
        <span class="subheading-sm">Cafetería</span>
        <h3>Nueva Venta - El Buen Gusto</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="gold-divider"></div>

      <div class="modal-body-coffee">
        <div class="appointment-form">
          <div class="form-group mb-4">
            <label class="field-label">Cliente</label>
            <select v-model="form.idCliente" class="form-control">
              <option :value="0">Seleccione un cliente</option>
              <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                {{ cliente.nombre }} - {{ cliente.ci }}
              </option>
            </select>
          </div>

          <div class="form-group mb-4">
            <label class="field-label">Observación</label>
            <input
              v-model="form.observacion"
              class="form-control"
              placeholder="Observación (opcional)"
            />
          </div>

          <div class="gold-divider-light my-4"></div>

          <h4 class="section-title">Agregar Productos</h4>

          <div class="product-row mb-4">
            <select v-model="productoSeleccionado" class="form-control product-select">
              <option :value="0">Seleccione un producto</option>
              <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                {{ producto.nombre }} - Bs. {{ producto.precio }}
              </option>
            </select>
            <input
              v-model="cantidadSeleccionada"
              type="number"
              min="1"
              class="form-control quantity-input"
            />
            <button class="btn btn-primary add-btn" @click="agregarProducto">Agregar</button>
          </div>

          <div v-if="detalles.length > 0" class="cart-list-sm mb-4">
            <table class="table-sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unit.</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(detalle, index) in detalles" :key="index">
                  <td class="product-name">{{ detalle.productoNombre }}</td>
                  <td>Bs. {{ detalle.precioUnitario }}</td>
                  <td>{{ detalle.cantidad }}</td>
                  <td class="text-gold">Bs. {{ detalle.subtotal }}</td>
                  <td>
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
      </div>

      <div class="modal-footer-coffee">
        <button class="btn btn-primary px-4" @click="guardar">Registrar Venta</button>
        <button class="btn btn-outline-white ml-3" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #1a1512;
  border: 1px solid rgba(196, 155, 99, 0.3);
  width: 100%;
  max-width: 700px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-panel.modal-large {
  max-width: 800px;
}

.modal-header-coffee {
  padding: 28px 30px 16px;
  position: relative;
}

.subheading-sm {
  font-family: 'Great Vibes', cursive;
  font-size: 26px;
  color: #c49b63;
  display: block;
  line-height: 1;
  margin-bottom: -6px;
}

.modal-header-coffee h3 {
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  margin: 0;
  font-weight: 700;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #c49b63;
}

.gold-divider {
  height: 2px;
  background: linear-gradient(to right, #c49b63, rgba(196, 155, 99, 0.1));
  margin: 0 30px;
}

.gold-divider-light {
  height: 1px;
  background: linear-gradient(to right, #c49b63, rgba(196, 155, 99, 0.05));
  margin: 0;
}

.modal-body-coffee {
  padding: 24px 30px;
}

.section-title {
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #c49b63;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.field-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  font-family: 'Work Sans', sans-serif;
}

.appointment-form .form-control {
  border: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  height: 48px !important;
  padding-left: 0;
  background: transparent !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 14px;
  border-radius: 0;
  box-shadow: none !important;
  transition: border-color 0.3s;
}

select.form-control {
  cursor: pointer;
}

select.form-control option {
  background: #1a1512;
  color: #fff;
}

.appointment-form .form-control::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.appointment-form .form-control:focus,
.appointment-form .form-control:active {
  border-bottom-color: #c49b63 !important;
  outline: none;
}

.product-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.product-select {
  flex: 2;
}

.quantity-input {
  width: 100px;
}

.add-btn {
  height: 48px;
  padding: 0 24px;
  white-space: nowrap;
}

.cart-list-sm {
  overflow-x: auto;
  border: 1px solid rgba(196, 155, 99, 0.2);
  margin-top: 20px;
}

.table-sm {
  width: 100%;
  background: transparent;
  font-size: 13px;
}

.table-sm thead th {
  background: rgba(196, 155, 99, 0.1);
  color: #c49b63;
  font-family: 'Josefin Sans', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 11px;
  padding: 12px 10px;
  font-weight: 600;
  text-align: left;
}

.table-sm tbody td {
  color: #cccccc;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(196, 155, 99, 0.1);
}

.table-sm tbody td.product-name {
  color: #fff;
  font-weight: 500;
}

.text-gold {
  color: #c49b63 !important;
  font-weight: 600;
}

.btn-remove {
  background: transparent;
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: rgba(220, 53, 69, 0.7);
  width: 28px;
  height: 28px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-remove:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.total-box {
  text-align: right;
  padding: 20px 0 10px;
  border-top: 2px solid rgba(196, 155, 99, 0.2);
  margin-top: 10px;
  font-size: 18px;
  font-family: 'Josefin Sans', Arial, sans-serif;
}

.total-box strong {
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-right: 15px;
}

.total-amount {
  color: #c49b63;
  font-size: 24px;
  font-weight: 700;
}

.modal-footer-coffee {
  padding: 16px 30px 28px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(196, 155, 99, 0.1);
}

.btn-primary {
  background: #c49b63;
  border: 1px solid #c49b63;
  color: #000;
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 0;
  height: 44px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: transparent;
  color: #c49b63;
}

.btn-outline-white {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 0;
  height: 44px;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.btn-outline-white:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}
</style>
