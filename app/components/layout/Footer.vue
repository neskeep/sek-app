<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-100">
    <div class="container-app py-8">
      <p class="text-center text-gray-500 text-sm">
        &copy; {{ currentYear }} SEK Colombia. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>
