import { describe, it, expect } from 'vitest'

// Import server utils directly (self-contained, no Nuxt aliases)
import { calendarData, getTodayInfo, buildNotificationMessage } from '../server/utils/calendar'

describe('Server Calendar Utils', () => {
  it('should have the same calendar data as client', () => {
    // Verify server has data
    expect(Object.keys(calendarData).length).toBeGreaterThan(200)
    expect(calendarData['2025-08-11']!.cycleDay).toBe('D1')
  })

  it('getTodayInfo should return dateKey and info', () => {
    const result = getTodayInfo()
    expect(result.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // info can be null if today is outside school year or weekend
    expect(result).toHaveProperty('info')
  })

  it('buildNotificationMessage should handle cycle day', () => {
    const info = calendarData['2025-08-11']!
    const result = buildNotificationMessage('2025-08-11', info)
    expect(result.title).toContain('Dia 1')
    expect(result.body).toContain('D1')
  })

  it('buildNotificationMessage should handle special day', () => {
    const info = calendarData['2025-08-18']!
    const result = buildNotificationMessage('2025-08-18', info)
    expect(result.title).toBe('SEK Calendario')
    expect(result.body).toContain('Asuncion de la Virgen')
  })

  it('buildNotificationMessage should handle celebration with cycle', () => {
    const halloween = calendarData['2025-10-31']!
    const result = buildNotificationMessage('2025-10-31', halloween)
    expect(result.title).toContain('Dia')
    expect(result.body).toContain('Dia de Disfraces')
  })

  it('buildNotificationMessage should handle null info', () => {
    const result = buildNotificationMessage('2025-08-16', null)
    expect(result.title).toBe('SEK Calendario')
    expect(result.body).toContain('no hay clases')
  })
})
