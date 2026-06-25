<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  try {
    error.value = ''
    loading.value = true
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'Credenciales inválidas. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-overlay"></div>

    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">
            <img src="/src/assets/img/logo.1.png" alt="Logo El Buen Gusto" class="logo-img" />
          </div>
          <h1 class="brand">El Buen Gusto</h1>
          <p class="subtitle">Sistema de gestión</p>
          <span class="divider"></span>
        </div>

        <label class="field-label">Correo electrónico</label>
        <div class="input-group">
          <svg
            class="input-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A98A66"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <input
            v-model="email"
            type="email"
            placeholder="correo@ejemplo.com"
            class="login-input"
            @keyup.enter="handleLogin"
          />
        </div>

        <label class="field-label">Contraseña</label>
        <div class="input-group">
          <svg
            class="input-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A98A66"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="login-input"
            @keyup.enter="handleLogin"
          />
        </div>

        <div v-if="error" class="error-box">
          {{ error }}
        </div>

        <button class="login-btn" :disabled="loading" @click="handleLogin">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

.login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #2a1a12;
  background-image: url('/src/assets/img/fondo.jpg');
  background-size: cover;
  background-position: center;
}

.login-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(36, 20, 16, 0.82), rgba(74, 44, 42, 0.55));
}

.login-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 410px;
}

.login-card {
  background: #fbf6ef;
  border-radius: 16px;
  padding: 38px 34px;
  border: 1px solid rgba(196, 155, 99, 0.35);
  box-shadow: 0 24px 100px rgba(0, 0, 0, 0.45);
}

.login-header {
  text-align: center;
  margin-bottom: 26px;
}

.login-logo {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand {
  font-family: 'Great Vibes', cursive;
  color: #b0832b;
  font-size: 2.4rem;
  line-height: 1;
  margin: 0;
  font-weight: 400;
}

.subtitle {
  color: #a98a66;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 8px 0 0;
}

.divider {
  display: block;
  height: 2px;
  width: 54px;
  background: #c49b63;
  margin: 14px auto 0;
  border-radius: 2px;
}

.field-label {
  display: block;
  color: #4a2c2a;
  font-weight: 600;
  margin-bottom: 7px;
  font-size: 13px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1.5px solid #e8dcc8;
  border-radius: 9px;
  padding: 11px 13px;
  margin-bottom: 18px;
  transition: border-color 0.25s;
}

.input-group:focus-within {
  border-color: #c49b63;
}

.input-icon {
  flex-shrink: 0;
}

.login-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #4a2c2a;
}

.login-input::placeholder {
  color: #b5a48e;
}

.error-box {
  background: #fbeaea;
  border: 1px solid #e8c4c4;
  color: #a32d2d;
  padding: 10px 14px;
  border-radius: 8px;
  margin: 4px 0 18px;
  font-size: 13px;
  text-align: center;
}

.login-btn {
  width: 100%;
  padding: 13px;
  background: #4a2c2a;
  color: #f3e5d5;
  border: none;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.1s;
}

.login-btn:hover:not(:disabled) {
  background: #6f4e37;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
