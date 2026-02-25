import type { CalendarDayInfo, CycleDay, SpecialDayType } from '~~/types/calendar'

// ---------------------------------------------------------------------------
// Constantes del ano escolar
// ---------------------------------------------------------------------------
export const SCHOOL_YEAR_START = '2025-08-11'
export const SCHOOL_YEAR_END = '2026-06-12'

// ---------------------------------------------------------------------------
// Helpers internos
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
 * Genera todas las fechas de lunes a viernes en un rango dado (inclusive).
 * Usa Date(year, month, day) para evitar bugs de timezone.
 */
function weekdaysInRange(startYear: number, startMonth: number, startDay: number, endYear: number, endMonth: number, endDay: number): string[] {
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
// Dias especiales (basado en cronograma oficial SEK Colombia 2025-2026)
// ---------------------------------------------------------------------------
interface SpecialDayDef {
  type: SpecialDayType
  label: string
}

const specialDates: Record<string, SpecialDayDef> = {
  // Jornada institucional (sin ciclo, primer dia del ano escolar)
  '2025-08-11': { type: 'receso', label: 'Jornada institucional' },

  // Festivos colombianos (dentro del ano escolar)
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

  // Celebracion de navidad (sin dia de ciclo, no avanza rotacion)
  '2025-12-19': { type: 'celebracion', label: 'Celebracion de navidad' },

  // Clausura
  '2026-06-12': { type: 'clausura', label: 'Clausura' },
}

// Semana de receso octubre: 2025-10-06 a 2025-10-10
for (const date of weekdaysInRange(2025, 9, 6, 2025, 9, 10)) {
  specialDates[date] = { type: 'receso', label: 'Semana de receso' }
}

// Vacaciones de fin de ano: 2025-12-22 a 2026-01-11
for (const date of weekdaysInRange(2025, 11, 22, 2026, 0, 11)) {
  specialDates[date] = { type: 'vacaciones', label: 'Vacaciones' }
}
// Ene 13 marcado explicitamente como vacaciones en el cronograma
specialDates['2026-01-13'] = { type: 'vacaciones', label: 'Vacaciones' }

// Semana Santa: 2026-03-30 a 2026-04-03
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

// Fin de actividades: Jun 9-11 (sin ciclo, previo a clausura)
for (const date of weekdaysInRange(2026, 5, 9, 2026, 5, 11)) {
  specialDates[date] = { type: 'receso', label: 'Fin de actividades' }
}

// ---------------------------------------------------------------------------
// Generador del calendario
// Todos los dias especiales NO tienen cycleDay y NO avanzan la rotacion.
// Solo los dias escolares regulares avanzan el ciclo D1-D6.
// ---------------------------------------------------------------------------
const CYCLE_DAYS: CycleDay[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6']

function generateCalendar(): Record<string, CalendarDayInfo> {
  const result: Record<string, CalendarDayInfo> = {}
  let cycleIndex = 0

  const current = new Date(2025, 7, 11) // Agosto 11, 2025
  const end = new Date(2026, 5, 12) // Junio 12, 2026

  while (current <= end) {
    const dateKey = formatDate(current)

    if (!isWeekend(current)) {
      const special = specialDates[dateKey]

      if (special) {
        // Dias especiales: sin cycleDay, NO avanzan el ciclo
        result[dateKey] = {
          date: dateKey,
          special: special.type,
          label: special.label,
        }
      } else {
        // Dia escolar normal
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
// Exportacion principal
// ---------------------------------------------------------------------------
export const calendarData: Record<string, CalendarDayInfo> = generateCalendar()
