import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/categorias',
      name: 'categorias',
      component: () => import('../views/CategoriaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/productos',
      name: 'productos',
      component: () => import('../views/ProductoView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/ClienteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentaView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.name === 'login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
