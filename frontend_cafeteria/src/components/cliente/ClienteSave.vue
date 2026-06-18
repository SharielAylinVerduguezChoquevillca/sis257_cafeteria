<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '../../plugins/axios'
import type { Cliente } from '../../models/cliente'

const props = defineProps<{
  mostrar: boolean
  cliente: Cliente | null | undefined
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])

const loading = ref(false)
const error = ref('')

const form = ref<Cliente>({
  id: 0,
  nombre: '',
  nit: '',
  telefono: '',
})

watch(
  () => props.mostrar,
  (val) => {
    if (!val) return

    if (props.cliente) {
      form.value = { ...props.cliente }
    } else {
      resetForm()
    }

    error.value = ''
  },
)

async function guardar() {
  if (!form.value.nombre.trim()) {
    error.value = 'El nombre es obligatorio'
    return
  }

  try {
    loading.value = true
    error.value = ''
    if (props.modoEdicion) {
      await axios.patch(`/clientes/${form.value.id}`, form.value)
    } else {
      const payload = {
        nombre: form.value.nombre.trim(),
        telefono: form.value.telefono?.trim() || null,
        nit: form.value.nit?.trim() || undefined,
      }

      await axios.post('/clientes', payload)
    }
    emit('guardar')
    emit('close')
  } catch (err: any) {
    if (err.response?.status === 409) {
      error.value = 'Ya existe un cliente con este NIT'
    } else {
      error.value = 'Ocurrió un error al guardar. Intente de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
function resetForm() {
  form.value = {
    id: 0,
    nombre: '',
    nit: '',
    telefono: '',
  }
  error.value = ''
}
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-panel">
      <div class="modal-header">
        <span class="subheading-sm">Cafetería</span>
        <h3>{{ modoEdicion ? 'Editar cliente' : 'Nuevo cliente' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div v-if="error" class="error-msg">{{ error }}</div>

        <div class="form-group">
          <label class="field-label">Nombre completo</label>
          <input
            v-model="form.nombre"
            class="control"
            placeholder="Ej: Juan Pérez"
            :class="{ 'is-invalid': error && !form.nombre.trim() }"
          />
        </div>

        <div class="form-group">
          <label class="field-label">NIT (opcional)</label>
          <input
            v-model="form.nit"
            class="control"
            placeholder="Ej: 1234567 (solo si requiere factura)"
          />
        </div>

        <div class="form-group">
          <label class="field-label">Teléfono (opcional)</label>
          <input v-model="form.telefono" class="control" placeholder="Ej: 71234567 (opcional)" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-guardar" :disabled="loading" @click="guardar">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
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
  max-width: 460px;
  position: relative;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
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

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6f4e37;
  margin-bottom: 6px;
}

.control {
  width: 100%;
  height: 44px;
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

.control.is-invalid {
  border-color: #c0563a;
}

.error-msg {
  background: #fbeaea;
  border-left: 3px solid #c0563a;
  color: #a32d2d;
  font-size: 13px;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
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

.btn-guardar:hover:not(:disabled) {
  background: #4a2c2a;
}

.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
