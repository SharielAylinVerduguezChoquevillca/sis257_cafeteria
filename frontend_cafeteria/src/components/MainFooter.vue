<template>
  <footer class="ftco-footer ftco-section img">
    <div class="overlay"></div>
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-3 col-md-6 mb-5 mb-md-5">
          <div class="ftco-footer-widget mb-4">
            <img src="/src/assets/images/logo.png" alt="El Buen Gusto" style="height: 60px; margin-bottom: 15px;" />
            <h2 class="ftco-heading-2">El Buen Gusto</h2>
            <p>
              Sistema de gestión para la cafetería El Buen Gusto. Administra productos, clientes y
              ventas de manera eficiente.
            </p>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-5 mb-md-5">
          <div class="ftco-footer-widget mb-4">
            <h2 class="ftco-heading-2">Navegación</h2>
            <ul class="list-unstyled">
              <li><RouterLink to="/" class="py-2 d-block">Inicio</RouterLink></li>
              <li><RouterLink to="/categorias" class="py-2 d-block">Categorías</RouterLink></li>
              <li><RouterLink to="/productos" class="py-2 d-block">Productos</RouterLink></li>
              <li><RouterLink to="/clientes" class="py-2 d-block">Clientes</RouterLink></li>
              <li><RouterLink to="/ventas" class="py-2 d-block">Ventas</RouterLink></li>
            </ul>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-5 mb-md-5">
          <div class="ftco-footer-widget mb-4">
            <h2 class="ftco-heading-2">Nuestra Información</h2>
            <div class="block-23 mb-3">
              <ul>
                <li>
                  <span class="icon icon-map-marker"></span><span class="text">Sucre, Bolivia</span>
                </li>
                <li>
                  <a href="#"
                    ><span class="icon icon-phone"></span><span class="text">+591 60300843</span>
                    <span class="icon icon-phone"></span><span class="text">+591 74401433</span></a
                  >
                </li>
                <li>
                  <a href="#"
                    ><span class="icon icon-envelope"></span
                    ><span class="text">cafeteria@elbuengusto.com</span></a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 text-center">
          <p>
            Copyright &copy; 2026 Cafetería El Buen Gusto | Desarrollado por Shariel Verduguez &
            Vanessa Villarroel
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
