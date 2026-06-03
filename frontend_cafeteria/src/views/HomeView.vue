<template>
  <div>
    <section class="home-slider owl-carousel">
      <div class="slider-item" :style="{ backgroundImage: `url(${bg1})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center ftco-animate">
              <span class="subheading">Bienvenido</span>
              <h1 class="mb-4">☕ Cafetería El Buen Gusto</h1>
              <p class="mb-4">Sistema de gestión de ventas para la cafetería El Buen Gusto de Sucre, Bolivia.</p>
              <p>
                <RouterLink to="/ventas" class="btn btn-primary p-3 px-xl-4 py-xl-3">Nueva Venta</RouterLink>
                <RouterLink to="/productos" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2">Ver Productos</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-item" :style="{ backgroundImage: `url(${bg2})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center ftco-animate">
              <span class="subheading">Descubre</span>
              <h1 class="mb-4">Sabor y Calidad en Cada Taza</h1>
              <p class="mb-4">Gestiona tus productos, clientes y ventas de manera eficiente.</p>
              <p>
                <RouterLink to="/ventas" class="btn btn-primary p-3 px-xl-4 py-xl-3">Nueva Venta</RouterLink>
                <RouterLink to="/clientes" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2">Ver Clientes</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-item" :style="{ backgroundImage: `url(${bg3})` }">
        <div class="overlay"></div>
        <div class="container">
          <div class="row slider-text justify-content-center align-items-center">
            <div class="col-md-8 col-sm-12 text-center ftco-animate">
              <span class="subheading">Gestiona</span>
              <h1 class="mb-4">Control Total de tu Cafetería</h1>
              <p class="mb-4">Registra ventas, administra productos y más.</p>
              <p>
                <RouterLink to="/categorias" class="btn btn-primary p-3 px-xl-4 py-xl-3">Ver Categorías</RouterLink>
                <RouterLink to="/productos" class="btn btn-white btn-outline-white p-3 px-xl-4 py-xl-3 ml-2">Ver Productos</RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ftco-intro">
      <div class="container-wrap">
        <div class="wrap d-md-flex align-items-xl-end">
          <div class="info">
            <div class="row no-gutters">
              <div class="col-md-4 d-flex ftco-animate">
                <div class="icon"><span class="icon-phone"></span></div>
                <div class="text">
                  <h3>+591 000 0000</h3>
                  <p>Contáctenos para reservas y pedidos especiales.</p>
                </div>
              </div>
              <div class="col-md-4 d-flex ftco-animate">
                <div class="icon"><span class="icon-my_location"></span></div>
                <div class="text">
                  <h3>Sucre, Bolivia</h3>
                  <p>Visítenos en nuestra cafetería en el centro de Sucre.</p>
                </div>
              </div>
              <div class="col-md-4 d-flex ftco-animate">
                <div class="icon"><span class="icon-clock-o"></span></div>
                <div class="text">
                  <h3>Lunes a Sábado</h3>
                  <p>7:00am - 8:00pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ftco-section ftco-services">
      <div class="container">
        <div class="row justify-content-center mb-5">
          <div class="col-md-7 heading-section text-center ftco-animate">
            <span class="subheading">Nuestros</span>
            <h2 class="mb-4">Módulos del Sistema</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 ftco-animate">
            <div class="media d-block text-center block-6 services">
              <div class="icon d-flex justify-content-center align-items-center mb-5">
                <span class="flaticon-coffee-bean"></span>
              </div>
              <div class="media-body">
                <h3 class="heading">Categorías</h3>
                <p>Gestiona las categorías de productos de la cafetería.</p>
                <RouterLink to="/categorias" class="btn btn-primary btn-sm mt-2">Gestionar</RouterLink>
              </div>
            </div>
          </div>
          <div class="col-md-3 ftco-animate">
            <div class="media d-block text-center block-6 services">
              <div class="icon d-flex justify-content-center align-items-center mb-5">
                <span class="flaticon-choices"></span>
              </div>
              <div class="media-body">
                <h3 class="heading">Productos</h3>
                <p>Administra el catálogo de productos y precios.</p>
                <RouterLink to="/productos" class="btn btn-primary btn-sm mt-2">Gestionar</RouterLink>
              </div>
            </div>
          </div>
          <div class="col-md-3 ftco-animate">
            <div class="media d-block text-center block-6 services">
              <div class="icon d-flex justify-content-center align-items-center mb-5">
                <span class="flaticon-delivery-truck"></span>
              </div>
              <div class="media-body">
                <h3 class="heading">Clientes</h3>
                <p>Gestiona los clientes registrados en el sistema.</p>
                <RouterLink to="/clientes" class="btn btn-primary btn-sm mt-2">Gestionar</RouterLink>
              </div>
            </div>
          </div>
          <div class="col-md-3 ftco-animate">
            <div class="media d-block text-center block-6 services">
              <div class="icon d-flex justify-content-center align-items-center mb-5">
                <span class="flaticon-coffee-cup"></span>
              </div>
              <div class="media-body">
                <h3 class="heading">Ventas</h3>
                <p>Registra y consulta las ventas realizadas.</p>
                <RouterLink to="/ventas" class="btn btn-primary btn-sm mt-2">Gestionar</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ftco-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 pr-md-5">
            <div class="heading-section text-md-right ftco-animate">
              <span class="subheading">Descubre</span>
              <h2 class="mb-4">Nuestro Menú</h2>
              <p class="mb-4">Ofrecemos una variedad de bebidas calientes, postres y platos del día preparados con los mejores ingredientes.</p>
              <RouterLink to="/productos" class="btn btn-primary btn-outline-primary px-4 py-3">Ver Productos</RouterLink>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-6">
                <div class="menu-entry">
                  <a href="#" class="img" :style="{ backgroundImage: `url(${menu1})` }"></a>
                </div>
              </div>
              <div class="col-md-6">
                <div class="menu-entry mt-lg-4">
                  <a href="#" class="img" :style="{ backgroundImage: `url(${menu2})` }"></a>
                </div>
              </div>
              <div class="col-md-6">
                <div class="menu-entry">
                  <a href="#" class="img" :style="{ backgroundImage: `url(${menu3})` }"></a>
                </div>
              </div>
              <div class="col-md-6">
                <div class="menu-entry mt-lg-4">
                  <a href="#" class="img" :style="{ backgroundImage: `url(${menu4})` }"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="ftco-counter ftco-bg-dark img" :style="{ backgroundImage: `url(${bg2})` }">
      <div class="overlay"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-10">
            <div class="row">
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-cup"></span></div>
                    <strong class="number" data-number="50">0</strong>
                    <span>Productos</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-cup"></span></div>
                    <strong class="number" data-number="100">0</strong>
                    <span>Clientes</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-cup"></span></div>
                    <strong class="number" data-number="500">0</strong>
                    <span>Ventas</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-lg-3 d-flex justify-content-center counter-wrap ftco-animate">
                <div class="block-18 text-center">
                  <div class="text">
                    <div class="icon"><span class="flaticon-coffee-cup"></span></div>
                    <strong class="number" data-number="5">0</strong>
                    <span>Categorías</span>
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

<script setup lang="ts">
import { onMounted } from 'vue'
import bg1 from '@/assets/images/bg_1.jpg'
import bg2 from '@/assets/images/bg_2.jpg'
import bg3 from '@/assets/images/bg_3.jpg'
import menu1 from '@/assets/images/menu-1.jpg'
import menu2 from '@/assets/images/menu-2.jpg'
import menu3 from '@/assets/images/menu-3.jpg'
import menu4 from '@/assets/images/menu-4.jpg'

onMounted(() => {
  setTimeout(() => {
    const $ = (window as any).$
    if ($ && $.fn.owlCarousel) {
      $('.home-slider').owlCarousel({
        loop: true,
        autoplay: true,
        margin: 0,
        animateOut: 'fadeOut',
        nav: false,
        autoplayHoverPause: false,
        items: 1,
        navText: ['', ''],
        responsive: {
          0: { items: 1 },
          600: { items: 1 },
          1000: { items: 1 }
        }
      })
    }
  }, 500)
})
</script>