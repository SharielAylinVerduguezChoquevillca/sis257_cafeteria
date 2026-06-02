<script setup lang="ts">
import CategoriaList from '@/components/categoria/categoriaList.vue'
import CategoriaSave from '@/components/categoria/categoriaSave.vue'
import { ref } from 'vue'
import type { Categoria } from '@/models/categoria'

const mostrarDialog = ref(false)
const categoriaListRef = ref<typeof CategoriaList | null>(null)
const categoriaEdit = ref<Categoria | null>(null)

function handleCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: Categoria) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  categoriaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="flex justify-content-between align-items-center mt-3">
      <h2>Categorías</h2>
      <button class="p-button p-button-primary" @click="handleCreate">Nueva Categoría</button>
    </div>
    <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
    <CategoriaSave
      :mostrar="mostrarDialog"
      :categoria="categoriaEdit"
      :modoEdicion="!!categoriaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>
