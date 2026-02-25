<script setup lang="ts">
import { MONTH_NAMES } from '~/data/constants'

const { selectedDay, closeDetail } = useDayDetail()
const { getSpecialDayColor, getCycleDayColor } = useCalendar()
const { share, copied } = useShare()

const cycleNumber = computed(() => selectedDay.value?.info?.cycleDay?.replace('D', '') ?? null)

const formattedDate = computed(() => {
  if (!selectedDay.value) return ''
  const [y, m, d] = selectedDay.value.date.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const dayStatus = computed(() => {
  if (!selectedDay.value) return ''
  if (selectedDay.value.isWeekend) return 'Fin de semana'
  if (cycleNumber.value) return `Dia ${cycleNumber.value} del ciclo rotativo`
  if (selectedDay.value.info?.label) return selectedDay.value.info.label
  return 'Sin clases programadas'
})

function handleShare() {
  const text = cycleNumber.value
    ? `${formattedDate.value} - Dia ${cycleNumber.value} del ciclo rotativo (SEK Colombia)`
    : `${formattedDate.value} - ${dayStatus.value} (SEK Colombia)`
  share(text)
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) closeDetail()
}

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDetail()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="selectedDay"
        class="fixed inset-0 z-50 flex items-end justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del dia"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 transition-opacity" />

        <!-- Sheet -->
        <div class="relative w-full max-w-md bg-white rounded-t-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.12)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <!-- Drag handle -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          <!-- Close button -->
          <button
            class="btn-icon absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label="Cerrar detalle"
            @click="closeDetail"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="px-6 pt-2 pb-4">
            <!-- Cycle Day Circle (when applicable) -->
            <div v-if="cycleNumber && !selectedDay.isWeekend" class="flex justify-center mb-4">
              <div
                class="w-20 h-20 rounded-full flex items-center justify-center"
                :class="getCycleDayColor(selectedDay.info!.cycleDay!)"
              >
                <span class="text-3xl font-bold leading-none">{{ cycleNumber }}</span>
              </div>
            </div>

            <!-- Special Day Icon (when no cycle day) -->
            <div v-else-if="selectedDay.info?.special && !selectedDay.isWeekend" class="flex justify-center mb-4">
              <div
                class="w-20 h-20 rounded-full flex items-center justify-center"
                :class="getSpecialDayColor(selectedDay.info.special)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            <!-- Date -->
            <p class="text-center text-gray-500 capitalize text-sm mb-1">
              {{ formattedDate }}
            </p>

            <!-- Status -->
            <p class="text-center text-lg font-bold text-primary mb-1">
              {{ dayStatus }}
            </p>

            <!-- Special label (when cycle day also has special) -->
            <p
              v-if="selectedDay.info?.label && cycleNumber"
              class="text-center text-sm text-gray-500"
            >
              {{ selectedDay.info.label }}
            </p>

            <!-- Today badge -->
            <div v-if="selectedDay.isToday" class="flex justify-center mt-3">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary" />
                Hoy
              </span>
            </div>

            <!-- Share button -->
            <div class="mt-5 flex justify-center">
              <button
                class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
                @click="handleShare"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {{ copied ? 'Copiado!' : 'Compartir' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
