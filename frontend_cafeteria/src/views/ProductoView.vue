<script setup lang="ts">
import ProductoList from '../components/producto/ProductoList.vue'
import ProductoSave from '../components/producto/ProductoSave.vue'
import { ref } from 'vue'
import type { Producto } from '@/models/producto'

const mostrarDialog = ref(false)
const productoListRef = ref<typeof ProductoList | null>(null)
const productoEdit = ref<Producto | null>(null)

function handleCreate() {
  productoEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(producto: Producto) {
  productoEdit.value = producto
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  productoListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="flex justify-content-between align-items-center mt-3">
      <h2>Productos</h2>
      <button class="p-button p-button-primary" @click="handleCreate">
        Nuevo Producto
      </button>
    </div>
    <ProductoList ref="productoListRef" @edit="handleEdit" />
    <ProductoSave
      :mostrar="mostrarDialog"
      :producto="productoEdit"
      :modoEdicion="!!productoEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>