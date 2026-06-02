<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Categoria } from '../../models/categoria'

const categorias = ref<Categoria[]>([])

const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/categorias')
  categorias.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    await axios.delete(`/categorias/${id}`)
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
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(categoria, index) in categorias" :key="categoria.id">
          <td>{{ index + 1 }}</td>
          <td>{{ categoria.nombre }}</td>
          <td>{{ categoria.descripcion }}</td>
          <td>
            <button class="p-button p-button-warning p-button-sm mr-2" @click="emit('edit', categoria)">
              Editar
            </button>
            <button class="p-button p-button-danger p-button-sm" @click="eliminar(categoria.id)">
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
