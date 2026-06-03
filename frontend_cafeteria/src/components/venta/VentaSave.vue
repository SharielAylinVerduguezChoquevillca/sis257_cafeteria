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
      form.value = { ...val }
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
  if (detalles.value.length === 0) {
    alert('Agregue al menos un producto')
    return
  }

  const ventaResponse = await axios.post('/ventas', {
    idCliente: form.value.idCliente,
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

  emit('guardar')
  emit('close')
}

onMounted(() => {
  obtenerClientes()
  obtenerProductos()
})
</script>

<template>
  <div
    v-if="mostrar"
    class="p-dialog-mask"
    style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
    "
  >
    <div
      class="p-dialog"
      style="
        width: 700px;
        background: white;
        padding: 30px;
        border-radius: 8px;
        margin: 50px auto;
        max-height: 90vh;
        overflow-y: auto;
      "
    >
      <h3>Nueva Venta - El Buen Gusto</h3>

      <div class="p-field mb-3">
        <label>Cliente</label>
        <select v-model="form.idCliente" class="p-inputtext w-full">
          <option :value="0">Seleccione un cliente</option>
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }} - {{ cliente.ci }}
          </option>
        </select>
      </div>

      <div class="p-field mb-3">
        <label>Observación</label>
        <input
          v-model="form.observacion"
          class="p-inputtext w-full"
          placeholder="Observación (opcional)"
        />
      </div>

      <hr />
      <h4>Agregar Productos</h4>

      <div class="flex gap-2 mb-3">
        <select v-model="productoSeleccionado" class="p-inputtext" style="flex: 1">
          <option :value="0">Seleccione un producto</option>
          <option v-for="producto in productos" :key="producto.id" :value="producto.id">
            {{ producto.nombre }} - Bs. {{ producto.precio }}
          </option>
        </select>
        <input
          v-model="cantidadSeleccionada"
          type="number"
          min="1"
          class="p-inputtext"
          style="width: 80px"
        />
        <button class="p-button p-button-primary" @click="agregarProducto">Agregar</button>
      </div>

      <table class="p-datatable p-component w-full mb-3" v-if="detalles.length > 0">
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
            <td>{{ detalle.productoNombre }}</td>
            <td>Bs. {{ detalle.precioUnitario }}</td>
            <td>{{ detalle.cantidad }}</td>
            <td>Bs. {{ detalle.subtotal }}</td>
            <td>
              <button class="p-button p-button-danger p-button-sm" @click="eliminarDetalle(index)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="text-right mb-3">
        <strong style="font-size: 1.2rem">Total: Bs. {{ form.total }}</strong>
      </div>

      <div class="mt-3">
        <button class="p-button p-button-success mr-2" @click="guardar">Registrar Venta</button>
        <button class="p-button p-button-secondary" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>
