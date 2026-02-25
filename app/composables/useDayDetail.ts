// ---------------------------------------------------------------------------
// Composable: useDayDetail
// Shared state for the day detail bottom sheet.
// ---------------------------------------------------------------------------
import type { CalendarDayEntry } from '~~/types/calendar'

const _selectedDay = ref<CalendarDayEntry | null>(null)

export function useDayDetail() {
  function selectDay(entry: CalendarDayEntry) {
    _selectedDay.value = entry
  }

  function closeDetail() {
    _selectedDay.value = null
  }

  return {
    selectedDay: readonly(_selectedDay),
    selectDay,
    closeDetail,
  }
}
