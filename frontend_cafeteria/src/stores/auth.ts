import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '../plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const usuario = ref<any>(JSON.parse(localStorage.getItem('usuario') || 'null'))

  async function login(email: string, password: string) {
    const response = await axios.post('/auth/login', { email, password })
    token.value = response.data.access_token
    usuario.value = response.data.usuario
    localStorage.setItem('token', token.value!)
    localStorage.setItem('usuario', JSON.stringify(usuario.value))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    delete axios.defaults.headers.common['Authorization']
  }

  function isAuthenticated() {
    return !!token.value
  }

  return { token, usuario, login, logout, isAuthenticated }
})