<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from '@/plugins/axios'
import type { Producto } from '../../models/producto'
import type { Categoria } from '../../models/categoria'

const props = defineProps<{
  mostrar: boolean
  producto: Producto | null
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

const form = ref<Producto>({
  id: 0,
  idCategoria: 0,
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  activo: true,
})

watch(() => props.producto, (val) => {
  if (val) {
    form.value = { ...val }
  } else {
    form.value = { id: 0, idCategoria: 0, nombre: '', descripcion: '', precio: 0, stock: 0, activo: true }
  }
})

async function obtenerCategorias() {
  const response = await axios.get('/categorias')
  categorias.value = response.data
}

async function guardar() {
  if (props.modoEdicion) {
    await axios.patch(`/productos/${form.value.id}`, form.value)
  } else {
    await axios.post('/productos', form.value)
  }
  emit('guardar')
  emit('close')
}

onMounted(() => {
  obtenerCategorias()
})
</script>

<template>
  <div v-if="mostrar" class="p-dialog-mask">
    <div class="p-dialog" style="width: 400px; background: white; padding: 20px; border-radius: 8px; margin: 100px auto;">
      <h3>{{ modoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
      <div class="p-field mb-3">
        <label>Categoría</label>
        <select v-model="form.idCategoria" class="p-inputtext w-full">
          <option value="0">Seleccione una categoría</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
            {{ cat.nombre }}
          </option>
        </select>
      </div>
      <div class="p-field mb-3">
        <label>Nombre</label>
        <input v-model="form.nombre" class="p-inputtext w-full" placeholder="Nombre del producto" />
      </div>
      <div class="p-field mb-3">
        <label>Descripción</label>
        <input v-model="form.descripcion" class="p-inputtext w-full" placeholder="Descripción (opcional)" />
      </div>
      <div class="p-field mb-3">
        <label>Precio</label>
        <input v-model="form.precio" type="number" class="p-inputtext w-full" placeholder="0.00" />
      </div>
      <div class="p-field mb-3">
        <label>Stock</label>
        <input v-model="form.stock" type="number" class="p-inputtext w-full" placeholder="0" />
      </div>
      <div class="p-field mb-3">
        <label>Activo</label>
        <input v-model="form.activo" type="checkbox" />
      </div>
      <div class="mt-3">
        <button class="p-button p-button-success mr-2" @click="guardar">Guardar</button>
        <button class="p-button p-button-secondary" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>