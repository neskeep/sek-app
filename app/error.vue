<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center max-w-sm">
      <p class="text-6xl font-bold text-primary mb-4">
        {{ error.statusCode }}
      </p>
      <p class="text-lg text-gray-600 mb-8">
        {{ error.statusCode === 404 ? 'Pagina no encontrada' : 'Algo salio mal' }}
      </p>
      <button
        class="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        @click="handleClear"
      >
        Volver al inicio
      </button>
    </div>
  </div>
</template>
