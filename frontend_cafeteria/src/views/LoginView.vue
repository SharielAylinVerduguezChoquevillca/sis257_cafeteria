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

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #0a0807 0%, #1a1512 100%);
}

.login-box {
  background: #1a1512;
  border: 1px solid rgba(196, 155, 99, 0.3);
  width: 100%;
  max-width: 420px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.login-header {
  padding: 40px 30px 20px;
  text-align: center;
  position: relative;
}

.subheading {
  font-family: 'Great Vibes', cursive;
  font-size: 28px;
  color: #c49b63;
  display: block;
  line-height: 1;
  margin-bottom: 5px;
}

.login-header h2 {
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 28px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #fff;
  margin: 10px 0 5px;
  font-weight: 700;
}

.coffee-icon {
  font-size: 40px;
  margin-top: 10px;
  animation: steam 2s ease-in-out infinite;
}

@keyframes steam {
  0%,
  100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-5px);
    opacity: 0.8;
  }
}

.gold-divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #c49b63, transparent);
  margin: 0 30px;
}

.login-body {
  padding: 30px;
}

.login-title {
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #c49b63;
  margin: 0 0 25px 0;
  font-weight: 600;
  text-align: center;
}

.field-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
  font-family: 'Work Sans', sans-serif;
}

.form-control {
  border: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
  height: 48px !important;
  padding-left: 0;
  background: transparent !important;
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 14px;
  border-radius: 0;
  box-shadow: none !important;
  transition: border-color 0.3s;
  width: 100%;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-control:focus,
.form-control:active {
  border-bottom-color: #c49b63 !important;
  outline: none;
}

.error-msg {
  background: rgba(220, 53, 69, 0.12);
  border-left: 3px solid #dc3545;
  color: #f5a0a8;
  font-size: 13px;
  padding: 10px 12px;
  text-align: center;
}

.btn-login {
  width: 100%;
  background: #c49b63;
  border: 1px solid #c49b63;
  color: #000;
  font-family: 'Josefin Sans', Arial, sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-radius: 0;
  height: 48px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-weight: 600;
}

.btn-login:hover {
  background: transparent;
  color: #c49b63;
}

.btn-login:active {
  transform: scale(0.98);
}
</style>
