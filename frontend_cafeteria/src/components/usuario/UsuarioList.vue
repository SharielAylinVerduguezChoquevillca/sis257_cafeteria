<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from '../../plugins/axios'
import type { Usuario } from '../../models/usuario'

const usuarios = ref<Usuario[]>([])
const emit = defineEmits(['edit'])

const paginaActual = ref(1)
const itemsPorPagina = ref(5)

async function obtenerLista() {
  const response = await axios.get('/usuarios')
  usuarios.value = response.data
  paginaActual.value = 1
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar este usuario?')) {
    await axios.delete(`/usuarios/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
})

const busqueda = ref('')

const usuariosFiltrados = computed(() => {
  if (!busqueda.value) return usuarios.value
  return usuarios.value.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

const totalFiltrados = computed(() => usuariosFiltrados.value.length)

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return usuariosFiltrados.value.slice(inicio, fin)
})

const totalPaginas = computed(() => {
  return Math.ceil(totalFiltrados.value / itemsPorPagina.value)
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
    <input v-model="busqueda" class="buscador" placeholder="Buscar usuario o email..." />

    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th style="width: 50px">#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th class="t-center">Rol</th>
            <th class="t-center">Activo</th>
            <th class="t-center" style="width: 180px">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="usuariosPaginados.length === 0">
            <td colspan="6" class="vacio">No hay usuarios registrados</td>
          </tr>

          <tr v-for="(usuario, index) in usuariosPaginados" :key="usuario.id" class="fila-usuario">
            <td class="c-num">{{ (paginaActual - 1) * itemsPorPagina + index + 1 }}</td>
            <td class="c-nombre">{{ usuario.nombre }}</td>
            <td class="c-dato">{{ usuario.email }}</td>
            <td class="t-center">
              <span class="badge-rol" :class="usuario.rol === 'admin' ? 'rol-admin' : 'rol-cajero'">
                {{ usuario.rol === 'admin' ? 'Administrador' : 'Cajero' }}
              </span>
            </td>
            <td class="t-center">
              <span :class="usuario.activo ? 'activo-si' : 'activo-no'">
                {{ usuario.activo ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="t-center">
              <div class="acciones">
                <button class="btn-editar" @click="emit('edit', usuario)">Editar</button>
                <button class="btn-eliminar" @click="eliminar(usuario.id)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalFiltrados > 0" class="paginacion">
      <div class="paginacion-info">
        Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} -
        {{ Math.min(paginaActual * itemsPorPagina, totalFiltrados) }}
        de {{ totalFiltrados }} usuarios
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
          :class="{ activo: pagina === paginaActual }"
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
        <span class="texto-items">{{ itemsPorPagina }} por página</span>
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
  min-width: 700px;
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

.fila-usuario td {
  padding: 14px 14px;
  border-bottom: 1px solid #f0e7d9;
  vertical-align: middle;
}

.fila-usuario:nth-of-type(odd) {
  background: #fcf7f0;
}

.fila-usuario:hover {
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

.t-right {
  text-align: right;
}
.t-center {
  text-align: center;
}

.badge-rol {
  display: inline-block;
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid;
  border-radius: 20px;
}

.rol-admin {
  color: #185fa5;
  border-color: #185fa5;
  background: rgba(24, 95, 165, 0.08);
}

.rol-cajero {
  color: #0f6e56;
  border-color: #0f6e56;
  background: rgba(15, 110, 86, 0.08);
}

.activo-si {
  color: #3b6d11;
  font-weight: 600;
}

.activo-no {
  color: #c0563a;
  font-weight: 600;
}

.vacio {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #a98a66;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.acciones {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-editar,
.btn-eliminar {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
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