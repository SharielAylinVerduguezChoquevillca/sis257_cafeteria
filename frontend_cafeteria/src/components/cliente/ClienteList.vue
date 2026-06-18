<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from '../../plugins/axios'
import type { Cliente } from '../../models/cliente'

const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/clientes')
  clientes.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar este cliente?')) {
    await axios.delete(`/clientes/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
})

const busqueda = ref('')

const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value
  return clientes.value.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      c.ci.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})
</script>

<template>
  <div>
    <input v-model="busqueda" class="buscador" placeholder="Buscar cliente o CI..." />

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th style="width: 60px">#</th>
            <th>Nombre</th>
            <th>CI</th>
            <th>Teléfono</th>
            <th class="t-center" style="width: 180px">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="clientesFiltrados.length === 0">
            <td colspan="5" class="vacio">No hay clientes registrados</td>
          </tr>

          <tr v-for="(cliente, index) in clientesFiltrados" :key="cliente.id">
            <td class="c-num">{{ index + 1 }}</td>
            <td class="c-nombre">{{ cliente.nombre }}</td>
            <td class="c-dato">{{ cliente.ci }}</td>
            <td class="c-dato">{{ cliente.telefono || '—' }}</td>
            <td class="t-center">
              <button class="btn-editar" @click="emit('edit', cliente)">Editar</button>
              <button class="btn-eliminar" @click="eliminar(cliente.id)">Eliminar</button>
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
  min-width: 600px;
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
.c-nombre {
  color: #4a2c2a;
  font-weight: 600;
}
.c-dato {
  color: #7a6650;
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

.btn-editar,
.btn-eliminar {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 2px;
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