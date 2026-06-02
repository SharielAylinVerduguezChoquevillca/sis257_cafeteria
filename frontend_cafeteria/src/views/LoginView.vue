<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  try {
    error.value = ''
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Credenciales inválidas. Intente nuevamente.'
  }
}
</script>

<template>
  <div class="flex justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="p-dialog" style="width: 400px; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
      <h2 class="text-center mb-4" style="color: #4a2c2a;">☕ El Buen Gusto</h2>
      <h4 class="text-center mb-4">Iniciar Sesión</h4>
      <div class="p-field mb-3">
        <label>Email</label>
        <input
          v-model="email"
          type="email"
          class="p-inputtext w-full"
          placeholder="correo@ejemplo.com"
        />
      </div>
      <div class="p-field mb-3">
        <label>Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="p-inputtext w-full"
          placeholder="••••••"
        />
      </div>
      <div v-if="error" class="text-red-500 mb-3">{{ error }}</div>
      <button class="p-button p-button-success w-full" @click="handleLogin">
        Ingresar
      </button>
    </div>
  </div>
</template>