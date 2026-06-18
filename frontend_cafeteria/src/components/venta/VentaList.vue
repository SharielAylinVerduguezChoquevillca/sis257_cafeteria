<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../../plugins/axios'
import type { Venta } from '../../models/venta'

const ventas = ref<Venta[]>([])
const emit = defineEmits(['edit'])

async function obtenerLista() {
  const response = await axios.get('/ventas')
  ventas.value = response.data
}

async function eliminar(id: number) {
  if (confirm('¿Está seguro de eliminar esta venta?')) {
    await axios.delete(`/ventas/${id}`)
    await obtenerLista()
  }
}

defineExpose({ obtenerLista })

onMounted(() => {
  obtenerLista()
})
</script>

<template>
  <div class="tabla-wrapper">
    <table class="tabla">
      <thead>
        <tr>
          <th style="width: 60px">#</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Usuario</th>
          <th class="t-right">Total</th>
          <th>Observación</th>
          <th class="t-center" style="width: 180px">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="ventas.length === 0">
          <td colspan="7" class="vacio">No hay ventas registradas</td>
        </tr>

        <tr v-for="(venta, index) in ventas" :key="venta.id">
          <td class="c-num">{{ index + 1 }}</td>
          <td class="c-dato">{{ new Date(venta.fecha!).toLocaleDateString() }}</td>
          <td class="c-nombre">{{ venta.cliente?.nombre }}</td>
          <td class="c-dato">{{ venta.usuario?.nombre }}</td>
          <td class="t-right c-total">Bs. {{ venta.total }}</td>
          <td class="c-dato">{{ venta.observacion || '—' }}</td>
          <td class="t-center">
            <div class="acciones">
              <button class="btn-editar" @click="emit('edit', venta)">Editar</button>
              <button class="btn-eliminar" @click="eliminar(venta.id)">Eliminar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tabla-wrapper {
  overflow-x: auto;
  background: #fbf6ef;
  border: 1px solid #e8dcc8;
  border-radius: 12px;
}

.tabla {
  width: 100%;
  min-width: 800px;
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
.c-total {
  color: #3b6d11;
  font-weight: 700;
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
</style>