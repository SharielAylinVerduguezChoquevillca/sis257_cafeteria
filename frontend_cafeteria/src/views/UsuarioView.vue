<script setup lang="ts">
import { ref } from 'vue'
import UsuarioList from '../components/usuario/UsuarioList.vue'
import UsuarioForm from '../components/usuario/UsuarioSave.vue'
import type { Usuario } from '../models/usuario'

const mostrarFormulario = ref(false)
const modoEdicion = ref(false)
const usuarioSeleccionado = ref<Usuario | null>(null)
const usuarioListRef = ref<InstanceType<typeof UsuarioList> | null>(null)

function abrirNuevo() {
  usuarioSeleccionado.value = null
  modoEdicion.value = false
  mostrarFormulario.value = true
}

function abrirEditar(usuario: Usuario) {
  usuarioSeleccionado.value = usuario
  modoEdicion.value = true
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  usuarioSeleccionado.value = null
}

function onGuardar() {
  usuarioListRef.value?.obtenerLista()
  cerrarFormulario()
}
</script>

<template>
  <div>
    <div class="view-header">
      <h1>Usuarios</h1>
      <button class="btn-nuevo" @click="abrirNuevo">+ Nuevo usuario</button>
    </div>

    <UsuarioList ref="usuarioListRef" @edit="abrirEditar" />

    <UsuarioForm
      :mostrar="mostrarFormulario"
      :usuario="usuarioSeleccionado"
      :modoEdicion="modoEdicion"
      @guardar="onGuardar"
      @close="cerrarFormulario"
    />
  </div>
</template>

<style scoped>
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-header h1 {
  font-size: 24px;
  color: #4a2c2a;
  font-weight: 700;
  margin: 0;
}

.btn-nuevo {
  background: #6f4e37;
  color: #fbf6ef;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-nuevo:hover {
  background: #4a2c2a;
}
</style>
