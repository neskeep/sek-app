<script setup lang="ts">
const { todayCycleDay, todayInfo, currentDate, isSchoolDay } = useCalendar()
const { share, copied } = useShare()

const cycleNumber = computed(() => todayCycleDay.value?.replace('D', '') ?? null)

const isWeekend = computed(() => {
  const day = currentDate.value.getDay()
  return day === 0 || day === 6
})

const formattedDate = computed(() => {
  return currentDate.value.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const specialLabel = computed(() => todayInfo.value?.label ?? null)
const specialType = computed(() => todayInfo.value?.special ?? null)

const shareText = computed(() => {
  if (cycleNumber.value && isSchoolDay.value) {
    return `Hoy es dia ${cycleNumber.value} del ciclo rotativo - ${formattedDate.value} (SEK Colombia)`
  }
  if (specialLabel.value) {
    return `${specialLabel.value} - ${formattedDate.value} (SEK Colombia)`
  }
  return `${formattedDate.value} - No hay clases hoy (SEK Colombia)`
})

function handleShare() {
  share(shareText.value)
}

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <section class="relative overflow-hidden py-12 md:py-16 lg:py-20">
    <!-- Subtle background pattern -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.04]" />
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="background-image: radial-gradient(circle at 1px 1px, #263060 1px, transparent 0); background-size: 32px 32px;"
    />

    <div class="container-app relative">
      <div class="flex flex-col items-center text-center">
        <!-- Hero Circle -->
        <div
          class="hero-circle w-40 h-40 md:w-52 md:h-52 mb-6 md:mb-8"
          :class="mounted ? 'animate-hero-enter' : 'opacity-0'"
          role="img"
          aria-label="Dia actual del ciclo"
        >
          <div v-if="cycleNumber && isSchoolDay" class="flex flex-col items-center">
            <span class="text-6xl md:text-7xl font-bold text-white leading-none tracking-tight">
              {{ cycleNumber }}
            </span>
            <span class="text-white/60 text-sm md:text-base font-medium uppercase tracking-widest mt-1">
              Dia
            </span>
          </div>
          <div v-else class="flex flex-col items-center px-4">
            <span class="text-white/80 text-base md:text-lg font-medium text-center leading-snug">
              No hay clases hoy
            </span>
          </div>
        </div>

        <!-- Date -->
        <p
          class="font-display text-lg md:text-xl text-gray-500 capitalize mb-3"
          :class="mounted ? 'animate-fade-up' : 'opacity-0'"
          style="animation-delay: 0.15s;"
        >
          {{ formattedDate }}
        </p>

        <!-- Cycle Day Label -->
        <p
          v-if="cycleNumber && isSchoolDay"
          class="text-primary font-semibold text-base md:text-lg tracking-wide"
          :class="mounted ? 'animate-fade-up' : 'opacity-0'"
          style="animation-delay: 0.25s;"
        >
          Dia {{ cycleNumber }} del ciclo rotativo
        </p>

        <!-- Special Day Badge -->
        <div
          v-if="specialType && specialLabel"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          :class="[
            mounted ? 'animate-fade-up' : 'opacity-0',
            specialType === 'festivo' ? 'bg-festivo/10 border-festivo/20 text-festivo' : '',
            specialType === 'receso' ? 'bg-receso/10 border-receso/20 text-receso' : '',
            specialType === 'semana-santa' ? 'bg-semana-santa/10 border-semana-santa/20 text-semana-santa' : '',
            specialType === 'vacaciones' ? 'bg-vacaciones/10 border-vacaciones/20 text-vacaciones' : '',
            specialType === 'clausura' ? 'bg-clausura/10 border-clausura/20 text-clausura' : '',
            specialType === 'celebracion' ? 'bg-celebracion/10 border-celebracion/20 text-celebracion' : '',
          ]"
          style="animation-delay: 0.35s;"
        >
          <span class="text-sm font-semibold">{{ specialLabel }}</span>
        </div>

        <!-- Weekend / No school message -->
        <p
          v-if="isWeekend && !specialType"
          class="mt-4 text-gray-400 text-sm italic"
          :class="mounted ? 'animate-fade-up' : 'opacity-0'"
          style="animation-delay: 0.3s;"
        >
          Fin de semana
        </p>

        <!-- Share button -->
        <button
          class="mt-5 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary bg-white/80 hover:bg-white rounded-full border border-gray-200 transition-all active:scale-[0.97]"
          :class="mounted ? 'animate-fade-up' : 'opacity-0'"
          style="animation-delay: 0.4s;"
          @click="handleShare"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {{ copied ? 'Copiado!' : 'Compartir' }}
        </button>
      </div>
    </div>
  </section>
</template>
