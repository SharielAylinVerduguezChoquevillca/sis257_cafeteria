<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '@/plugins/axios'
import type { Categoria } from '@/models/categoria'

const props = defineProps<{
  mostrar: boolean
  categoria: Categoria | null
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])

const form = ref<Categoria>({
  id: 0,
  nombre: '',
  descripcion: '',
})

watch(
  () => props.categoria,
  (val) => {
    if (val) {
      form.value = { ...val }
    } else {
      form.value = { id: 0, nombre: '', descripcion: '' }
    }
  },
)

async function guardar() {
  if (props.modoEdicion) {
    await axios.patch(`/categorias/${form.value.id}`, form.value)
  } else {
    await axios.post('/categorias', form.value)
  }
  emit('guardar')
  emit('close')
}
</script>

<template>
  <div v-if="mostrar" class="p-dialog-mask">
    <div
      class="p-dialog"
      style="width: 400px; background: white; padding: 20px; border-radius: 8px; margin: 100px auto"
    >
      <h3>{{ modoEdicion ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
      <div class="p-field mb-3">
        <label>Nombre</label>
        <input
          v-model="form.nombre"
          class="p-inputtext w-full"
          placeholder="Nombre de la categoría"
        />
      </div>
      <div class="p-field mb-3">
        <label>Descripción</label>
        <input
          v-model="form.descripcion"
          class="p-inputtext w-full"
          placeholder="Descripción (opcional)"
        />
      </div>
      <div class="mt-3">
        <button class="p-button p-button-success mr-2" @click="guardar">Guardar</button>
        <button class="p-button p-button-secondary" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>
