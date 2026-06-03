<script setup lang="ts">
import VentaList from '../components/venta/VentaList.vue'
import VentaSave from '../components/venta/VentaSave.vue'
import { ref } from 'vue'
import type { Venta } from '../models/venta'

const mostrarDialog = ref(false)
const ventaListRef = ref<typeof VentaList | null>(null)
const ventaEdit = ref<Venta | null>(null)

function handleCreate() {
  ventaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(venta: Venta) {
  ventaEdit.value = venta
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  ventaListRef.value?.obtenerLista()
}
</script>

<template>
  <div>
    <div class="flex justify-content-between align-items-center mt-3">
      <h2>Ventas</h2>
      <button class="p-button p-button-primary" @click="handleCreate">Nueva Venta</button>
    </div>
    <VentaList ref="ventaListRef" @edit="handleEdit" />
    <VentaSave
      :mostrar="mostrarDialog"
      :venta="ventaEdit"
      :modoEdicion="!!ventaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>
