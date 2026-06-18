<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from '../../plugins/axios'
import type { Producto } from '../../models/producto'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const productos = ref<Producto[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/productos')
  productos.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    await axios.delete(`/productos/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
})

const busqueda = ref('')

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value
  return productos.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      p.categoria?.nombre.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})
</script>

<template>
  <div>
    <input
      v-model="busqueda"
      class="buscador"
      placeholder="Buscar producto o categoría..."
    />

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th style="width: 60px">#</th>
            <th>Categoría</th>
            <th>Nombre</th>
            <th class="t-right">Precio</th>
            <th class="t-right">Stock</th>
            <th class="t-center">Activo</th>
            <th v-if="authStore.esAdmin()" class="t-center" style="width: 180px">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="productosFiltrados.length === 0">
            <td :colspan="authStore.esAdmin() ? 7 : 6" class="vacio">
              No hay productos registrados
            </td>
          </tr>

          <tr v-for="(producto, index) in productosFiltrados" :key="producto.id">
            <td class="c-num">{{ index + 1 }}</td>
            <td class="c-cat">{{ producto.categoria?.nombre || 'Sin categoría' }}</td>
            <td class="c-nombre">{{ producto.nombre }}</td>
            <td class="t-right c-precio">Bs. {{ producto.precio }}</td>
            <td class="t-right c-stock">{{ producto.stock }}</td>
            <td class="t-center">
              <span class="badge" :class="producto.activo ? 'badge-si' : 'badge-no'">
                {{ producto.activo ? 'Sí' : 'No' }}
              </span>
            </td>
            <td v-if="authStore.esAdmin()" class="t-center">
              <button class="btn-editar" @click="emit('edit', producto)">Editar</button>
              <button class="btn-eliminar" @click="eliminar(producto.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.buscador {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e8dcc8;
  color: #4a2c2a;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.25s;
}

.buscador::placeholder {
  color: #b5a48e;
}

.buscador:focus {
  border-color: #c49b63;
}

.tabla-wrapper {
  overflow-x: auto;
  background: #fbf6ef;
  border: 1px solid #e8dcc8;
  border-radius: 12px;
}

.tabla {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 13.5px;
}

.tabla thead tr {
  background: #4a2c2a;
}

.tabla thead th {
  color: #f3e5d5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 12px;
  font-weight: 600;
  padding: 14px 14px;
  text-align: left;
}

.tabla tbody td {
  padding: 14px 14px;
  border-bottom: 1px solid #f0e7d9;
  vertical-align: middle;
}

.tabla tbody tr:nth-child(even) {
  background: #fcf7f0;
}

.tabla tbody tr:hover {
  background: #f6ece0;
}

.c-num {
  color: #a98a66;
}
.c-cat {
  color: #7a6650;
}
.c-nombre {
  color: #4a2c2a;
  font-weight: 600;
}
.c-precio {
  color: #4a2c2a;
  font-weight: 600;
}
.c-stock {
  color: #7a6650;
}

.t-right {
  text-align: right;
}
.t-center {
  text-align: center;
}

.vacio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #a98a66;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge {
  display: inline-block;
  padding: 3px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.badge-si {
  background: #eaf3de;
  color: #3b6d11;
}

.badge-no {
  background: #fbeaea;
  color: #a32d2d;
}

.btn-editar,
.btn-eliminar {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 3px;
}

.btn-editar {
  background: transparent;
  border: 1px solid #b0832b;
  color: #b0832b;
}

.btn-editar:hover {
  background: #b0832b;
  color: #fff;
}

.btn-eliminar {
  background: transparent;
  border: 1px solid #c0563a;
  color: #c0563a;
}

.btn-eliminar:hover {
  background: #c0563a;
  color: #fff;
}
</style>