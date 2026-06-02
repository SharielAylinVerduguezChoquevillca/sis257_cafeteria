<script setup lang="ts"></script>

<template>
  <div>
    <nav class="p-3 mb-3" style="background-color: #4a2c2a">
      <RouterLink to="/" class="text-white mr-4 no-underline font-bold">Inicio</RouterLink>
      <RouterLink to="/categorias" class="text-white mr-4 no-underline font-bold"
        >Categorías</RouterLink
      >
      <RouterLink to="/productos" class="text-white mr-4 no-underline font-bold"
        >Productos</RouterLink
      >
      <RouterLink to="/clientes" class="text-white mr-4 no-underline font-bold"
        >Clientes</RouterLink
      >
      <RouterLink to="/ventas" class="text-white mr-4 no-underline font-bold">Ventas</RouterLink>
    </nav>
    <div class="container px-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
