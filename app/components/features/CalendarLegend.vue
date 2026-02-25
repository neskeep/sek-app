<script setup lang="ts">
const legendItems = [
  { label: 'Dia de ciclo', colorClass: 'bg-primary' },
  { label: 'Festivo', colorClass: 'bg-festivo' },
  { label: 'Receso', colorClass: 'bg-receso' },
  { label: 'Semana Santa', colorClass: 'bg-semana-santa' },
  { label: 'Vacaciones', colorClass: 'bg-vacaciones' },
  { label: 'Clausura', colorClass: 'bg-clausura' },
  { label: 'Celebracion', colorClass: 'bg-celebracion' },
]
</script>

<template>
  <section class="py-6 md:py-8">
    <div class="container-app max-w-2xl">
      <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="flex items-center gap-1.5"
        >
          <span
            class="w-2.5 h-2.5 rounded-full shrink-0"
            :class="item.colorClass"
          />
          <span class="text-xs text-gray-400 font-medium">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
