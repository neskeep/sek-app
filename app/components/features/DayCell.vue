<script setup lang="ts">
import type { CalendarDayEntry } from '~~/types/calendar'

interface Props {
  entry: CalendarDayEntry
}

const props = defineProps<Props>()

const { getSpecialDayColor, getCycleDayColor } = useCalendar()

const cycleNumber = computed(() => props.entry.info?.cycleDay?.replace('D', '') ?? null)

const ariaLabel = computed(() => {
  const parts = [String(props.entry.dayOfMonth)]
  if (props.entry.info?.cycleDay) {
    parts.push(`Dia ${props.entry.info.cycleDay.replace('D', '')} del ciclo`)
  }
  if (props.entry.info?.label) {
    parts.push(props.entry.info.label)
  }
  if (props.entry.isToday) {
    parts.push('Hoy')
  }
  return parts.join(', ')
})

const cellClasses = computed(() => {
  const classes: string[] = ['day-cell', 'cursor-default']

  if (!props.entry.isCurrentMonth) {
    classes.push('opacity-30')
    return classes
  }

  if (props.entry.isWeekend) {
    classes.push('opacity-50')
    return classes
  }

  if (props.entry.isToday) {
    classes.push('ring-2 ring-secondary ring-offset-1')
  }

  if (props.entry.info?.special) {
    classes.push(getSpecialDayColor(props.entry.info.special))
  } else {
    classes.push('hover:bg-gray-50')
  }

  return classes
})
</script>

<template>
  <div :class="cellClasses" role="gridcell" :aria-label="ariaLabel">
    <!-- Day number -->
    <span
      class="text-sm font-semibold leading-none"
      :class="[
        entry.isToday ? 'text-secondary' : '',
        entry.info?.special && entry.isCurrentMonth && !entry.isWeekend ? 'text-current' : '',
        !entry.isToday && !entry.info?.special ? 'text-gray-700' : '',
      ]"
    >
      {{ entry.dayOfMonth }}
    </span>

    <!-- Cycle badge -->
    <span
      v-if="cycleNumber && entry.isCurrentMonth && !entry.isWeekend"
      class="cycle-badge mt-0.5"
      :class="getCycleDayColor(entry.info!.cycleDay!)"
    >
      {{ cycleNumber }}
    </span>

    <!-- Special day dot (when no cycle day, just special) -->
    <span
      v-else-if="entry.info?.special && entry.isCurrentMonth && !entry.isWeekend && !cycleNumber"
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

    <!-- Special day label tooltip (on hover, for desktop) -->
    <span
      v-if="entry.info?.label && entry.isCurrentMonth"
      class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] leading-tight text-gray-400 truncate max-w-full px-0.5 hidden md:block"
      aria-hidden="true"
    >
      {{ entry.info.label }}
    </span>
  </div>
</template>
