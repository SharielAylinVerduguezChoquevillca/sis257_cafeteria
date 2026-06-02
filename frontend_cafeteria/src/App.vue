<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <MainHeader v-if="authStore.isAuthenticated()" />
    <div class="container mt-4">
      <RouterView />
    </div>
    <MainFooter v-if="authStore.isAuthenticated()" />
  </div>
</template>

<style scoped>
</style>