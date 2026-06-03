<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const authStore = useAuthStore()
</script>

<template>
  <div style="width: 100%; overflow-x: hidden;">
    <MainHeader v-if="authStore.isAuthenticated()" />
    <RouterView />
    <MainFooter v-if="authStore.isAuthenticated()" />
  </div>
</template>

<style scoped>
</style>