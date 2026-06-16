<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../plugins/axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const totalProductos = ref(0)
const totalClientes = ref(0)
const totalVentas = ref(0)
const totalCategorias = ref(0)
const totalRecaudado = ref(0)
const ultimasVentas = ref<any[]>([])
const topProductos = ref<any[]>([])

onMounted(async () => {
  try {
    const [productos, clientes, ventas, categorias] = await Promise.all([
      axios.get('/productos'),
      axios.get('/clientes'),
      axios.get('/ventas'),
      axios.get('/categorias'),
    ])
    totalProductos.value = productos.data.length
    totalClientes.value = clientes.data.length
    totalVentas.value = ventas.data.length
    totalCategorias.value = categorias.data.length
    totalRecaudado.value = ventas.data.reduce((acc: number, v: any) => acc + Number(v.total), 0)
    ultimasVentas.value = ventas.data.slice(0, 5)

    const conteo: Record<number, number> = {}
    for (const venta of ventas.data) {
      if (venta.detalles) {
        for (const detalle of venta.detalles) {
          conteo[detalle.idProducto] = (conteo[detalle.idProducto] || 0) + detalle.cantidad
        }
      }
    }
    topProductos.value = [...productos.data]
      .map((p: any) => ({ ...p, vendidos: conteo[p.id] || 0 }))
      .sort((a: any, b: any) => b.vendidos - a.vendidos)
      .slice(0, 3)
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full px-6 py-6 mx-auto">
    <!-- Bienvenida -->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl bg-clip-border p-6"
        >
          <div class="flex items-center">
            <div>
              <h5 class="mb-0 font-bold dark:text-white">
                Bienvenido, {{ authStore.usuario?.nombre }} ☕
              </h5>
              <p class="mb-0 text-sm text-slate-500">
                Panel de Administración — Cafetería El Buen Gusto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Cards estadísticas -->
    <!-- Cards estadísticas -->
    <div
      style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      "
    >
      <!-- Categorías -->
      <div
        style="
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
          padding: 1rem;
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <p
              style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                color: #8392ab;
                margin-bottom: 4px;
              "
            >
              Categorías
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 700; margin: 0">{{ totalCategorias }}</h5>
            <p style="font-size: 12px; color: #8392ab; margin: 0">Total registradas</p>
          </div>
          <RouterLink
            to="/categorias"
            style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(310deg, #f5365c, #f56036);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <i class="ni ni-bullet-list-67" style="color: white; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <!-- Productos -->
      <div
        style="
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
          padding: 1rem;
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <p
              style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                color: #8392ab;
                margin-bottom: 4px;
              "
            >
              Productos
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 700; margin: 0">{{ totalProductos }}</h5>
            <p style="font-size: 12px; color: #8392ab; margin: 0">En catálogo</p>
          </div>
          <RouterLink
            to="/productos"
            style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(310deg, #7928ca, #ff0080);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <i class="ni ni-box-2" style="color: white; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <!-- Clientes -->
      <div
        style="
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
          padding: 1rem;
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <p
              style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                color: #8392ab;
                margin-bottom: 4px;
              "
            >
              Clientes
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 700; margin: 0">{{ totalClientes }}</h5>
            <p style="font-size: 12px; color: #8392ab; margin: 0">Registrados</p>
          </div>
          <RouterLink
            to="/clientes"
            style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(310deg, #17ad37, #98ec2d);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <i class="ni ni-single-02" style="color: white; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <!-- Ventas -->
      <div
        style="
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
          padding: 1rem;
        "
      >
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div>
            <p
              style="
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                color: #8392ab;
                margin-bottom: 4px;
              "
            >
              Ventas
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 700; margin: 0">{{ totalVentas }}</h5>
            <p style="font-size: 12px; color: #2dce89; font-weight: 600; margin: 0">
              Bs. {{ totalRecaudado.toFixed(2) }} recaudado
            </p>
          </div>
          <RouterLink
            to="/ventas"
            style="
              width: 48px;
              height: 48px;
              border-radius: 50%;
              background: linear-gradient(310deg, #f5365c, #f56036);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <i class="ni ni-cart" style="color: white; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Últimas ventas y Top productos -->
    <div class="flex flex-wrap -mx-3">
      <!-- Últimas ventas -->
      <div class="w-full max-w-full px-3 lg:w-7/12 mb-6">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl bg-clip-border"
        >
          <div class="p-4 pb-0 mb-0 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h6 class="mb-0 font-bold">🛒 Últimas Ventas</h6>
              <RouterLink to="/ventas" class="text-sm text-blue-500 font-semibold"
                >Ver todas →</RouterLink
              >
            </div>
          </div>
          <div class="flex-auto p-4">
            <div class="overflow-x-auto">
              <table class="w-full mb-0 align-top border-collapse">
                <thead>
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 border-b"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 border-b"
                    >
                      Cliente
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 border-b"
                    >
                      Fecha
                    </th>
                    <th
                      class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500 border-b"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="venta in ultimasVentas"
                    :key="venta.id"
                    class="border-b border-gray-100"
                  >
                    <td class="px-4 py-3 text-sm text-slate-400">{{ venta.id }}</td>
                    <td class="px-4 py-3 text-sm font-semibold text-slate-700">
                      {{ venta.cliente?.nombre || 'Sin cliente' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-slate-500">
                      {{ new Date(venta.fecha).toLocaleDateString() }}
                    </td>
                    <td class="px-4 py-3 text-sm font-bold text-emerald-500 text-right">
                      Bs. {{ venta.total }}
                    </td>
                  </tr>
                  <tr v-if="ultimasVentas.length === 0">
                    <td colspan="4" class="px-4 py-6 text-center text-sm text-slate-400">
                      No hay ventas registradas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Top productos -->
      <div class="w-full max-w-full px-3 lg:w-5/12 mb-6">
        <div
          class="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl bg-clip-border"
        >
          <div class="p-4 pb-0 mb-0 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h6 class="mb-0 font-bold">☕ Top Productos</h6>
              <RouterLink to="/productos" class="text-sm text-blue-500 font-semibold"
                >Ver todos →</RouterLink
              >
            </div>
          </div>
          <div class="flex-auto p-4">
            <ul class="flex flex-col pl-0 mb-0">
              <li
                v-for="(producto, index) in topProductos"
                :key="producto.id"
                class="relative flex justify-between py-3 border-b border-gray-100"
              >
                <div class="flex items-center">
                  <div
                    class="inline-block w-8 h-8 mr-4 text-center text-white shadow-sm rounded-xl flex items-center justify-center font-bold"
                    :class="
                      index === 0
                        ? 'bg-gradient-to-tl from-orange-500 to-yellow-500'
                        : index === 1
                          ? 'bg-gradient-to-tl from-blue-500 to-violet-500'
                          : 'bg-gradient-to-tl from-slate-600 to-slate-300'
                    "
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex flex-col">
                    <h6 class="mb-0 text-sm font-semibold text-slate-700">{{ producto.nombre }}</h6>
                    <span class="text-xs text-slate-400"
                      >{{ producto.categoria?.nombre }} ·
                      {{ (producto as any).vendidos }} vendidos</span
                    >
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-emerald-500">Bs. {{ producto.precio }}</span>
                  <br />
                  <span class="text-xs text-slate-400">Stock: {{ producto.stock }}</span>
                </div>
              </li>
              <li v-if="topProductos.length === 0" class="py-4 text-center text-sm text-slate-400">
                No hay productos registrados
              </li>
            </ul>
            <div class="text-center mt-4">
              <RouterLink
                to="/ventas"
                class="inline-block px-6 py-2 text-sm font-bold text-white rounded-lg bg-gradient-to-tl from-red-600 to-orange-600"
              >
                + Nueva Venta
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
