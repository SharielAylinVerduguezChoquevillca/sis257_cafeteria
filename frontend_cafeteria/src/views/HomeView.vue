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
    <div class="mb-6">
      <div
        style="
          background: #fbf6ef;
          border: 1px solid #e8dcc8;
          border-radius: 1rem;
          padding: 1.25rem 1.5rem;
        "
      >
        <h5 style="margin: 0; font-weight: 600; color: #4a2c2a; font-size: 1.1rem">
          Bienvenido, {{ authStore.usuario?.nombre }} 
        </h5>
        <p style="margin: 2px 0 0; font-size: 0.85rem; color: #a98a66">
          Panel de administración — Cafetería El Buen Gusto
        </p>
      </div>
    </div>

    <div
      style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.25rem;
        margin-bottom: 1.5rem;
      "
    >
      <div style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; padding: 1rem">
        <div style="display: flex; justify-content: space-between; align-items: flex-start">
          <div>
            <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #a98a66; margin-bottom: 4px;">
              Categorías
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: #4a2c2a">{{ totalCategorias }}</h5>
            <p style="font-size: 12px; color: #b5a48e; margin: 0">Total registradas</p>
          </div>
          <RouterLink
            to="/categorias"
            style="width: 46px; height: 46px; border-radius: 50%; background: #6f4e37; display: flex; align-items: center; justify-content: center;"
          >
            <i class="ni ni-bullet-list-67" style="color: #f3e5d5; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <div style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; padding: 1rem">
        <div style="display: flex; justify-content: space-between; align-items: flex-start">
          <div>
            <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #a98a66; margin-bottom: 4px;">
              Productos
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: #4a2c2a">{{ totalProductos }}</h5>
            <p style="font-size: 12px; color: #b5a48e; margin: 0">En catálogo</p>
          </div>
          <RouterLink
            to="/productos"
            style="width: 46px; height: 46px; border-radius: 50%; background: #b0832b; display: flex; align-items: center; justify-content: center;"
          >
            <i class="ni ni-box-2" style="color: #fbf6ef; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <div style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; padding: 1rem">
        <div style="display: flex; justify-content: space-between; align-items: flex-start">
          <div>
            <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #a98a66; margin-bottom: 4px;">
              Clientes
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: #4a2c2a">{{ totalClientes }}</h5>
            <p style="font-size: 12px; color: #b5a48e; margin: 0">Registrados</p>
          </div>
          <RouterLink
            to="/clientes"
            style="width: 46px; height: 46px; border-radius: 50%; background: #c0703d; display: flex; align-items: center; justify-content: center;"
          >
            <i class="ni ni-single-02" style="color: #fbf6ef; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>

      <div style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; padding: 1rem">
        <div style="display: flex; justify-content: space-between; align-items: flex-start">
          <div>
            <p style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #a98a66; margin-bottom: 4px;">
              Ventas
            </p>
            <h5 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: #4a2c2a">{{ totalVentas }}</h5>
            <p style="font-size: 12px; color: #3b6d11; font-weight: 600; margin: 0">
              Bs. {{ totalRecaudado.toFixed(2) }} recaudado
            </p>
          </div>
          <RouterLink
            to="/ventas"
            style="width: 46px; height: 46px; border-radius: 50%; background: #4a2c2a; display: flex; align-items: center; justify-content: center;"
          >
            <i class="ni ni-cart" style="color: #f3e5d5; font-size: 18px"></i>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3">
      <div class="w-full max-w-full px-3 lg:w-7/12 mb-6">
        <div
          style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; overflow: hidden;"
        >
          <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f0e7d9">
            <div class="flex justify-between items-center">
              <h6 style="margin: 0; font-weight: 600; color: #4a2c2a">🛒 Últimas ventas</h6>
              <RouterLink to="/ventas" style="font-size: 0.85rem; color: #6f4e37; font-weight: 600">
                Ver todas →
              </RouterLink>
            </div>
          </div>
          <div class="p-4">
            <div class="overflow-x-auto">
              <table class="w-full mb-0 border-collapse">
                <thead>
                  <tr style="background: #6f4e37">
                    <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #f3e5d5;">#</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #f3e5d5;">Cliente</th>
                    <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #f3e5d5;">Fecha</th>
                    <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 600; text-transform: uppercase; color: #f3e5d5;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="venta in ultimasVentas"
                    :key="venta.id"
                    style="border-bottom: 1px solid #f0e7d9"
                  >
                    <td style="padding: 12px 14px; font-size: 0.85rem; color: #b5a48e">{{ venta.id }}</td>
                    <td style="padding: 12px 14px; font-size: 0.85rem; font-weight: 600; color: #4a2c2a">
                      {{ venta.cliente?.nombre || 'Sin cliente' }}
                    </td>
                    <td style="padding: 12px 14px; font-size: 0.85rem; color: #7a6650">
                      {{ new Date(venta.fecha).toLocaleDateString() }}
                    </td>
                    <td style="padding: 12px 14px; font-size: 0.85rem; font-weight: 700; color: #3b6d11; text-align: right">
                      Bs. {{ venta.total }}
                    </td>
                  </tr>
                  <tr v-if="ultimasVentas.length === 0">
                    <td colspan="4" style="padding: 1.5rem; text-align: center; font-size: 0.85rem; color: #b5a48e">
                      No hay ventas registradas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full max-w-full px-3 lg:w-5/12 mb-6">
        <div
          style="background: white; border: 1px solid #ede2d3; border-radius: 1rem; overflow: hidden;"
        >
          <div style="padding: 1rem 1.25rem; border-bottom: 1px solid #f0e7d9">
            <div class="flex justify-between items-center">
              <h6 style="margin: 0; font-weight: 600; color: #4a2c2a">Top productos</h6>
              <RouterLink to="/productos" style="font-size: 0.85rem; color: #6f4e37; font-weight: 600">
                Ver todos →
              </RouterLink>
            </div>
          </div>
          <div class="p-4">
            <ul class="flex flex-col pl-0 mb-0">
              <li
                v-for="(producto, index) in topProductos"
                :key="producto.id"
                style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0e7d9;"
              >
                <div class="flex items-center">
                  <div
                    style="width: 32px; height: 32px; margin-right: 14px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 0.85rem;"
                    :style="{
                      background: index === 0 ? '#B0832B' : index === 1 ? '#6F4E37' : '#C9A876',
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flex flex-col">
                    <h6 style="margin: 0; font-size: 0.85rem; font-weight: 600; color: #4a2c2a">{{ producto.nombre }}</h6>
                    <span style="font-size: 0.75rem; color: #a98a66">
                      {{ producto.categoria?.nombre }} · {{ (producto as any).vendidos }} vendidos
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span style="font-size: 0.85rem; font-weight: 700; color: #3b6d11">Bs. {{ producto.precio }}</span>
                  <br />
                  <span style="font-size: 0.75rem; color: #b5a48e">Stock: {{ producto.stock }}</span>
                </div>
              </li>
              <li v-if="topProductos.length === 0" style="padding: 1rem; text-align: center; font-size: 0.85rem; color: #b5a48e">
                No hay productos registrados
              </li>
            </ul>
            <div class="text-center mt-4">
              <RouterLink
                to="/ventas"
                style="display: inline-block; padding: 0.5rem 1.5rem; font-size: 0.85rem; font-weight: 700; color: #f3e5d5; border-radius: 0.5rem; background: #6f4e37;"
              >
                + Nueva venta
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>