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
  <aside
    class="sidebar-nav fixed inset-y-0 flex flex-col items-start justify-start w-full p-0 my-4 overflow-hidden antialiased transition-transform duration-200 -translate-x-full border-0 shadow-xl max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0"
    style="background-color: #3a2419"
    aria-expanded="false"
  >
    <div class="w-full h-19">
      <i
        class="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times xl:hidden"
        style="color: #e8dcc8"
        sidenav-close
      ></i>
      <a class="block px-4 py-4 m-0 text-sm whitespace-nowrap" href="#" style="color: #f3e5d5">
        <span class="font-semibold transition-all duration-200 ease-nav-brand">El Buen Gusto</span>
      </a>
    </div>

    <hr class="sidebar-divider" />

    <div class="block w-full overflow-hidden grow basis-full">
      <ul class="flex flex-col pl-0 mb-0">
        <li class="mt-0.5 w-full">
          <RouterLink to="/" class="nav-link">
            <i class="nav-icon ni ni-tv-2"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Dashboard</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.esAdmin()">
          <RouterLink to="/categorias" class="nav-link">
            <i class="nav-icon ni ni-bullet-list-67"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Categorías</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/productos" class="nav-link">
            <i class="nav-icon ni ni-box-2"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Productos</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/clientes" class="nav-link">
            <i class="nav-icon ni ni-single-02"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Clientes</span>
          </RouterLink>
        </li>

        <li class="mt-0.5 w-full">
          <RouterLink to="/ventas" class="nav-link">
            <i class="nav-icon ni ni-cart"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Ventas</span>
          </RouterLink>
        </li>


        <li class="w-full mt-4 mb-1">
          <h6 class="sidebar-section">Cuenta</h6>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.isAuthenticated()">
          <a class="nav-link nav-link--static">
            <i class="nav-icon ni ni-single-02"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease font-semibold">
              {{ authStore.usuario?.nombre }}
            </span>
          </a>
        </li>

        <li class="w-full" v-if="authStore.isAuthenticated()">
          <span class="role-badge" :class="authStore.esAdmin() ? 'role-admin' : 'role-cajero'">
            {{ authStore.esAdmin() ? 'Administrador' : 'Cajero' }}
          </span>
        </li>

        <li class="mt-0.5 w-full" v-if="authStore.isAuthenticated()">
          <a href="#" @click.prevent="handleLogout" class="nav-link nav-link--logout">
            <i class="nav-icon nav-icon--logout ni ni-user-run"></i>
            <span class="duration-300 opacity-100 pointer-events-none ease">Salir</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-divider {
  width: 100%;
  height: 1px;
  margin: 0 0 6px;
  border: 0;
  background: linear-gradient(to right, transparent, rgba(196, 155, 99, 0.5), transparent);
}

.sidebar-section {
  margin-left: 1.25rem;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #b08d6a;
}

.nav-link {
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin: 2px 8px;
  padding: 9px 10px;
  border-radius: 10px;
  font-size: 14px;
  color: #e8dcc8;
  transition:
    background 0.2s,
    color 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
}

.nav-link.router-link-exact-active {
  background: #6f4e37;
  color: #fff;
}

.nav-link.router-link-exact-active .nav-icon {
  color: #f3e5d5;
}

.nav-link--static {
  cursor: default;
}

.nav-link--static:hover {
  background: transparent;
  color: #e8dcc8;
}

.nav-icon {
  width: 20px;
  margin-right: 8px;
  text-align: center;
  font-size: 16px;
  line-height: normal;
  color: #c49b63;
}

.nav-link--logout {
  color: #e2a08a;
}

.nav-link--logout:hover {
  background: rgba(216, 90, 48, 0.15);
  color: #f0b6a0;
}

.nav-icon--logout {
  color: #d85a30;
}

.role-badge {
  display: inline-block;
  margin-left: 2.25rem;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
}

.role-admin {
  background: rgba(196, 155, 99, 0.25);
  color: #e8c89a;
}

.role-cajero {
  background: rgba(157, 225, 203, 0.2);
  color: #a9e1cb;
}
</style>
