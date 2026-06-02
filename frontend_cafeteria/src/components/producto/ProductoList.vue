<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Producto } from '../../models/producto'

const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/productos')
  productos.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    await axios.delete(`/productos/${id}`)
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
          <th>Categoría</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(producto, index) in productos" :key="producto.id">
          <td>{{ index + 1 }}</td>
          <td>{{ producto.categoria?.nombre }}</td>
          <td>{{ producto.nombre }}</td>
          <td>Bs. {{ producto.precio }}</td>
          <td>{{ producto.stock }}</td>
          <td>{{ producto.activo ? 'Si' : 'No' }}</td>
          <td>
            <button class="p-button p-button-warning p-button-sm mr-2" @click="emit('edit', producto)">
              Editar
            </button>
            <button class="p-button p-button-danger p-button-sm" @click="eliminar(producto.id)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>