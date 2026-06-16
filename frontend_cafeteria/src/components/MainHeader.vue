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
  <aside class="sidebar-nav fixed inset-y-0 flex flex-col items-start justify-start w-full p-0 my-4 overflow-hidden antialiased transition-transform duration-200 -translate-x-full bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0" aria-expanded="false">
    <div class="w-full h-19">
      <i class="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-slate-400 xl:hidden" sidenav-close></i>
      <a class="block px-4 py-4 m-0 text-sm whitespace-nowrap dark:text-white text-slate-700" href="#">
        <span class="font-semibold transition-all duration-200 ease-nav-brand">☕ El Buen Gusto</span>
      </a>
    </div>

    <hr class="w-full h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />

    <div class="block w-full overflow-hidden grow basis-full">
      <ul class="flex flex-col pl-0 mb-0">
        <li class="mt-0.5 w-full">
          <RouterLink to="/" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100">
            <i class="mr-2 w-5 text-center text-base leading-normal text-blue-500 ni ni-tv-2"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Dashboard</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.esAdmin()">
          <RouterLink to="/categorias" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100">
            <i class="mr-2 w-5 text-center text-base leading-normal text-orange-500 ni ni-bullet-list-67"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Categorías</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/productos" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100">
            <i class="mr-2 w-5 text-center text-base leading-normal text-emerald-500 ni ni-box-2"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Productos</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/clientes" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100">
            <i class="mr-2 w-5 text-center text-base leading-normal text-cyan-500 ni ni-single-02"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Clientes</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/ventas" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100">
            <i class="mr-2 w-5 text-center text-base leading-normal text-red-500 ni ni-cart"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Ventas</span>
          </RouterLink>
        </li>

        <li class="w-full mt-2">
          <h6 class="ml-5 text-xs font-bold leading-tight text-left uppercase dark:text-white opacity-60">Cuenta</h6>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.isAuthenticated()">
          <a class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors">
            <i class="mr-2 w-5 text-center text-base leading-normal text-slate-700 ni ni-single-02"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease text-slate-700 font-semibold">
              {{ authStore.usuario?.nombre }}
            </span>
          </a>
        </li>

        <li class="w-full" v-if="authStore.isAuthenticated()">
          <span
            class="ml-9 inline-block px-2 py-0.5 text-xs font-semibold rounded-full"
            :class="authStore.esAdmin() ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'"
          >
            {{ authStore.esAdmin() ? 'Administrador' : 'Cajero' }}
          </span>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.isAuthenticated()">
          <a href="#" @click.prevent="handleLogout" class="py-2 dark:text-white dark:opacity-80 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-1 transition-colors hover:bg-gray-100 cursor-pointer">
            <i class="mr-2 w-5 text-center text-base leading-normal text-red-500 ni ni-user-run"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease text-red-500">Salir</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
