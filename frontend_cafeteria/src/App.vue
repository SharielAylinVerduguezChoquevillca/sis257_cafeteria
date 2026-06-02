<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <nav v-if="authStore.isAuthenticated()" class="p-3 mb-3" style="background-color: #4a2c2a;">
      <RouterLink to="/" class="text-white mr-4 no-underline font-bold">Inicio</RouterLink>
      <RouterLink to="/categorias" class="text-white mr-4 no-underline font-bold">Categorías</RouterLink>
      <RouterLink to="/productos" class="text-white mr-4 no-underline font-bold">Productos</RouterLink>
      <RouterLink to="/clientes" class="text-white mr-4 no-underline font-bold">Clientes</RouterLink>
      <RouterLink to="/ventas" class="text-white mr-4 no-underline font-bold">Ventas</RouterLink>
      <span class="text-white mr-4 float-right">{{ authStore.usuario?.nombre }}</span>
      <button class="p-button p-button-danger p-button-sm float-right" @click="handleLogout">
        Salir
      </button>
    </nav>
    <div class="container px-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>
