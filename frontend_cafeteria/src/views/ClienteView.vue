<script setup lang="ts">
import ClienteList from '../components/cliente/ClienteList.vue'
import ClienteSave from '../components/cliente/ClienteSave.vue'
import { ref } from 'vue'
import type { Cliente } from '../models/cliente'

const mostrarDialog = ref(false)
const clienteListRef = ref<typeof ClienteList | null>(null)
const clienteEdit = ref<Cliente | null>(null)

function handleCreate() {
  clienteEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(cliente: Cliente) {
  clienteEdit.value = cliente
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  clienteListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="page-section">
    <div class="page-container">
      <div class="heading">
        <span class="heading-sub">Gestión</span>
        <h2 class="heading-title">Clientes</h2>
      </div>

      <div class="toolbar">
        <button class="btn-cafe" @click="handleCreate">+ Nuevo cliente</button>
      </div>

      <ClienteList ref="clienteListRef" @edit="handleEdit" />

      <ClienteSave
        :mostrar="mostrarDialog"
        :cliente="clienteEdit"
        :modoEdicion="!!clienteEdit"
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