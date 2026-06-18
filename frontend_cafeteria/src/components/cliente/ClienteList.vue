<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '../../plugins/axios'
import type { Cliente } from '../../models/cliente'

const clientes = ref<Cliente[]>([])
const emit = defineEmits(['edit'])

const paginaActual = ref(1)
const productosPorPagina = ref(5)

async function obtenerLista() {
  const response = await axios.get('/clientes')
  clientes.value = response.data
  paginaActual.value = 1
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
  return clientes.value.filter((c) => {
    return (
      c.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (c.nit || '').toLowerCase().includes(busqueda.value.toLowerCase())
    )
  })
})

const totalFiltrados = computed(() => clientesFiltrados.value.length)

const clientesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * productosPorPagina.value
  const fin = inicio + productosPorPagina.value
  return clientesFiltrados.value.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  return Math.ceil(totalFiltrados.value / productosPorPagina.value)
})

watch(busqueda, () => {
  paginaActual.value = 1
})

function irPagina(pagina: number) {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

function obtenerRangoPaginas() {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const rango: number[] = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      rango.push(i)
    }
  } else {
    if (actual <= 3) {
      rango.push(1, 2, 3, 4, 5)
    } else if (actual >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        rango.push(i)
      }
    } else {
      rango.push(actual - 2, actual - 1, actual, actual + 1, actual + 2)
    }
  }
  return rango
}
</script>

<template>
  <div>
    <input v-model="busqueda" class="buscador" placeholder="Buscar cliente o NIT..." />

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th style="width: 60px">#</th>
            <th>Nombre</th>
            <th>NIT</th>
            <th>Teléfono</th>
            <th class="t-center" style="width: 180px">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="clientesPaginados.length === 0">
            <td colspan="5" class="vacio">No hay clientes registrados</td>
          </tr>

          <tr v-for="(cliente, index) in clientesPaginados" :key="cliente.id">
            <td class="c-num">{{ (paginaActual - 1) * productosPorPagina + index + 1 }}</td>
            <td class="c-nombre">{{ cliente.nombre }}</td>
            <td class="c-dato">{{ cliente.nit || '—' }}</td>
            <td class="c-dato">{{ cliente.telefono || '—' }}</td>
            <td class="t-center">
              <button class="btn-editar" @click="emit('edit', cliente)">Editar</button>
              <button class="btn-eliminar" @click="eliminar(cliente.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalFiltrados > 0" class="paginacion">
      <div class="paginacion-info">
        Mostrando {{ (paginaActual - 1) * productosPorPagina + 1 }} -
        {{ Math.min(paginaActual * productosPorPagina, totalFiltrados) }}
        de {{ totalFiltrados }} clientes
      </div>

      <div class="paginacion-controles">
        <button
          class="btn-pagina"
          :disabled="paginaActual === 1"
          @click="irPagina(paginaActual - 1)"
        >
          ◀
        </button>

        <button
          v-for="pagina in obtenerRangoPaginas()"
          :key="pagina"
          class="btn-pagina"
          :class="{ 'activo': pagina === paginaActual }"
          @click="irPagina(pagina)"
        >
          {{ pagina }}
        </button>

        <button
          class="btn-pagina"
          :disabled="paginaActual === totalPaginas"
          @click="irPagina(paginaActual + 1)"
        >
          ▶
        </button>
      </div>

      <div class="paginacion-items">
        <span class="texto-items">{{ productosPorPagina }} por página</span>
      </div>
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

.paginacion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0.5rem 0;
}

.paginacion-info {
  font-size: 13px;
  color: #7a6650;
  font-weight: 500;
}

.paginacion-controles {
  display: flex;
  gap: 4px;
  align-items: center;
}

.btn-pagina {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  background: transparent;
  border: 1px solid #e8dcc8;
  border-radius: 6px;
  color: #4a2c2a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-pagina:hover:not(:disabled) {
  background: #f0e7d9;
  border-color: #c49b63;
}

.btn-pagina:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-pagina.activo {
  background: #6f4e37;
  border-color: #6f4e37;
  color: #fbf6ef;
}

.btn-pagina.activo:hover {
  background: #4a2c2a;
  border-color: #4a2c2a;
}

.paginacion-items {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #7a6650;
}

.texto-items {
  font-weight: 500;
  color: #4a2c2a;
}

@media (max-width: 768px) {
  .paginacion {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .paginacion-info {
    text-align: center;
  }

  .paginacion-controles {
    justify-content: center;
    flex-wrap: wrap;
  }

  .paginacion-items {
    justify-content: center;
  }
}
</style>
