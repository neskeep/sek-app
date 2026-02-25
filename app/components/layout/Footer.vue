<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-100">
    <div class="container-app py-6">
      <p class="text-center text-gray-400 text-xs font-medium tracking-wide">
        &copy; {{ currentYear }} SEK Colombia. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>
