// ---------------------------------------------------------------------------
// Server-side calendar logic (self-contained copy of app/data/calendar-2025-2026.ts)
// Cannot import from app/ — server and app are separate contexts in Nuxt.
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
// Special dates
// ---------------------------------------------------------------------------
interface SpecialDayDef {
  type: SpecialDayType
  label: string
}

const specialDates: Record<string, SpecialDayDef> = {
  // Colombian public holidays (within school year)
  '2025-08-18': { type: 'festivo', label: 'Asuncion de la Virgen' },
  '2025-10-13': { type: 'festivo', label: 'Dia de la Raza' },
  '2025-11-03': { type: 'festivo', label: 'Todos los Santos' },
  '2025-11-17': { type: 'festivo', label: 'Independencia de Cartagena' },
  '2025-12-08': { type: 'festivo', label: 'Inmaculada Concepcion' },
  '2026-03-23': { type: 'festivo', label: 'San Jose' },
  '2026-05-01': { type: 'festivo', label: 'Dia del Trabajo' },
  '2026-05-18': { type: 'festivo', label: 'Ascension del Senor' },
  '2026-06-08': { type: 'festivo', label: 'Corpus Christi' },

  // Closing ceremony
  '2026-06-12': { type: 'clausura', label: 'Clausura' },

  // Celebrations (have cycleDay + special, advance cycle)
  '2025-10-31': { type: 'celebracion', label: 'Dia de Disfraces' },
  '2026-04-23': { type: 'celebracion', label: 'Dia del Idioma' },
  '2026-05-15': { type: 'celebracion', label: 'Dia del Maestro' },
}

// October recess: 2025-10-06 to 2025-10-10
for (const date of weekdaysInRange(2025, 9, 6, 2025, 9, 10)) {
  specialDates[date] = { type: 'receso', label: 'Receso escolar' }
}

// End-of-year vacation: 2025-12-15 to 2026-01-19
for (const date of weekdaysInRange(2025, 11, 15, 2026, 0, 19)) {
  specialDates[date] = { type: 'vacaciones', label: 'Vacaciones' }
}

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

// ---------------------------------------------------------------------------
// Calendar generator
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
        if (special.type === 'celebracion') {
          // Celebrations: have cycleDay AND special, advance the cycle
          result[dateKey] = {
            date: dateKey,
            cycleDay: CYCLE_DAYS[cycleIndex % 6],
            special: special.type,
            label: special.label,
          }
          cycleIndex++
        }
        else {
          // Holidays, recesses, vacations, holy week, closing: no cycleDay, do NOT advance the cycle
          result[dateKey] = {
            date: dateKey,
            special: special.type,
            label: special.label,
          }
        }
      }
      else {
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

  // Cycle day present (normal school day or celebration with cycle)
  if (info.cycleDay) {
    const dayNumber = info.cycleDay.replace('D', '')

    // Celebration with cycle day
    if (info.special === 'celebracion' && info.label) {
      return {
        title: `Dia ${dayNumber} del ciclo`,
        body: `${info.label} - ${dateKey}`,
      }
    }

    // Normal cycle day
    return {
      title: `Dia ${dayNumber} del ciclo`,
      body: `Hoy es dia ${info.cycleDay} del ciclo rotativo.`,
    }
  }

  // Special day without cycle (holiday, recess, vacation, holy week, closing)
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
