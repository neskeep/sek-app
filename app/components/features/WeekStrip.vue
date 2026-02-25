<script setup lang="ts">
import type { CalendarDayEntry } from '~~/types/calendar'
import { WEEKDAY_SHORT } from '~/data/constants'

const { currentWeek, getCycleDayColor } = useCalendar()

function cycleBadgeNumber(entry: CalendarDayEntry): string | null {
  return entry.info?.cycleDay?.replace('D', '') ?? null
}
</script>

<template>
  <section class="py-4 md:py-6" role="region" aria-label="Semana actual">
    <div class="container-app">
      <h2 class="sr-only">Semana actual</h2>
      <div class="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        <div
          v-for="(entry, i) in currentWeek"
          :key="entry.date"
          class="flex-1 min-w-[60px] flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200"
          :class="[
            entry.isToday
              ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
            entry.info?.special
              ? 'ring-1 ring-inset'
              : '',
            entry.info?.special === 'festivo' ? 'ring-festivo/30' : '',
            entry.info?.special === 'receso' ? 'ring-receso/30' : '',
            entry.info?.special === 'semana-santa' ? 'ring-semana-santa/30' : '',
            entry.info?.special === 'vacaciones' ? 'ring-vacaciones/30' : '',
            entry.info?.special === 'clausura' ? 'ring-clausura/30' : '',
            entry.info?.special === 'celebracion' ? 'ring-celebracion/30' : '',
          ]"
        >
          <!-- Day name -->
          <span
            class="text-[11px] font-semibold uppercase tracking-wider"
            :class="entry.isToday ? 'text-white/70' : 'text-gray-400'"
          >
            {{ WEEKDAY_SHORT[i] }}
          </span>

          <!-- Day number -->
          <span
            class="text-xl md:text-2xl font-bold leading-none"
            :class="entry.isToday ? 'text-white' : 'text-gray-800'"
          >
            {{ entry.dayOfMonth }}
          </span>

          <!-- Cycle badge -->
          <span
            v-if="cycleBadgeNumber(entry)"
            class="cycle-badge mt-0.5"
            :class="entry.isToday ? 'bg-white/20 text-white' : getCycleDayColor(entry.info!.cycleDay!)"
          >
            {{ cycleBadgeNumber(entry) }}
          </span>

          <!-- Special indicator dot -->
          <span
            v-else-if="entry.info?.special"
            class="w-1.5 h-1.5 rounded-full mt-1"
            :class="[
              entry.info.special === 'festivo' ? 'bg-festivo' : '',
              entry.info.special === 'receso' ? 'bg-receso' : '',
              entry.info.special === 'semana-santa' ? 'bg-semana-santa' : '',
              entry.info.special === 'vacaciones' ? 'bg-vacaciones' : '',
              entry.info.special === 'clausura' ? 'bg-clausura' : '',
              entry.info.special === 'celebracion' ? 'bg-celebracion' : '',
            ]"
          />
        </div>
      </div>
    </div>
  </section>
</template>
