import { describe, it, expect } from 'vitest'

// Import server utils directly (self-contained, no Nuxt aliases)
import { calendarData, getTodayInfo, buildNotificationMessage } from '../server/utils/calendar'

describe('Server Calendar Utils', () => {
  it('should have the same calendar data as client', () => {
    expect(Object.keys(calendarData).length).toBeGreaterThan(200)
    // Aug 12 = D1 (first cycle day)
    expect(calendarData['2025-08-12']!.cycleDay).toBe('D1')
    // Aug 11 = institutional day (no cycle)
    expect(calendarData['2025-08-11']!.special).toBe('receso')
  })

  it('getTodayInfo should return dateKey and info', () => {
    const result = getTodayInfo()
    expect(result.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(result).toHaveProperty('info')
  })

  it('buildNotificationMessage should handle cycle day', () => {
    const info = calendarData['2025-08-12']!
    const result = buildNotificationMessage('2025-08-12', info)
    expect(result.title).toContain('Dia 1')
    expect(result.body).toContain('D1')
  })

  it('buildNotificationMessage should handle special day', () => {
    const info = calendarData['2025-08-18']!
    const result = buildNotificationMessage('2025-08-18', info)
    expect(result.title).toBe('SEK Calendario')
    expect(result.body).toContain('Asuncion de la Virgen')
  })

  it('buildNotificationMessage should handle celebration without cycle', () => {
    const christmas = calendarData['2025-12-19']!
    const result = buildNotificationMessage('2025-12-19', christmas)
    expect(result.title).toBe('SEK Calendario')
    expect(result.body).toContain('Celebracion de navidad')
    expect(result.body).toContain('No hay clases')
  })

  it('buildNotificationMessage should handle null info', () => {
    const result = buildNotificationMessage('2025-08-16', null)
    expect(result.title).toBe('SEK Calendario')
    expect(result.body).toContain('no hay clases')
  })

  it('should have Feb 25 as D6 matching official schedule', () => {
    expect(calendarData['2026-02-25']!.cycleDay).toBe('D6')
  })
})
