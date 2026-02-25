<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      Ir al contenido principal
    </a>
    <LayoutHeader />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
