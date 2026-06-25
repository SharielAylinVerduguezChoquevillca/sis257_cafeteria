<script setup lang="ts">
import CategoriaList from '../components/categoria/CategoriaList.vue'
import CategoriaSave from '../components/categoria/CategoriaSave.vue'
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
  <div class="page-section">
    <div class="page-container">
      <div class="heading">
        <span class="heading-sub">Gestión</span>
        <h2 class="heading-title">Categorías</h2>
      </div>

      <div class="toolbar">
        <button class="btn-cafe" @click="handleCreate">+ Nueva categoría</button>
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