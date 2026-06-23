<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import axios from '@/plugins/axios'
import type { Usuario } from '../../models/usuario'

const props = defineProps<{
  mostrar: boolean
  usuario: Usuario | null
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])

const form = ref({
  id: 0,
  nombre: '',
  email: '',
  password: '',
  rol: 'cajero',
  activo: true,
})

function setForm() {
  if (props.usuario) {
    form.value = {
      id: props.usuario.id,
      nombre: props.usuario.nombre,
      email: props.usuario.email,
      password: '', // vacío al editar: solo se cambia si escriben algo
      rol: props.usuario.rol || 'cajero',
      activo: props.usuario.activo ?? true,
    }
  } else {
    form.value = {
      id: 0,
      nombre: '',
      email: '',
      password: '',
      rol: 'cajero',
      activo: true,
    }
  }
}

watch(
  () => [props.mostrar, props.usuario],
  async ([val]) => {
    if (val) {
      await nextTick()
      setForm()
    }
  },
  { immediate: true },
)

async function guardar() {
  // Validación básica
  if (!form.value.nombre || !form.value.email) {
    alert('Nombre y email son obligatorios')
    return
  }
  if (!props.modoEdicion && !form.value.password) {
    alert('La contraseña es obligatoria al crear un usuario')
    return
  }

  if (props.modoEdicion) {
    // Al editar: armamos el objeto sin password si está vacío
    const data: any = {
      nombre: form.value.nombre,
      email: form.value.email,
      rol: form.value.rol,
      activo: form.value.activo,
    }
    if (form.value.password) {
      data.password = form.value.password
    }
    await axios.patch(`/usuarios/${form.value.id}`, data)
  } else {
    // Al crear: enviamos todo
    await axios.post('/usuarios', {
      nombre: form.value.nombre,
      email: form.value.email,
      password: form.value.password,
      rol: form.value.rol,
      activo: form.value.activo,
    })
  }
  emit('guardar')
  emit('close')
}
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-panel">
      <div class="modal-header">
        <span class="subheading-sm">Cafetería</span>
        <h3>{{ modoEdicion ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div class="form-group">
          <label class="field-label">Nombre</label>
          <input v-model="form.nombre" class="control" placeholder="Nombre completo" autocomplete="off" />
        </div>

        <div class="form-group">
          <label class="field-label">Email</label>
          <input v-model="form.email" type="email" class="control" placeholder="correo@cafeteria.com" autocomplete="off" />
        </div>

        <div class="form-group">
          <label class="field-label">
            Contraseña
            <span v-if="modoEdicion" class="hint">(dejar vacío para no cambiarla)</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            class="control"
            autocomplete="new-password"
            :placeholder="modoEdicion ? '••••••' : 'Mínimo 6 caracteres'"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="field-label">Rol</label>
            <select v-model="form.rol" class="control">
              <option value="cajero">Cajero</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div class="form-group check-col">
            <label class="check-label">
              <input v-model="form.activo" type="checkbox" />
              Activo
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-guardar" @click="guardar">Guardar</button>
        <button class="btn-cancelar" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(36, 20, 16, 0.6);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #fbf6ef;
  border: 1px solid #e8dcc8;
  border-radius: 16px;
  width: 100%;
  max-width: 470px;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px 28px 12px;
  position: relative;
}

.subheading-sm {
  font-family: 'Great Vibes', cursive;
  font-size: 26px;
  color: #b0832b;
  display: block;
  line-height: 1;
  margin-bottom: 2px;
}

.modal-header h3 {
  font-size: 20px;
  color: #4a2c2a;
  margin: 0;
  font-weight: 600;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #a98a66;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #6f4e37;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, #c49b63, rgba(196, 155, 99, 0.1));
  margin: 0 28px;
}

.modal-body {
  padding: 20px 28px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 14px;
}

.form-row .form-group {
  flex: 1;
}

.check-col {
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6f4e37;
  margin-bottom: 6px;
}

.hint {
  font-weight: 400;
  font-size: 11px;
  color: #a98a66;
}

.control {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid #e8dcc8;
  border-radius: 8px;
  color: #4a2c2a;
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s;
  box-sizing: border-box;
}

.control::placeholder {
  color: #b5a48e;
}

.control:focus {
  border-color: #c49b63;
}

select.control {
  cursor: pointer;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #4a2c2a;
  cursor: pointer;
}

.check-label input {
  width: 16px;
  height: 16px;
  accent-color: #6f4e37;
}

.modal-footer {
  padding: 14px 28px 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #f0e7d9;
}

.btn-guardar {
  background: #6f4e37;
  color: #fbf6ef;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s;
}

.btn-guardar:hover {
  background: #4a2c2a;
}

.btn-cancelar {
  background: transparent;
  border: 1px solid #d8c6ad;
  color: #7a6650;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cancelar:hover {
  background: #f0e7d9;
  color: #4a2c2a;
}
</style>