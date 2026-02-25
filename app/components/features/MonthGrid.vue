<script setup lang="ts">
const {
  viewMonthName,
  viewYear,
  viewMonth,
  monthGrid,
  currentDate,
  nextMonth,
  prevMonth,
  goToToday,
  canGoNext,
  canGoPrev,
} = useCalendar()

const weekdayHeaders = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

const isViewingCurrentMonth = computed(() => {
  return (
    viewMonth.value === currentDate.value.getMonth() &&
    viewYear.value === currentDate.value.getFullYear()
  )
})

const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <section class="py-6 md:py-10">
    <div class="container-app max-w-2xl">
      <!-- Navigation Header -->
      <div class="flex items-center justify-between mb-6 md:mb-8">
        <button
          class="btn-icon text-gray-500 hover:text-primary"
          :class="{ 'opacity-30 cursor-not-allowed hover:bg-transparent': !canGoPrev }"
          :disabled="!canGoPrev"
          aria-label="Mes anterior"
          @click="prevMonth"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex flex-col items-center">
          <h2 class="month-nav-title text-primary">
            {{ viewMonthName }}
          </h2>
          <span class="text-sm text-gray-400 font-medium tracking-wide">
            {{ viewYear }}
          </span>
        </div>

        <button
          class="btn-icon text-gray-500 hover:text-primary"
          :class="{ 'opacity-30 cursor-not-allowed hover:bg-transparent': !canGoNext }"
          :disabled="!canGoNext"
          aria-label="Mes siguiente"
          @click="nextMonth"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Today button -->
      <div
        v-if="!isViewingCurrentMonth"
        class="flex justify-center mb-4"
      >
        <button
          class="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors flex items-center gap-1.5"
          aria-label="Ir a hoy"
          @click="goToToday"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ir a hoy
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in weekdayHeaders"
          :key="day"
          class="text-center text-[11px] font-semibold uppercase tracking-widest text-gray-400 py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div
        class="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
        :class="mounted ? 'animate-fade-up' : 'opacity-0'"
        role="grid"
      >
        <div
          v-for="(week, weekIndex) in monthGrid"
          :key="weekIndex"
          class="grid grid-cols-7"
          :class="weekIndex > 0 ? 'border-t border-gray-50' : ''"
          role="row"
        >
          <FeaturesDayCell
            v-for="entry in week"
            :key="entry.date"
            :entry="entry"
          />
        </div>
      </div>
    </div>
  </section>
</template>
