<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import axios from '@/plugins/axios'
import type { Producto } from '../../models/producto'
import type { Categoria } from '../../models/categoria'

const props = defineProps<{
  mostrar: boolean
  producto: Producto | null
  modoEdicion: boolean
}>()

const emit = defineEmits(['guardar', 'close'])

const categorias = ref<Categoria[]>([])

const form = ref<Producto>({
  id: 0,
  idCategoria: 0,
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  activo: true,
  imagen: '',
})

function setForm() {
  if (props.producto) {
    const idCat = Number(props.producto.idCategoria || props.producto.categoria?.id || 0)
    form.value = {
      id: props.producto.id,
      idCategoria: idCat,
      nombre: props.producto.nombre,
      descripcion: props.producto.descripcion || '',
      precio: Number(props.producto.precio),
      stock: Number(props.producto.stock),
      activo: props.producto.activo ?? true,
      imagen: props.producto.imagen || '',
    }
  } else {
    form.value = {
      id: 0,
      idCategoria: 0,
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      activo: true,
      imagen: '',
    }
  }
}

watch(
  () => props.mostrar,
  async (val) => {
    if (val) {
      await obtenerCategorias()
      await nextTick()
      setForm()
    }
  },
)

async function obtenerCategorias() {
  const response = await axios.get('/categorias')
  categorias.value = response.data
}

async function guardar() {
  const data = {
    idCategoria: Number(form.value.idCategoria),
    nombre: form.value.nombre,
    descripcion: form.value.descripcion,
    precio: Number(form.value.precio),
    stock: Number(form.value.stock),
    activo: form.value.activo,
    imagen: form.value.imagen,
  }
  if (props.modoEdicion) {
    await axios.patch(`/productos/${form.value.id}`, data)
  } else {
    await axios.post('/productos', data)
  }
  emit('guardar')
  emit('close')
}

onMounted(async () => {
  await obtenerCategorias()
})
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-panel">
      <div class="modal-header">
        <span class="subheading-sm">Cafetería</span>
        <h3>{{ modoEdicion ? 'Editar producto' : 'Nuevo producto' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div class="form-group">
          <label class="field-label">Categoría</label>
          <select v-model.number="form.idCategoria" class="control">
            <option :value="0">Seleccione una categoría</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="field-label">Nombre</label>
          <input v-model="form.nombre" class="control" placeholder="Nombre del producto" />
        </div>

        <div class="form-group">
          <label class="field-label">Descripción</label>
          <input v-model="form.descripcion" class="control" placeholder="Descripción (opcional)" />
        </div>

        <div class="form-group">
          <label class="field-label">Imagen (URL)</label>
          <input
            v-model="form.imagen"
            class="control"
            placeholder="https://ejemplo.com/cafe.jpg"
          />
          <div v-if="form.imagen" class="preview-wrap">
            <img :src="form.imagen" alt="Vista previa" class="preview-img" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="field-label">Precio (Bs.)</label>
            <input v-model="form.precio" type="number" step="0.01" class="control" placeholder="0.00" />
          </div>
          <div class="form-group">
            <label class="field-label">Stock</label>
            <input v-model="form.stock" type="number" class="control" placeholder="0" />
          </div>
        </div>

        <div class="form-group">
          <label class="check-label">
            <input v-model="form.activo" type="checkbox" />
            Activo
          </label>
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

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6f4e37;
  margin-bottom: 6px;
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

/* Preview de imagen */
.preview-wrap {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.preview-img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 10px;
  border: 1px solid #e8dcc8;
  object-fit: cover;
}

/* Checkbox */
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