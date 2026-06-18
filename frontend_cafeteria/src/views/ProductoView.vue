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
  <div class="page-section">
    <div class="page-container">
      <div class="heading">
        <span class="heading-sub">Gestión</span>
        <h2 class="heading-title">Productos</h2>
      </div>

      <div class="toolbar">
        <button class="btn-cafe" @click="handleCreate">+ Nuevo producto</button>
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
  </div>
</template>

<style scoped>
.page-section {
  padding: 2rem 1.5rem;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
}

.heading {
  text-align: center;
  margin-bottom: 2rem;
}

.heading-sub {
  display: block;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a98a66;
  margin-bottom: 4px;
}

.heading-title {
  font-size: 2rem;
  font-weight: 600;
  color: #4a2c2a;
  margin: 0;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.btn-cafe {
  background: #6f4e37;
  color: #fbf6ef;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.25s,
    transform 0.1s;
}

.btn-cafe:hover {
  background: #4a2c2a;
}

.btn-cafe:active {
  transform: scale(0.98);
}
</style>