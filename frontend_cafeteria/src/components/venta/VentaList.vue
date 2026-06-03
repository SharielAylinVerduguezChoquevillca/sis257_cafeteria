<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'

const ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/ventas')
  ventas.value = response.data
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
})
</script>

<template>
  <div class="mt-3">
    <table class="p-datatable p-component w-full">
      <thead>
        <tr>
          <th>Nro</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Usuario</th>
          <th>Total</th>
          <th>Observación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventas" :key="venta.id">
          <td>{{ index + 1 }}</td>
          <td>{{ new Date(venta.fecha!).toLocaleDateString() }}</td>
          <td>{{ venta.cliente?.nombre }}</td>
          <td>{{ venta.usuario?.nombre }}</td>
          <td>Bs. {{ venta.total }}</td>
          <td>{{ venta.observacion }}</td>
          <td>
            <button class="p-button p-button-warning p-button-sm mr-2" @click="emit('edit', venta)">
              Editar
            </button>
            <button class="p-button p-button-danger p-button-sm" @click="eliminar(venta.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
