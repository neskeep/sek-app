// Public endpoint: returns today's cycle day info.
// Used by the Service Worker for periodic badge updates.
// No authentication required — only returns public calendar data.

export default defineEventHandler(() => {
  const { dateKey, info } = getTodayInfo()

  return {
    date: dateKey,
    cycleDay: info?.cycleDay ?? null,
    special: info?.special ?? null,
    label: info?.label ?? null,
  }
})
