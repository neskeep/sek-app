// ---------------------------------------------------------------------------
// Server-side calendar logic (self-contained copy of app/data/calendar-2025-2026.ts)
// Cannot import from app/ — server and app are separate contexts in Nuxt.
// Based on the official SEK Colombia 2025-2026 cycle schedule.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Types (inline, mirroring types/calendar.ts)
// ---------------------------------------------------------------------------
export type CycleDay = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6'
export type SpecialDayType = 'festivo' | 'receso' | 'semana-santa' | 'vacaciones' | 'clausura' | 'celebracion'

export interface CalendarDayInfo {
  date: string // 'YYYY-MM-DD'
  cycleDay?: CycleDay
  special?: SpecialDayType
  label?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SCHOOL_YEAR_START = '2025-08-11'
const SCHOOL_YEAR_END = '2026-06-12'

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isWeekend(d: Date): boolean {
  const dow = d.getDay()
  return dow === 0 || dow === 6
}

/**
 * Generates all Monday-to-Friday dates in a range (inclusive).
 * Uses Date(year, month, day) to avoid timezone bugs.
 */
function weekdaysInRange(
  startYear: number, startMonth: number, startDay: number,
  endYear: number, endMonth: number, endDay: number,
): string[] {
  const dates: string[] = []
  const current = new Date(startYear, startMonth, startDay)
  const end = new Date(endYear, endMonth, endDay)

  while (current <= end) {
    if (!isWeekend(current)) {
      dates.push(formatDate(current))
    }
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// ---------------------------------------------------------------------------
// Special dates (based on official SEK Colombia 2025-2026 cycle schedule)
// ---------------------------------------------------------------------------
interface SpecialDayDef {
  type: SpecialDayType
  label: string
}

const specialDates: Record<string, SpecialDayDef> = {
  // Institutional day (no cycle, first day of school year)
  '2025-08-11': { type: 'receso', label: 'Jornada institucional' },

  // Colombian public holidays (within school year)
  '2025-08-18': { type: 'festivo', label: 'Asuncion de la Virgen' },
  '2025-10-13': { type: 'festivo', label: 'Dia de la Raza' },
  '2025-11-03': { type: 'festivo', label: 'Todos los Santos' },
  '2025-11-17': { type: 'festivo', label: 'Independencia de Cartagena' },
  '2025-12-08': { type: 'festivo', label: 'Inmaculada Concepcion' },
  '2026-01-12': { type: 'festivo', label: 'Dia de los Reyes Magos' },
  '2026-03-23': { type: 'festivo', label: 'San Jose' },
  '2026-05-01': { type: 'festivo', label: 'Dia del Trabajo' },
  '2026-05-18': { type: 'festivo', label: 'Ascension del Senor' },
  '2026-06-08': { type: 'festivo', label: 'Corpus Christi' },

  // Christmas celebration (no cycle day, does not advance rotation)
  '2025-12-19': { type: 'celebracion', label: 'Celebracion de navidad' },

  // Closing ceremony
  '2026-06-12': { type: 'clausura', label: 'Clausura' },
}

// October recess: 2025-10-06 to 2025-10-10
for (const date of weekdaysInRange(2025, 9, 6, 2025, 9, 10)) {
  specialDates[date] = { type: 'receso', label: 'Semana de receso' }
}

// End-of-year vacation: 2025-12-22 to 2026-01-11
for (const date of weekdaysInRange(2025, 11, 22, 2026, 0, 11)) {
  specialDates[date] = { type: 'vacaciones', label: 'Vacaciones' }
}
// Jan 13 explicitly marked as vacation in the schedule
specialDates['2026-01-13'] = { type: 'vacaciones', label: 'Vacaciones' }

// Holy Week: 2026-03-30 to 2026-04-03
const semanaSantaLabels: Record<string, string> = {
  '2026-03-30': 'Semana Santa',
  '2026-03-31': 'Semana Santa',
  '2026-04-01': 'Semana Santa',
  '2026-04-02': 'Jueves Santo',
  '2026-04-03': 'Viernes Santo',
}
for (const [date, label] of Object.entries(semanaSantaLabels)) {
  specialDates[date] = { type: 'semana-santa', label }
}

// End of activities: Jun 9-11 (no cycle, before closing ceremony)
for (const date of weekdaysInRange(2026, 5, 9, 2026, 5, 11)) {
  specialDates[date] = { type: 'receso', label: 'Fin de actividades' }
}

// ---------------------------------------------------------------------------
// Calendar generator
// All special days have NO cycleDay and do NOT advance the rotation.
// Only regular school days advance the D1-D6 cycle.
// ---------------------------------------------------------------------------
const CYCLE_DAYS: CycleDay[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']

function generateCalendar(): Record<string, CalendarDayInfo> {
  const result: Record<string, CalendarDayInfo> = {}
  let cycleIndex = 0

  const current = new Date(2025, 7, 11) // August 11, 2025
  const end = new Date(2026, 5, 12) // June 12, 2026

  while (current <= end) {
    const dateKey = formatDate(current)

    if (!isWeekend(current)) {
      const special = specialDates[dateKey]

      if (special) {
        // Special days: no cycleDay, do NOT advance the cycle
        result[dateKey] = {
          date: dateKey,
          special: special.type,
          label: special.label,
        }
      } else {
        // Normal school day
        result[dateKey] = {
          date: dateKey,
          cycleDay: CYCLE_DAYS[cycleIndex % 6],
        }
        cycleIndex++
      }
    }

    current.setDate(current.getDate() + 1)
  }

  return result
}

// ---------------------------------------------------------------------------
// Exported data
// ---------------------------------------------------------------------------
export const calendarData: Record<string, CalendarDayInfo> = generateCalendar()

// ---------------------------------------------------------------------------
// getTodayInfo — uses Colombia timezone (UTC-5) explicitly
// ---------------------------------------------------------------------------
export function getTodayInfo(): { dateKey: string; info: CalendarDayInfo | null } {
  const now = new Date()
  const colombiaOffset = -5 * 60 // Colombia is UTC-5, in minutes
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  const colombiaMs = utcMs + colombiaOffset * 60000
  const colombiaDate = new Date(colombiaMs)

  const dateKey = formatDate(colombiaDate)
  const info = calendarData[dateKey] ?? null

  return { dateKey, info }
}

// ---------------------------------------------------------------------------
// buildNotificationMessage — generates push notification content
// ---------------------------------------------------------------------------
export function buildNotificationMessage(
  dateKey: string,
  info: CalendarDayInfo | null,
): { title: string; body: string } {
  // Outside the school calendar or no entry
  if (!info) {
    return {
      title: 'SEK Calendario',
      body: 'Hoy no hay clases programadas.',
    }
  }

  // Cycle day present (normal school day)
  if (info.cycleDay) {
    const dayNumber = info.cycleDay.replace('D', '')
    return {
      title: `Dia ${dayNumber} del ciclo`,
      body: `Hoy es dia ${info.cycleDay} del ciclo rotativo.`,
    }
  }

  // Special day without cycle (holiday, recess, vacation, holy week, closing, celebration)
  if (info.label) {
    return {
      title: 'SEK Calendario',
      body: `${info.label} - No hay clases hoy.`,
    }
  }

  // Fallback
  return {
    title: 'SEK Calendario',
    body: 'Hoy no hay clases programadas.',
  }
}
