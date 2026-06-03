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
  <div style="min-height: 100vh; background-image: url('/src/assets/images/bg_1.jpg'); background-size: cover; background-position: center; display: flex; align-items: center; justify-content: center;">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6);"></div>
    <div style="position: relative; z-index: 10; width: 100%; max-width: 450px; padding: 20px;">
      <div style="background: rgba(255,255,255,0.95); border-radius: 12px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-family: 'Great Vibes', cursive; color: #c49b63; font-size: 2.5rem; margin-bottom: 5px;">El Buen Gusto</h2>
          <p style="color: #666; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Sistema de Gestión</p>
          <hr style="border-color: #c49b63; width: 60px; margin: 15px auto;">
        </div>

        <div style="margin-bottom: 20px;">
          <label style="display: block; color: #4a2c2a; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Correo Electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; outline: none; transition: border 0.3s; box-sizing: border-box;"
            @focus="($event.target as HTMLInputElement).style.borderColor = '#c49b63'"
            @blur="($event.target as HTMLInputElement).style.borderColor = '#e0e0e0'"
          />
        </div>

        <div style="margin-bottom: 25px;">
          <label style="display: block; color: #4a2c2a; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            style="width: 100%; padding: 12px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; outline: none; transition: border 0.3s; box-sizing: border-box;"
            @focus="($event.target as HTMLInputElement).style.borderColor = '#c49b63'"
            @blur="($event.target as HTMLInputElement).style.borderColor = '#e0e0e0'"
            @keyup.enter="handleLogin"
          />
        </div>

        <div v-if="error" style="background: #fff0f0; border: 1px solid #ffcccc; color: #cc0000; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
          {{ error }}
        </div>

        <button
          @click="handleLogin"
          style="width: 100%; padding: 14px; background: #4a2c2a; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; letter-spacing: 1px; text-transform: uppercase; transition: background 0.3s;"
          @mouseover="($event.target as HTMLButtonElement).style.background = '#c49b63'"
          @mouseleave="($event.target as HTMLButtonElement).style.background = '#4a2c2a'"
        >
          Ingresar
        </button>

      </div>
    </div>
  </div>
</template>