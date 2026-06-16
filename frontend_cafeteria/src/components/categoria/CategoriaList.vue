<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from '../../plugins/axios'
import type { Categoria } from '../../models/categoria'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const categorias = ref<Categoria[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/categorias')
  categorias.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar esta categoría?')) {
    await axios.delete(`/categorias/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
})

const busqueda = ref('')

const categoriasFiltradas = computed(() => {
  if (!busqueda.value) return categorias.value
  return categorias.value.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>

<template>
  <div class="cart-list">
    <input
      v-model="busqueda"
      class="form-control mb-3"
      placeholder="Buscar categoría..."
      style="background: rgba(255,255,255,0.05); border: 1px solid rgba(196,155,99,0.3); color: white; border-radius: 8px; padding: 10px 15px;"
    />
    <table class="table">
      <thead>
        <tr class="thead-primary">
          <th style="width: 60px">#</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th v-if="authStore.esAdmin()" style="width: 180px">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="categoriasFiltradas.length === 0">
          <td :colspan="authStore.esAdmin() ? 4 : 3" class="text-center py-5">
            <span style="color: #c49b63; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
              No hay categorías registradas
            </span>
          </td>
        </tr>
        <tr v-for="(categoria, index) in categoriasFiltradas" :key="categoria.id">
          <td>{{ index + 1 }}</td>
          <td class="product-name">
            <h3>{{ categoria.nombre }}</h3>
          </td>
          <td>{{ categoria.descripcion || '—' }}</td>
          <td v-if="authStore.esAdmin()">
            <button class="btn btn-sm btn-warning mr-2" @click="emit('edit', categoria)">
              Editar
            </button>
            <button class="btn btn-sm btn-danger" @click="eliminar(categoria.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cart-list {
  overflow-x: auto;
  border: 1px solid rgba(196, 155, 99, 0.2);
}
.table {
  min-width: 600px !important;
  background: transparent;
}
.table .thead-primary {
  background: #c49b63;
}
.table .thead-primary th {
  color: #000 !important;
  font-family: 'Josefin Sans', Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  padding: 16px 12px;
  border: 1px solid transparent !important;
  font-weight: 600;
}
.table tbody tr td {
  color: #cccccc;
  background: transparent;
  border: 1px solid transparent !important;
  border-bottom: 1px solid rgba(196, 155, 99, 0.15) !important;
  padding: 18px 12px;
  vertical-align: middle;
  text-align: left !important;
}
.table tbody tr td.product-name h3 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  margin: 0;
}
.table tbody tr:hover td {
  background: rgba(196, 155, 99, 0.05);
}
.btn-warning {
  background: transparent;
  border: 1px solid #c49b63;
  color: #c49b63;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 5px 12px;
  border-radius: 0;
  transition: all 0.3s ease;
}
.btn-warning:hover {
  background: #c49b63;
  color: #000;
}
.btn-danger {
  background: transparent;
  border: 1px solid rgba(220, 53, 69, 0.6);
  color: rgba(220, 53, 69, 0.8);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 5px 12px;
  border-radius: 0;
  transition: all 0.3s ease;
}
.btn-danger:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: #fff;
}
</style>