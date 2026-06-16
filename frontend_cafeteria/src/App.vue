<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <MainHeader v-if="authStore.isAuthenticated()" />
    <main v-if="authStore.isAuthenticated()" class="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl">
      <div class="min-h-screen bg-gray-50">
        <RouterView />
        <MainFooter />
      </div>
    </main>
    <RouterView v-else />
  </div>
</template>