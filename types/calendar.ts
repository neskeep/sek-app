export type CycleDay = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6'
export type SpecialDayType = 'festivo' | 'receso' | 'semana-santa' | 'vacaciones' | 'clausura' | 'celebracion'

export interface CalendarDayInfo {
  date: string // 'YYYY-MM-DD'
  cycleDay?: CycleDay
  special?: SpecialDayType
  label?: string
}

export interface CalendarDayEntry {
  date: string // 'YYYY-MM-DD'
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  info?: CalendarDayInfo
}
