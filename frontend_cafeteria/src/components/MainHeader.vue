<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
    id="ftco-navbar"
  >
    <div class="container">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="/src/assets/images/logo.png" alt="El Buen Gusto" style="height: 40px; margin-right: 10px;" />
        <span>El Buen<small>Gusto</small></span>
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav">
        <span class="oi oi-menu"></span> Menu
      </button>
      <div class="collapse navbar-collapse" id="ftco-nav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/categorias" class="nav-link">Categorías</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/productos" class="nav-link">Productos</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/clientes" class="nav-link">Clientes</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/ventas" class="nav-link">Ventas</RouterLink>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated()">
            <a class="nav-link text-warning">{{ authStore.usuario?.nombre }}</a>
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticated()">
            <a class="nav-link" href="#" @click.prevent="handleLogout">Salir</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
