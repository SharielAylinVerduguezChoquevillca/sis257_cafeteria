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
})

function setForm() {
  if (props.producto) {
    const idCat = Number(props.producto.idCategoria || props.producto.categoria?.id || 0)
    console.log('producto:', props.producto)
    console.log('idCategoria calculado:', idCat)
    console.log('categorias disponibles:', categorias.value)
    form.value = {
      id: props.producto.id,
      idCategoria: idCat,
      nombre: props.producto.nombre,
      descripcion: props.producto.descripcion || '',
      precio: Number(props.producto.precio),
      stock: Number(props.producto.stock),
      activo: props.producto.activo ?? true,
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
      <div class="modal-header-coffee">
        <span class="subheading-sm">Cafetería</span>
        <h3>{{ modoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>

      <div class="gold-divider"></div>

      <div class="modal-body-coffee">
        <div class="appointment-form">
          <div class="form-group mb-3">
            <label class="field-label">Categoría</label>
            <select
              v-model.number="form.idCategoria"
              class="form-control"
              style="background-color: #1a1512 !important; color: white !important"
            >
              <option :value="0">Seleccione una categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group mb-3">
            <label class="field-label">Nombre</label>
            <input v-model="form.nombre" class="form-control" placeholder="Nombre del producto" />
          </div>

          <div class="form-group mb-3">
            <label class="field-label">Descripción</label>
            <input
              v-model="form.descripcion"
              class="form-control"
              placeholder="Descripción (opcional)"
            />
          </div>

          <div class="form-group mb-3">
            <label class="field-label">Precio (Bs.)</label>
            <input
              v-model="form.precio"
              type="number"
              step="0.01"
              class="form-control"
              placeholder="0.00"
            />
          </div>

          <div class="form-group mb-3">
            <label class="field-label">Stock</label>
            <input v-model="form.stock" type="number" class="form-control" placeholder="0" />
          </div>

          <div class="form-group mb-3">
            <label class="field-label" style="display: flex; align-items: center; gap: 10px">
              <input v-model="form.activo" type="checkbox" style="width: auto; margin: 0" />
              Activo
            </label>
          </div>
        </div>
      </div>

      <div class="modal-footer-coffee">
        <button class="btn btn-primary px-4" @click="guardar">Guardar</button>
        <button class="btn btn-outline-white ml-3" @click="emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #1a1512;
  border: 1px solid rgba(196, 155, 99, 0.3);
  width: 100%;
  max-width: 460px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.modal-header-coffee {
  padding: 28px 30px 16px;
  position: relative;
}

.subheading-sm {
  font-family: 'Great Vibes', cursive;
  font-size: 26px;
  color: #c49b63;
  display: block;
  line-height: 1;
  margin-bottom: -6px;
}

.modal-header-coffee h3 {
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  margin: 0;
  font-weight: 700;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #c49b63;
}

.gold-divider {
  height: 2px;
  background: linear-gradient(to right, #c49b63, rgba(196, 155, 99, 0.1));
  margin: 0 30px;
}

.modal-body-coffee {
  padding: 24px 30px;
}

.field-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  font-family: 'Work Sans', sans-serif;
}

.appointment-form .form-control {
  border: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  height: 42px !important;
  padding-left: 0;
  background: transparent !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 14px;
  border-radius: 0;
  box-shadow: none !important;
  transition: border-color 0.3s;
}

select.form-control {
  cursor: pointer;
}

select.form-control option {
  background: #1a1512;
  color: #fff;
}

.appointment-form .form-control::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.appointment-form .form-control:focus,
.appointment-form .form-control:active {
  border-bottom-color: #c49b63 !important;
  outline: none;
}

.modal-footer-coffee {
  padding: 16px 30px 28px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(196, 155, 99, 0.1);
}

.btn-primary {
  background: #c49b63;
  border: 1px solid #c49b63;
  color: #000;
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 0;
  height: 40px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: transparent;
  color: #c49b63;
}

.btn-outline-white {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 0;
  height: 40px;
  padding: 0 20px;
  transition: all 0.3s ease;
}

.btn-outline-white:hover {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}
select.form-control {
  -webkit-appearance: auto !important;
  appearance: auto !important;
  background-color: #1a1512 !important;
}
</style>
