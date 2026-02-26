import type { CalendarDayInfo, CalendarDayEntry, CycleDay, SpecialDayType } from '~~/types/calendar'
import { calendarData, SCHOOL_YEAR_START, SCHOOL_YEAR_END } from '~/data/calendar-2025-2026'
import { MONTH_NAMES } from '~/data/constants'

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------
function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildEntry(d: Date, currentMonth: number, todayKey: string): CalendarDayEntry {
  const dateKey = formatDate(d)
  const dow = d.getDay()
  return {
    date: dateKey,
    dayOfMonth: d.getDate(),
    isCurrentMonth: d.getMonth() === currentMonth,
    isToday: dateKey === todayKey,
    isWeekend: dow === 0 || dow === 6,
    info: calendarData[dateKey],
  }
}

// ---------------------------------------------------------------------------
// Mapas de colores
// ---------------------------------------------------------------------------
const SPECIAL_DAY_COLORS: Record<SpecialDayType, string> = {
  festivo: 'bg-red-100 text-red-700',
  receso: 'bg-amber-100 text-amber-700',
  'semana-santa': 'bg-purple-100 text-purple-700',
  vacaciones: 'bg-green-100 text-green-700',
  clausura: 'bg-accent/10 text-accent',
  celebracion: 'bg-gold/10 text-gold',
}

const CYCLE_DAY_COLORS: Record<CycleDay, string> = {
  D1: 'bg-primary text-white',
  D2: 'bg-secondary text-white',
  D3: 'bg-accent text-white',
  D4: 'bg-gold text-primary',
  D5: 'bg-primary/80 text-white',
  D6: 'bg-secondary/80 text-white',
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------
export function useCalendar() {
  const now = useNow({ interval: 60000 })

  // Fecha actual en zona horaria de Colombia (UTC-5), sin componente de hora.
  // Esto garantiza que usuarios en otras zonas horarias vean el dia correcto.
  const currentDate = computed(() => {
    const colombiaOffset = -5 * 60 // Colombia UTC-5 en minutos
    const utcMs = now.value.getTime() + now.value.getTimezoneOffset() * 60000
    const colombiaMs = utcMs + colombiaOffset * 60000
    const colombiaDate = new Date(colombiaMs)
    return new Date(colombiaDate.getFullYear(), colombiaDate.getMonth(), colombiaDate.getDate())
  })

  const todayKey = computed(() => formatDate(currentDate.value))

  // Mes y ano visibles en el grid
  const viewMonth = ref(currentDate.value.getMonth())
  const viewYear = ref(currentDate.value.getFullYear())

  // Info de hoy
  const todayInfo = computed<CalendarDayInfo | null>(() =>
    calendarData[todayKey.value] ?? null
  )

  const todayCycleDay = computed<CycleDay | null>(() =>
    todayInfo.value?.cycleDay ?? null
  )

  const isSchoolDay = computed<boolean>(() =>
    todayCycleDay.value !== null
  )

  // Nombre del mes visible
  const viewMonthName = computed<string>(() =>
    MONTH_NAMES[viewMonth.value]
  )

  // ---------------------------------------------------------------------------
  // Month grid: 6 semanas x 7 dias, lunes-first
  // ---------------------------------------------------------------------------
  const monthGrid = computed<CalendarDayEntry[][]>(() => {
    const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)

    // Dia de la semana del primero del mes (0=dom, 1=lun, ..., 6=sab)
    // Convertir a lunes-first: lun=0, mar=1, ..., dom=6
    let dow = firstOfMonth.getDay()
    const mondayOffset = dow === 0 ? 6 : dow - 1

    // Retroceder al lunes de esa semana
    const gridStart = new Date(viewYear.value, viewMonth.value, 1 - mondayOffset)

    const weeks: CalendarDayEntry[][] = []
    const cursor = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate())

    for (let w = 0; w < 6; w++) {
      const week: CalendarDayEntry[] = []
      for (let d = 0; d < 7; d++) {
        week.push(buildEntry(cursor, viewMonth.value, todayKey.value))
        cursor.setDate(cursor.getDate() + 1)
      }
      weeks.push(week)
    }

    return weeks
  })

  // ---------------------------------------------------------------------------
  // Current week: lunes a viernes de la semana actual
  // ---------------------------------------------------------------------------
  const currentWeek = computed<CalendarDayEntry[]>(() => {
    const today = currentDate.value
    let dow = today.getDay() // 0=dom, 1=lun, ..., 6=sab
    // Calcular offset al lunes
    const mondayOffset = dow === 0 ? 6 : dow - 1
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset)

    const entries: CalendarDayEntry[] = []
    const cursor = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate())

    for (let i = 0; i < 5; i++) {
      entries.push(buildEntry(cursor, today.getMonth(), todayKey.value))
      cursor.setDate(cursor.getDate() + 1)
    }

    return entries
  })

  // ---------------------------------------------------------------------------
  // Navegacion
  // ---------------------------------------------------------------------------
  const canGoNext = computed(() => !(viewYear.value === 2026 && viewMonth.value >= 5))
  const canGoPrev = computed(() => !(viewYear.value === 2025 && viewMonth.value <= 7))

  function nextMonth(): void {
    // Limite: Junio 2026 (mes 5)
    if (viewYear.value === 2026 && viewMonth.value >= 5) return
    if (viewMonth.value === 11) {
      viewMonth.value = 0
      viewYear.value++
    } else {
      viewMonth.value++
    }
  }

  function prevMonth(): void {
    // Limite: Agosto 2025 (mes 7)
    if (viewYear.value === 2025 && viewMonth.value <= 7) return
    if (viewMonth.value === 0) {
      viewMonth.value = 11
      viewYear.value--
    } else {
      viewMonth.value--
    }
  }

  function goToToday(): void {
    viewMonth.value = currentDate.value.getMonth()
    viewYear.value = currentDate.value.getFullYear()
  }

  // ---------------------------------------------------------------------------
  // Colores
  // ---------------------------------------------------------------------------
  function getSpecialDayColor(type: SpecialDayType): string {
    return SPECIAL_DAY_COLORS[type]
  }

  function getCycleDayColor(cycleDay: CycleDay): string {
    return CYCLE_DAY_COLORS[cycleDay]
  }

  return {
    currentDate,
    viewMonth,
    viewYear,
    todayCycleDay,
    todayInfo,
    isSchoolDay,
    monthGrid,
    currentWeek,
    viewMonthName,
    nextMonth,
    prevMonth,
    goToToday,
    canGoNext,
    canGoPrev,
    getSpecialDayColor,
    getCycleDayColor,
  }
}
