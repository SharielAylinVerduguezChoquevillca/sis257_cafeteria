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
  <div class="page-section">
    <div class="page-container">
      <div class="heading">
        <span class="heading-sub">Gestión</span>
        <h2 class="heading-title">Ventas</h2>
      </div>

      <div class="toolbar">
        <button class="btn-cafe" @click="handleCreate">+ Nueva venta</button>
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