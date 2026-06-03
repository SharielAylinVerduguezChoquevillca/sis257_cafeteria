<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '../plugins/axios'
import bg1 from '@/assets/images/bg_1.jpg'
import bg2 from '@/assets/images/bg_2.jpg'
import bg3 from '@/assets/images/bg_3.jpg'
import menu1 from '@/assets/images/menu-1.jpg'
import menu2 from '@/assets/images/menu-2.jpg'
import menu3 from '@/assets/images/menu-3.jpg'
import menu4 from '@/assets/images/menu-4.jpg'

const totalProductos = ref(0)
const totalClientes = ref(0)
const totalVentas = ref(0)
const totalCategorias = ref(0)
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
    ultimasVentas.value = ventas.data.slice(-5).reverse()
    topProductos.value = [...productos.data]
      .sort((a: any, b: any) => b.precio - a.precio)
      .slice(0, 3)
  } catch (e) {
    console.error(e)
  }

  setTimeout(() => {
    const $ = (window as any).$
    if (!$) return
    const slider = $('.home-slider')
    if (!slider.length) return
    if (slider.hasClass('owl-loaded')) {
      slider.owlCarousel('destroy')
    }
    slider.owlCarousel({
      loop: false,
      autoplay: true,
      autoplayTimeout: 5000,
      margin: 0,
      nav: false,
      items: 1,
      dots: true,
    })
  }, 500)
})
</script>

<template>
  <div>
    <!-- SLIDER -->
    <section class="home-slider owl-carousel">
      <div class="slider-item" :style="{ backgroundImage: `url(${bg1})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center">
              <span class="subheading">Bienvenido</span>
              <h1 class="mb-4">☕ Cafetería El Buen Gusto</h1>
              <p class="mb-4">
                Sistema de gestión de ventas para la cafetería El Buen Gusto de Sucre, Bolivia.
              </p>
              <p>
                <RouterLink to="/ventas" class="btn btn-primary p-3 px-xl-4 py-xl-3"
                  >Nueva Venta</RouterLink
                >
                <RouterLink
                  to="/productos"
                  class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2"
                  >Ver Productos</RouterLink
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="slider-item" :style="{ backgroundImage: `url(${bg2})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center">
              <span class="subheading">Descubre</span>
              <h1 class="mb-4">Sabor y Calidad en Cada Taza</h1>
              <p class="mb-4">Gestiona tus productos, clientes y ventas de manera eficiente.</p>
              <p>
                <RouterLink to="/ventas" class="btn btn-primary p-3 px-xl-4 py-xl-3"
                  >Nueva Venta</RouterLink
                >
                <RouterLink
                  to="/clientes"
                  class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2"
                  >Ver Clientes</RouterLink
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="slider-item" :style="{ backgroundImage: `url(${bg3})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center">
              <span class="subheading">Gestiona</span>
              <h1 class="mb-4">Control Total de tu Cafetería</h1>
              <p class="mb-4">Registra ventas, administra productos y más.</p>
              <p>
                <RouterLink to="/categorias" class="btn btn-primary p-3 px-xl-4 py-xl-3"
                  >Ver Categorías</RouterLink
                >
                <RouterLink
                  to="/productos"
                  class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2"
                  >Ver Productos</RouterLink
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BARRA DE INFO -->
    <section style="background: #1a1a1a; padding: 0">
      <div style="display: flex; align-items: stretch">
        <div style="flex: 1; padding: 30px">
          <div class="row">
            <div
              class="col-md-4 d-flex align-items-center justify-content-center"
              style="color: white; padding: 20px"
            >
              <span
                class="icon-phone"
                style="color: #c49b63; font-size: 30px; margin-right: 15px"
              ></span>
              <div>
                <h3 style="color: white; font-size: 18px">+591 000 0000</h3>
                <p style="color: rgba(255, 255, 255, 0.7)">
                  Contáctenos para reservas y pedidos especiales.
                </p>
              </div>
            </div>
            <div
              class="col-md-4 d-flex align-items-center justify-content-center"
              style="color: white; padding: 20px"
            >
              <span
                class="icon-my_location"
                style="color: #c49b63; font-size: 30px; margin-right: 15px"
              ></span>
              <div>
                <h3 style="color: white; font-size: 18px">Sucre, Bolivia</h3>
                <p style="color: rgba(255, 255, 255, 0.7)">
                  Visítenos en nuestra cafetería en el centro de Sucre.
                </p>
              </div>
            </div>
            <div
              class="col-md-4 d-flex align-items-center justify-content-center"
              style="color: white; padding: 20px"
            >
              <span
                class="icon-clock-o"
                style="color: #c49b63; font-size: 30px; margin-right: 15px"
              ></span>
              <div>
                <h3 style="color: white; font-size: 18px">Lunes a Sábado</h3>
                <p style="color: rgba(255, 255, 255, 0.7)">7:00am - 8:00pm</p>
              </div>
            </div>
          </div>
        </div>
        <div style="background: #c49b63; padding: 30px; min-width: 350px">
          <h3 style="color: white">Registrar Venta</h3>
          <p style="color: white">Accede al sistema para registrar ventas rápidamente.</p>
          <RouterLink to="/ventas" class="btn btn-white btn-outline-white py-3 px-4 mt-3"
            >Nueva Venta</RouterLink
          >
          <RouterLink to="/productos" class="btn btn-white btn-outline-white py-3 px-4 mt-3 ml-2"
            >Ver Productos</RouterLink
          >
        </div>
      </div>
    </section>

    <!-- ULTIMAS VENTASL -->
    <section class="ftco-counter ftco-bg-dark img" :style="{ backgroundImage: `url(${bg1})` }">
      <div class="overlay"></div>
      <div class="container" style="position: relative; z-index: 5">
        <!-- Título -->
        <div class="row justify-content-center mb-4">
          <div class="col-md-7 text-center">
            <h2 style="color: white; font-family: 'Josefin Sans', sans-serif; letter-spacing: 2px">
              ULTIMAS VENTAS
            </h2>
            <div style="width: 60px; height: 2px; background: #c49b63; margin: 10px auto"></div>
          </div>
        </div>

        <!-- Últimas ventas -->
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div
              style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(196, 155, 99, 0.3);
                border-radius: 12px;
                padding: 25px;
                backdrop-filter: blur(5px);
              "
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 20px;
                "
              >
                <h4
                  style="
                    color: white;
                    margin: 0;
                    font-family: 'Josefin Sans', sans-serif;
                    letter-spacing: 1px;
                  "
                ></h4>
                <RouterLink
                  to="/ventas"
                  style="
                    background: #c49b63;
                    color: white;
                    padding: 6px 15px;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 13px;
                  "
                  >Ver todas</RouterLink
                >
              </div>
              <table style="width: 100%; border-collapse: collapse">
                <thead>
                  <tr style="border-bottom: 1px solid rgba(196, 155, 99, 0.5)">
                    <th
                      style="
                        padding: 10px;
                        text-align: left;
                        color: #c49b63;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      #
                    </th>
                    <th
                      style="
                        padding: 10px;
                        text-align: left;
                        color: #c49b63;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Cliente
                    </th>
                    <th
                      style="
                        padding: 10px;
                        text-align: left;
                        color: #c49b63;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Fecha
                    </th>
                    <th
                      style="
                        padding: 10px;
                        text-align: right;
                        color: #c49b63;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="venta in ultimasVentas"
                    :key="venta.id"
                    style="border-bottom: 1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <td
                      style="padding: 12px 10px; color: rgba(255, 255, 255, 0.5); font-size: 13px"
                    >
                      {{ venta.id }}
                    </td>
                    <td style="padding: 12px 10px; color: white; font-size: 13px">
                      {{ venta.cliente?.nombre || 'Sin cliente' }}
                    </td>
                    <td
                      style="padding: 12px 10px; color: rgba(255, 255, 255, 0.7); font-size: 13px"
                    >
                      {{ new Date(venta.fecha).toLocaleDateString() }}
                    </td>
                    <td
                      style="
                        padding: 12px 10px;
                        color: #c49b63;
                        font-weight: bold;
                        font-size: 14px;
                        text-align: right;
                      "
                    >
                      Bs. {{ venta.total }}
                    </td>
                  </tr>
                  <tr v-if="ultimasVentas.length === 0">
                    <td
                      colspan="4"
                      style="
                        padding: 20px;
                        text-align: center;
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 13px;
                      "
                    >
                      No hay ventas registradas aún
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TOP PRODUCTOS -->
    <section style="background: #4a2c2a; padding: 60px 0">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-md-7 text-center">
            <span style="font-family: 'Great Vibes', cursive; color: #c49b63; font-size: 2rem"
              >Destacados</span
            >
            <h2
              style="
                color: white;
                font-family: 'Josefin Sans', sans-serif;
                letter-spacing: 2px;
                text-transform: uppercase;
              "
            >
              Top Productos
            </h2>
            <div style="width: 60px; height: 2px; background: #c49b63; margin: 15px auto"></div>
            <p style="color: rgba(255, 255, 255, 0.7)">
              Los productos más destacados de nuestra cafetería.
            </p>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div
              v-for="(producto, index) in topProductos"
              :key="producto.id"
              style="
                display: flex;
                align-items: center;
                padding: 20px 25px;
                margin-bottom: 15px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(196, 155, 99, 0.3);
                border-radius: 12px;
                transition: all 0.3s;
              "
            >
              <div
                style="
                  width: 55px;
                  height: 55px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: white;
                  margin-right: 20px;
                  font-size: 20px;
                  flex-shrink: 0;
                  border: 2px solid #c49b63;
                "
                :style="{
                  background:
                    index === 0
                      ? '#c49b63'
                      : index === 1
                        ? 'rgba(196,155,99,0.3)'
                        : 'rgba(255,255,255,0.1)',
                }"
              >
                {{ index + 1 }}
              </div>
              <div style="flex: 1">
                <h5 style="margin: 0; color: white; font-weight: bold; font-size: 16px">
                  {{ producto.nombre }}
                </h5>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px">
                  {{ producto.categoria?.nombre }}
                </p>
              </div>
              <div style="text-align: right">
                <p style="margin: 0; font-weight: bold; color: #c49b63; font-size: 1.5rem">
                  Bs. {{ producto.precio }}
                </p>
                <span
                  style="
                    background: rgba(196, 155, 99, 0.2);
                    color: #c49b63;
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 11px;
                    border: 1px solid rgba(196, 155, 99, 0.4);
                  "
                  >Stock: {{ producto.stock }}</span
                >
              </div>
            </div>
            <div
              v-if="topProductos.length === 0"
              style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5)"
            >
              No hay productos registrados
            </div>
            <div class="text-center mt-4">
              <RouterLink
                to="/productos"
                style="
                  background: #c49b63;
                  color: white;
                  padding: 12px 30px;
                  border-radius: 30px;
                  text-decoration: none;
                  font-size: 14px;
                  letter-spacing: 1px;
                  text-transform: uppercase;
                "
                >Ver todos los productos</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COUNTER / PANEL DE CONTROL -->
    <section
      class="ftco-counter ftco-bg-dark img"
      :style="{ backgroundImage: `url(${bg2})` }"
      style="padding: 40px 0"
    >
      <div class="overlay"></div>
      <div class="container">
        <div class="row justify-content-center mb-4">
          <div class="col-md-7 text-center">
            <h2 style="color: white; font-family: 'Josefin Sans', sans-serif; letter-spacing: 2px">
              PANEL DE CONTROL
            </h2>
            <div style="width: 60px; height: 2px; background: #c49b63; margin: 10px auto"></div>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="row">
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-bean"></span></div>
                    <strong class="number">{{ totalCategorias }}</strong>
                    <span>Categorías</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-choices"></span></div>
                    <strong class="number">{{ totalProductos }}</strong>
                    <span>Productos</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-delivery-truck"></span></div>
                    <strong class="number">{{ totalClientes }}</strong>
                    <span>Clientes</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-cup"></span></div>
                    <strong class="number">{{ totalVentas }}</strong>
                    <span>Ventas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
